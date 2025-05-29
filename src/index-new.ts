#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { TodoStore } from "./todo-store.js";
import { PocketBaseManager } from "./pocketbase-manager.js";
import { TODO_TOOLS } from "./tool-definitions.js";
import { TodoToolHandlers } from "./tool-handlers.js";

class TodoMCPServer {
  private server: Server;
  private todoStore: TodoStore;
  private pocketbaseManager: PocketBaseManager;
  private toolHandlers: TodoToolHandlers;

  constructor() {
    this.server = new Server(
      {
        name: "todo-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.pocketbaseManager = new PocketBaseManager();
    this.todoStore = new TodoStore();
    this.toolHandlers = new TodoToolHandlers(this.todoStore);

    this.setupHandlers();
    this.setupShutdownHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return { tools: TODO_TOOLS };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        return await this.toolHandlers.handleToolCall(name, args);
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    });
  }

  private setupShutdownHandlers() {
    // Handle graceful shutdown
    process.on("SIGINT", () => {
      console.error("Received SIGINT, shutting down gracefully...");
      this.pocketbaseManager.stop();
      process.exit(0);
    });

    process.on("SIGTERM", () => {
      console.error("Received SIGTERM, shutting down gracefully...");
      this.pocketbaseManager.stop();
      process.exit(0);
    });

    process.on("exit", () => {
      this.pocketbaseManager.stop();
    });
  }

  async run() {
    try {
      // Only auto-start PocketBase if the environment variable is set
      const autoStart = process.env.MCP_AUTO_START_POCKETBASE === "true";

      if (autoStart) {
        console.error("Auto-starting PocketBase...");
        await this.pocketbaseManager.start();
      } else {
        // Check if PocketBase is already running
        if (!(await this.isPocketBaseRunning())) {
          console.error(
            "Warning: PocketBase is not running. Start it manually with 'npm run pocketbase' or set MCP_AUTO_START_POCKETBASE=true"
          );
        }
      }

      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      console.error("Todo MCP server running on stdio");
    } catch (error) {
      console.error("Failed to start server:", error);
      this.pocketbaseManager.stop();
      process.exit(1);
    }
  }

  private async isPocketBaseRunning(): Promise<boolean> {
    try {
      const response = await fetch("http://127.0.0.1:8090/api/health", {
        method: "GET",
        signal: AbortSignal.timeout(1000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

const server = new TodoMCPServer();
server.run().catch(console.error);
