#!/usr/bin/env node

import { Command } from "commander";
import figlet from "figlet";
import boxen from "boxen";
import chalk from "chalk";
import inquirer from "inquirer";
import { TodoService } from "./services/todoService.js";
import { listTodos, listTodosTable } from "./commands/list.js";
import { createTodo, quickAdd } from "./commands/create.js";
import { completeTodo, uncompleteTodo } from "./commands/complete.js";
import { deleteTodo, clearCompleted } from "./commands/delete.js";
import { showStats, showOverdue } from "./commands/stats.js";
import { colors } from "./utils/formatting.js";

const todoService = new TodoService();
const program = new Command();

// CLI Header
function showHeader(): void {
  const title = figlet.textSync("Todo CLI", {
    font: "Small",
    horizontalLayout: "default",
    verticalLayout: "default",
  });

  const header = boxen(
    chalk.cyan(title) +
      "\n\n" +
      chalk.gray("Interactive todo management for your MCP server"),
    {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "cyan",
    }
  );

  console.log(header);
}

// Interactive mode
async function interactiveMode(): Promise<void> {
  showHeader();

  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          { name: "📋 List todos", value: "list" },
          { name: "📊 Show table view", value: "table" },
          { name: "➕ Add new todo", value: "add" },
          { name: "✅ Complete todo", value: "complete" },
          { name: "🔄 Reopen todo", value: "uncomplete" },
          { name: "🗑️  Delete todo", value: "delete" },
          { name: "📈 Show statistics", value: "stats" },
          { name: "⏰ Show overdue todos", value: "overdue" },
          { name: "🧹 Clear completed", value: "clear" },
          new inquirer.Separator(),
          { name: "🚪 Exit (or press 'q')", value: "exit" },
        ],
      },
    ]);

    // Check if user pressed 'q' to quit
    if (action === "q" || action === "Q") {
      console.log(colors.primary("\n👋 Goodbye!\n"));
      process.exit(0);
    }

    try {
      switch (action) {
        case "list":
          await handleListInteractive();
          break;
        case "table":
          await handleTableInteractive();
          break;
        case "add":
          await createTodo(todoService, { interactive: true });
          break;
        case "complete":
          await completeTodo(todoService, { interactive: true });
          break;
        case "uncomplete":
          await uncompleteTodo(todoService);
          break;
        case "delete":
          await deleteTodo(todoService);
          break;
        case "stats":
          await showStats(todoService);
          break;
        case "overdue":
          await showOverdue(todoService);
          break;
        case "clear":
          await clearCompleted(todoService);
          break;
        case "exit":
          console.log(colors.primary("\n👋 Goodbye!\n"));
          process.exit(0);
      }
    } catch (error) {
      console.error(
        colors.error(
          `\n❌ Error: ${
            error instanceof Error ? error.message : "Unknown error"
          }\n`
        )
      );
    }

    // Pause before showing menu again
    const { continue: continueInput } = await inquirer.prompt([
      {
        type: "input",
        name: "continue",
        message: "Press Enter to continue (or 'q' to quit)...",
      },
    ]);

    // Check if user pressed 'q' to quit at the continue prompt
    if (continueInput === "q" || continueInput === "Q") {
      console.log(colors.primary("\n👋 Goodbye!\n"));
      process.exit(0);
    }
  }
}

async function handleListInteractive(): Promise<void> {
  const { filters } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "filters",
      message: "Apply filters (optional):",
      choices: [
        { name: "Only pending todos", value: "pending" },
        { name: "Only completed todos", value: "completed" },
        { name: "Only high priority", value: "high" },
        { name: "Only medium priority", value: "medium" },
        { name: "Only low priority", value: "low" },
      ],
    },
  ]);

  const options: any = {};

  if (filters.includes("pending")) options.status = "pending";
  if (filters.includes("completed")) options.status = "completed";
  if (filters.includes("high")) options.priority = "high";
  if (filters.includes("medium")) options.priority = "medium";
  if (filters.includes("low")) options.priority = "low";

  await listTodos(todoService, options);
}

async function handleTableInteractive(): Promise<void> {
  const { filters } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "filters",
      message: "Apply filters (optional):",
      choices: [
        { name: "Only pending todos", value: "pending" },
        { name: "Only completed todos", value: "completed" },
        { name: "Only high priority", value: "high" },
        { name: "Only medium priority", value: "medium" },
        { name: "Only low priority", value: "low" },
      ],
    },
  ]);

  const options: any = {};

  if (filters.includes("pending")) options.status = "pending";
  if (filters.includes("completed")) options.status = "completed";
  if (filters.includes("high")) options.priority = "high";
  if (filters.includes("medium")) options.priority = "medium";
  if (filters.includes("low")) options.priority = "low";

  await listTodosTable(todoService, options);
}

// CLI Commands
program
  .name("todo")
  .description("Interactive CLI for MCP Todo Server")
  .version("1.0.0");

