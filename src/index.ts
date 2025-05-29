#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { TodoStore } from "./todo-store.js";
import { CreateTodoRequest, UpdateTodoRequest } from "./types.js";
import { spawn, ChildProcess } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

class PocketBaseManager {
  private process: ChildProcess | null = null;
  private isStarting = false;

  async start(): Promise<void> {
    if (this.process || this.isStarting) {
      return; // Already running or starting
    }

    this.isStarting = true;

    try {
      // First check if PocketBase is already running
      if (await this.isPocketBaseRunning()) {
        console.error("PocketBase is already running");
        this.isStarting = false;
        return;
      }

      // Get the directory where this script is located
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const projectRoot = join(__dirname, "..");
      const pocketbasePath = join(projectRoot, "pocketbase", "pocketbase");

      console.error("Starting PocketBase server...");

      this.process = spawn(pocketbasePath, ["serve"], {
        cwd: projectRoot,
        stdio: ["ignore", "ignore", "ignore"], // Suppress all output
        detached: false,
      });

      // Simple startup: just wait a short time and check if it's running
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (await this.isPocketBaseRunning()) {
        console.error("PocketBase started successfully");
      } else {
        throw new Error("PocketBase failed to start");
      }
    } catch (error) {
      console.error("Failed to start PocketBase:", error);
      this.process = null;
    } finally {
      this.isStarting = false;
    }
  }

  private async isPocketBaseRunning(): Promise<boolean> {
    try {
      const response = await fetch("http://127.0.0.1:8090/api/health", {
        method: "GET",
        signal: AbortSignal.timeout(1000), // 1 second timeout
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  stop(): void {
    if (this.process) {
      console.error("Stopping PocketBase...");
      this.process.kill();
      this.process = null;
    }
  }
}

class TodoMCPServer {
  private server: Server;
  private todoStore: TodoStore;
  private pocketbaseManager: PocketBaseManager;

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
    this.setupHandlers();
    this.setupShutdownHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "create_todo",
            description: "Create a new todo item",
            inputSchema: {
              type: "object",
              properties: {
                title: { type: "string", description: "Todo title" },
                description: {
                  type: "string",
                  description: "Todo description",
                },
                dueDate: {
                  type: "string",
                  description: "Due date (ISO string)",
                },
                priority: {
                  type: "string",
                  enum: ["low", "medium", "high"],
                  description: "Todo priority",
                },
                tags: {
                  type: "array",
                  items: { type: "string" },
                  description: "Todo tags",
                },
              },
              required: ["title"],
            },
          },
          {
            name: "get_todo",
            description: "Get a specific todo by ID",
            inputSchema: {
              type: "object",
              properties: {
                id: { type: "string", description: "Todo ID" },
              },
              required: ["id"],
            },
          },
          {
            name: "list_todos",
            description: "List all todos",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "update_todo",
            description: "Update an existing todo",
            inputSchema: {
              type: "object",
              properties: {
                id: { type: "string", description: "Todo ID" },
                title: { type: "string", description: "Todo title" },
                description: {
                  type: "string",
                  description: "Todo description",
                },
                completed: {
                  type: "boolean",
                  description: "Completion status",
                },
                dueDate: {
                  type: "string",
                  description: "Due date (ISO string)",
                },
                priority: {
                  type: "string",
                  enum: ["low", "medium", "high"],
                  description: "Todo priority",
                },
                tags: {
                  type: "array",
                  items: { type: "string" },
                  description: "Todo tags",
                },
              },
              required: ["id"],
            },
          },
          {
            name: "delete_todo",
            description: "Delete a todo",
            inputSchema: {
              type: "object",
              properties: {
                id: { type: "string", description: "Todo ID" },
              },
              required: ["id"],
            },
          },
          {
            name: "search_todos",
            description: "Search todos by title, description, or tags",
            inputSchema: {
              type: "object",
              properties: {
                query: { type: "string", description: "Search query" },
              },
              required: ["query"],
            },
          },
          {
            name: "get_todos_by_status",
            description: "Get todos by completion status",
            inputSchema: {
              type: "object",
              properties: {
                completed: {
                  type: "boolean",
                  description: "Completion status",
                },
              },
              required: ["completed"],
            },
          },
          {
            name: "get_todos_by_priority",
            description: "Get todos by priority level",
            inputSchema: {
              type: "object",
              properties: {
                priority: {
                  type: "string",
                  enum: ["low", "medium", "high"],
                  description: "Priority level",
                },
              },
              required: ["priority"],
            },
          },
          {
            name: "get_todos_by_tag",
            description: "Get todos by tag",
            inputSchema: {
              type: "object",
              properties: {
                tag: { type: "string", description: "Tag name" },
              },
              required: ["tag"],
            },
          },
          {
            name: "get_overdue_todos",
            description: "Get all overdue todos",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "get_todo_stats",
            description: "Get todo statistics",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "add_sample_todos",
            description: "Add sample todos to get started",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
        ] as Tool[],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "create_todo": {
            const createArgs = args as any;
            if (!createArgs?.title) {
              throw new Error("Title is required");
            }
            const todo = await this.todoStore.createTodo(createArgs);
            return {
              content: [
                {
                  type: "text",
                  text: `Created todo: ${JSON.stringify(todo, null, 2)}`,
                },
              ],
            };
          }

          case "get_todo": {
            const { id } = args as any;
            if (!id) {
              throw new Error("ID is required");
            }
            const todo = await this.todoStore.getTodo(id);
            if (!todo) {
              return {
                content: [
                  {
                    type: "text",
                    text: `Todo with ID ${id} not found`,
                  },
                ],
              };
            }
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(todo, null, 2),
                },
              ],
            };
          }

