import inquirer from "inquirer";
import ora from "ora";
import { TodoService } from "../services/todoService.js";
import { colors, formatTodoTitle } from "../utils/formatting.js";

export async function deleteTodo(
  todoService: TodoService,
  options: {
    id?: string;
    search?: string;
    force?: boolean;
  } = {}
): Promise<void> {
  try {
    let todoId = options.id;
    let todoToDelete;

    if (!todoId) {
      const spinner = ora("Loading todos...").start();
      const todos = await todoService.getAllTodos();
      spinner.stop();

      if (todos.length === 0) {
        console.log(colors.muted("\n📝 No todos to delete.\n"));
        return;
      }

      if (options.search) {
        const filtered = todos.filter((todo) =>
          todo.title.toLowerCase().includes(options.search!.toLowerCase())
        );

        if (filtered.length === 0) {
          console.log(
            colors.muted(`\n📝 No todos found matching "${options.search}".\n`)
          );
          return;
        }

        if (filtered.length === 1) {
          todoId = filtered[0].id;
          todoToDelete = filtered[0];
        } else {
          const { selectedTodo } = await inquirer.prompt([
            {
              type: "list",
              name: "selectedTodo",
              message: "Multiple todos found. Which one to delete?",
              choices: filtered.map((todo) => ({
                name: `${formatTodoTitle(todo)} - ${
                  todo.description || "No description"
                }`,
                value: todo.id,
              })),
            },
          ]);
          todoId = selectedTodo;
          todoToDelete = filtered.find((t) => t.id === selectedTodo);
        }
      } else {
        const { selectedTodo } = await inquirer.prompt([
          {
            type: "list",
            name: "selectedTodo",
            message: "Select a todo to delete:",
            choices: todos.map((todo) => ({
              name: `${formatTodoTitle(todo)} - ${
                todo.description || "No description"
              }`,
              value: todo.id,
            })),
          },
        ]);
        todoId = selectedTodo;
        todoToDelete = todos.find((t) => t.id === selectedTodo);
      }
    } else {
      // Get todo details for confirmation
      const spinner = ora("Loading todo...").start();
      try {
        todoToDelete = await todoService.getTodo(todoId);
        spinner.stop();
      } catch (error) {
        spinner.stop();
        console.error(colors.error(`\n❌ Todo not found: ${todoId}\n`));
        return;
      }
    }

    // Confirmation unless forced
    if (!options.force) {
      console.log(colors.warning("\n⚠️  You are about to delete:"));
      console.log(formatTodoTitle(todoToDelete!));
      if (todoToDelete!.description) {
        console.log(colors.muted(`   ${todoToDelete!.description}`));
      }
      console.log("");

      const { confirmed } = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirmed",
          message: "Are you sure you want to delete this todo?",
          default: false,
        },
      ]);

      if (!confirmed) {
        console.log(colors.muted("\n❌ Deletion cancelled.\n"));
        return;
      }
    }

    const spinner = ora("Deleting todo...").start();

    await todoService.deleteTodo(todoId!);

    spinner.stop();

    console.log(colors.success("\n🗑️  Todo deleted successfully!\n"));
  } catch (error) {
    console.error(
      colors.error(
        `\n❌ Error deleting todo: ${
          error instanceof Error ? error.message : "Unknown error"
        }\n`
      )
    );
  }
}

export async function clearCompleted(
  todoService: TodoService,
  options: {
    force?: boolean;
  } = {}
): Promise<void> {
  try {
    const spinner = ora("Loading completed todos...").start();
    const completedTodos = await todoService.getTodosByStatus(true);
    spinner.stop();

    if (completedTodos.length === 0) {
      console.log(colors.muted("\n📝 No completed todos to clear.\n"));
      return;
    }

    console.log(
      colors.info(
        `\n🧹 Found ${completedTodos.length} completed todo${
          completedTodos.length !== 1 ? "s" : ""
        } to clear:\n`
      )
    );

    // Show what will be deleted
    completedTodos.forEach((todo) => {
      console.log(formatTodoTitle(todo));
    });

    if (!options.force) {
      console.log("");
      const { confirmed } = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirmed",
          message: `Delete all ${completedTodos.length} completed todo${
            completedTodos.length !== 1 ? "s" : ""
          }?`,
          default: false,
        },
      ]);

      if (!confirmed) {
        console.log(colors.muted("\n❌ Clear cancelled.\n"));
        return;
      }
    }

    const deleteSpinner = ora(
      `Deleting ${completedTodos.length} completed todos...`
    ).start();

    // Delete all completed todos
    await Promise.all(
      completedTodos.map((todo) => todoService.deleteTodo(todo.id))
    );

    deleteSpinner.stop();

    console.log(
      colors.success(
        `\n🗑️  Cleared ${completedTodos.length} completed todo${
          completedTodos.length !== 1 ? "s" : ""
        }!\n`
      )
    );
  } catch (error) {
    console.error(
      colors.error(
        `\n❌ Error clearing completed todos: ${
          error instanceof Error ? error.message : "Unknown error"
        }\n`
      )
    );
  }
}
