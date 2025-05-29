import inquirer from "inquirer";
import chalk from "chalk";
import Table from "cli-table3";
import ora from "ora";
import { TodoService } from "../services/todoService.js";
import { Todo } from "../types/todo.js";
import {
  colors,
  formatTodoTitle,
  formatTodoDescription,
  formatTodoMeta,
  truncateText,
} from "../utils/formatting.js";

export async function listTodos(
  todoService: TodoService,
  options: {
    status?: "all" | "pending" | "completed";
    priority?: "all" | "high" | "medium" | "low";
    search?: string;
  } = {}
): Promise<void> {
  const spinner = ora("Loading todos...").start();

  try {
    let todos = await todoService.getAllTodos();

    // Apply filters
    if (options.status === "pending") {
      todos = todos.filter((todo) => !todo.completed);
    } else if (options.status === "completed") {
      todos = todos.filter((todo) => todo.completed);
    }

    if (options.priority && options.priority !== "all") {
      todos = todos.filter((todo) => todo.priority === options.priority);
    }

    if (options.search) {
      const query = options.search.toLowerCase();
      todos = todos.filter(
        (todo) =>
          todo.title.toLowerCase().includes(query) ||
          todo.description?.toLowerCase().includes(query) ||
          todo.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Sort todos: pending first, then by priority, then by creation date
    todos.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (a.priority !== b.priority) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }

      return new Date(b.created).getTime() - new Date(a.created).getTime();
    });

    spinner.stop();

    if (todos.length === 0) {
      console.log(
        colors.muted("\n📝 No todos found matching your criteria.\n")
      );
      return;
    }

    console.log(
      colors.primary(
        `\n📋 Found ${todos.length} todo${todos.length !== 1 ? "s" : ""}\n`
      )
    );

    // Display todos in a nice format
    todos.forEach((todo, index) => {
      console.log(formatTodoTitle(todo));

      if (todo.description) {
        console.log(formatTodoDescription(todo.description));
      }

      console.log(formatTodoMeta(todo));

      if (index < todos.length - 1) {
        console.log(""); // Empty line between todos
      }
    });

    console.log(""); // Final empty line
  } catch (error) {
    spinner.stop();
    console.error(
      colors.error(
        `\n❌ Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }\n`
      )
    );
  }
}

export async function listTodosTable(
  todoService: TodoService,
  options: {
    status?: "all" | "pending" | "completed";
    priority?: "all" | "high" | "medium" | "low";
  } = {}
): Promise<void> {
  const spinner = ora("Loading todos...").start();

  try {
    let todos = await todoService.getAllTodos();

    // Apply filters
    if (options.status === "pending") {
      todos = todos.filter((todo) => !todo.completed);
    } else if (options.status === "completed") {
      todos = todos.filter((todo) => todo.completed);
    }

    if (options.priority && options.priority !== "all") {
      todos = todos.filter((todo) => todo.priority === options.priority);
    }

    // Sort todos
    todos.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (a.priority !== b.priority) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }

      return new Date(b.created).getTime() - new Date(a.created).getTime();
    });

    spinner.stop();

    if (todos.length === 0) {
      console.log(colors.muted("\n📝 No todos found.\n"));
      return;
    }

    const table = new Table({
      head: [
        colors.primary("Status"),
        colors.primary("Title"),
        colors.primary("Priority"),
        colors.primary("Tags"),
        colors.primary("Due Date"),
      ],
      colWidths: [8, 40, 10, 20, 15],
      wordWrap: true,
      style: {
        head: [],
        border: ["grey"],
      },
    });

    todos.forEach((todo) => {
      const status = todo.completed ? colors.success("✓") : colors.muted("○");
      const title = todo.completed
        ? colors.completed(truncateText(todo.title, 35))
        : truncateText(todo.title, 35);
      const priority = (() => {
        switch (todo.priority) {
          case "high":
            return colors.high("HIGH");
          case "medium":
            return colors.medium("MED");
          case "low":
            return colors.low("LOW");
          default:
            return todo.priority;
        }
      })();
      const tags =
        todo.tags.length > 0
          ? colors.info(todo.tags.map((t) => `#${t}`).join(" "))
          : colors.muted("-");
      const dueDate = todo.dueDate
        ? colors.warning(new Date(todo.dueDate).toLocaleDateString())
        : colors.muted("-");

      table.push([status, title, priority, tags, dueDate]);
    });

    console.log(`\n${table.toString()}\n`);
    console.log(
      colors.muted(
        `Total: ${todos.length} todo${todos.length !== 1 ? "s" : ""}\n`
      )
    );
  } catch (error) {
    spinner.stop();
    console.error(
      colors.error(
        `\n❌ Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }\n`
      )
    );
  }
}