          case "list_todos": {
            const todos = await this.todoStore.getAllTodos();
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(todos, null, 2),
                },
              ],
            };
          }

          case "update_todo": {
            const updateArgs = args as any;
            if (!updateArgs?.id) {
              throw new Error("ID is required");
            }
            const { id, ...updateData } = updateArgs;
            const todo = await this.todoStore.updateTodo(id, updateData);
            if (!todo) {
              return {
                content: [
                  {
                    type: "text",
                    text: `Todo with ID ${id} not found`,
                  },
                ],
              };
            }
            return {
              content: [
                {
                  type: "text",
                  text: `Updated todo: ${JSON.stringify(todo, null, 2)}`,
                },
              ],
            };
          }

          case "delete_todo": {
            const { id } = args as any;
            if (!id) {
              throw new Error("ID is required");
            }
            const deleted = await this.todoStore.deleteTodo(id);
            return {
              content: [
                {
                  type: "text",
                  text: deleted
                    ? `Deleted todo with ID ${id}`
                    : `Todo with ID ${id} not found`,
                },
              ],
            };
          }

          case "search_todos": {
            const { query } = args as any;
            if (!query) {
              throw new Error("Query is required");
            }
            const todos = await this.todoStore.searchTodos(query);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(todos, null, 2),
                },
              ],
            };
          }

          case "get_todos_by_status": {
            const { completed } = args as any;
            if (completed === undefined) {
              throw new Error("Completed status is required");
            }
            const todos = await this.todoStore.getTodosByStatus(completed);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(todos, null, 2),
                },
              ],
            };
          }

          case "get_todos_by_priority": {
            const { priority } = args as any;
            if (!priority) {
              throw new Error("Priority is required");
            }
            const todos = await this.todoStore.getTodosByPriority(priority);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(todos, null, 2),
                },
              ],
            };
          }

          case "get_todos_by_tag": {
            const { tag } = args as any;
            if (!tag) {
              throw new Error("Tag is required");
            }
            const todos = await this.todoStore.getTodosByTag(tag);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(todos, null, 2),
                },
              ],
            };
          }

          case "get_overdue_todos": {
            const todos = await this.todoStore.getOverdueTodos();
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(todos, null, 2),
                },
              ],
            };
          }

          case "get_todo_stats": {
            const stats = await this.todoStore.getStats();
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(stats, null, 2),
                },
              ],
            };
          }

          case "add_sample_todos": {
            await this.todoStore.addSampleTodos();
            return {
              content: [
                {
                  type: "text",
                  text: "Sample todos added successfully!",
                },
              ],
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
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