// List commands
program
  .command("list")
  .alias("ls")
  .description("List todos")
  .option(
    "--status <status>",
    "Filter by status (pending, completed, all)",
    "all"
  )
  .option(
    "--priority <priority>",
    "Filter by priority (high, medium, low, all)",
    "all"
  )
  .option("--search <query>", "Search todos by text")
  .option("--table", "Show in table format")
  .action(async (options) => {
    try {
      const filterOptions: any = {};

      if (options.status !== "all") {
        filterOptions.status = options.status;
      }

      if (options.priority !== "all") {
        filterOptions.priority = options.priority;
      }

      if (options.search) {
        filterOptions.search = options.search;
      }

      if (options.table) {
        await listTodosTable(todoService, filterOptions);
      } else {
        await listTodos(todoService, filterOptions);
      }
    } catch (error) {
      console.error(
        colors.error(
          `❌ ${error instanceof Error ? error.message : "Unknown error"}`
        )
      );
      process.exit(1);
    }
  });

// Add commands
program
  .command("add [title...]")
  .alias("create")
  .description("Add a new todo")
  .option("-d, --description <description>", "Todo description")
  .option("-p, --priority <priority>", "Priority (high, medium, low)", "medium")
  .option("-t, --tags <tags>", "Comma-separated tags")
  .option("--due <date>", "Due date (YYYY-MM-DD)")
  .option("-i, --interactive", "Interactive mode")
  .action(async (titleWords, options) => {
    try {
      const title = titleWords.join(" ");

      if (!title && !options.interactive) {
        await createTodo(todoService, { interactive: true });
        return;
      }

      if (title && !options.interactive) {
        // Quick add mode
        await quickAdd(todoService, title);
        return;
      }

      await createTodo(todoService, {
        title,
        description: options.description,
        priority: options.priority,
        tags: options.tags
          ? options.tags.split(",").map((t: string) => t.trim())
          : undefined,
        dueDate: options.due,
        interactive: options.interactive,
      });
    } catch (error) {
      console.error(
        colors.error(
          `❌ ${error instanceof Error ? error.message : "Unknown error"}`
        )
      );
      process.exit(1);
    }
  });

// Complete commands
program
  .command("complete [search]")
  .alias("done")
  .description("Mark a todo as completed")
  .option("--id <id>", "Todo ID")
  .action(async (search, options) => {
    try {
      await completeTodo(todoService, {
        id: options.id,
        search,
        interactive: !options.id && !search,
      });
    } catch (error) {
      console.error(
        colors.error(
          `❌ ${error instanceof Error ? error.message : "Unknown error"}`
        )
      );
      process.exit(1);
    }
  });

program
  .command("uncomplete [search]")
  .alias("reopen")
  .description("Reopen a completed todo")
  .option("--id <id>", "Todo ID")
  .action(async (search, options) => {
    try {
      await uncompleteTodo(todoService, {
        id: options.id,
        search,
      });
    } catch (error) {
      console.error(
        colors.error(
          `❌ ${error instanceof Error ? error.message : "Unknown error"}`
        )
      );
      process.exit(1);
    }
  });

// Delete commands
program
  .command("delete [search]")
  .alias("remove")
  .alias("rm")
  .description("Delete a todo")
  .option("--id <id>", "Todo ID")
  .option("-f, --force", "Skip confirmation")
  .action(async (search, options) => {
    try {
      await deleteTodo(todoService, {
        id: options.id,
        search,
        force: options.force,
      });
    } catch (error) {
      console.error(
        colors.error(
          `❌ ${error instanceof Error ? error.message : "Unknown error"}`
        )
      );
      process.exit(1);
    }
  });

program
  .command("clear")
  .description("Clear all completed todos")
  .option("-f, --force", "Skip confirmation")
  .action(async (options) => {
    try {
      await clearCompleted(todoService, {
        force: options.force,
      });
    } catch (error) {
      console.error(
        colors.error(
          `❌ ${error instanceof Error ? error.message : "Unknown error"}`
        )
      );
      process.exit(1);
    }
  });

// Stats commands
program
  .command("stats")
  .description("Show todo statistics")
  .action(async () => {
    try {
      await showStats(todoService);
    } catch (error) {
      console.error(
        colors.error(
          `❌ ${error instanceof Error ? error.message : "Unknown error"}`
        )
      );
      process.exit(1);
    }
  });

program
  .command("overdue")
  .description("Show overdue todos")
  .action(async () => {
    try {
      await showOverdue(todoService);
    } catch (error) {
      console.error(
        colors.error(
          `❌ ${error instanceof Error ? error.message : "Unknown error"}`
        )
      );
      process.exit(1);
    }
  });

// Interactive mode
program
  .command("interactive")
  .alias("i")
  .description("Start interactive mode")
  .action(async () => {
    try {
      await interactiveMode();
    } catch (error) {
      console.error(
        colors.error(
          `❌ ${error instanceof Error ? error.message : "Unknown error"}`
        )
      );
      process.exit(1);
    }
  });

// Default to interactive if no args
if (process.argv.length === 2) {
  interactiveMode().catch((error) => {
    console.error(
      colors.error(
        `❌ ${error instanceof Error ? error.message : "Unknown error"}`
      )
    );
    process.exit(1);
  });
} else {
  program.parse();
}
