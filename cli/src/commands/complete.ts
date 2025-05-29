import inquirer from "inquirer";
import ora from "ora";
import { TodoService } from "../services/todoService.js";
import { colors, formatTodoTitle } from "../utils/formatting.js";

export async function completeTodo(
  todoService: TodoService,
  options: {
    id?: string;
    search?: string;
    interactive?: boolean;
  } = {}
): Promise<void> {
  try {
    let todoId = options.id;

    if (!todoId) {
      const spinner = ora("Loading todos...").start();
      const todos = await todoService.getTodosByStatus(false); // Only pending todos
      spinner.stop();

      if (todos.length === 0) {
        console.log(colors.muted("\n📝 No pending todos to complete.\n"));
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
        } else {
          // Multiple matches, let user choose
          const { selectedTodo } = await inquirer.prompt([
            {
              type: "list",
              name: "selectedTodo",
              message: "Multiple todos found. Which one to complete?",
              choices: filtered.map((todo) => ({
                name: `${formatTodoTitle(todo)} - ${
                  todo.description || "No description"
                }`,
                value: todo.id,
              })),
            },
          ]);
          todoId = selectedTodo;
        }
      } else {
        // Interactive selection
        const { selectedTodo } = await inquirer.prompt([
          {
            type: "list",
            name: "selectedTodo",
            message: "Select a todo to complete:",
            choices: todos.map((todo) => ({
              name: `${formatTodoTitle(todo)} - ${
                todo.description || "No description"
              }`,
              value: todo.id,
            })),
          },
        ]);
        todoId = selectedTodo;
      }
    }

    const spinner = ora("Completing todo...").start();

    const updatedTodo = await todoService.updateTodo(todoId!, {
      completed: true,
    });

    spinner.stop();

    console.log(colors.success("\n✅ Todo completed!\n"));
    console.log(colors.completed(`✓ ${updatedTodo.title}`));
    console.log("");
  } catch (error) {
    console.error(
      colors.error(
        `\n❌ Error completing todo: ${
          error instanceof Error ? error.message : "Unknown error"
        }\n`
      )
    );
  }
}

export async function uncompleteTodo(
  todoService: TodoService,
  options: {
    id?: string;
    search?: string;
  } = {}
): Promise<void> {
  try {
    let todoId = options.id;

    if (!todoId) {
      const spinner = ora("Loading todos...").start();
      const todos = await todoService.getTodosByStatus(true); // Only completed todos
      spinner.stop();

      if (todos.length === 0) {
        console.log(colors.muted("\n📝 No completed todos to reopen.\n"));
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
        } else {
          const { selectedTodo } = await inquirer.prompt([
            {
              type: "list",
              name: "selectedTodo",
              message: "Multiple todos found. Which one to reopen?",
              choices: filtered.map((todo) => ({
                name: `${formatTodoTitle(todo)} - ${
                  todo.description || "No description"
                }`,
                value: todo.id,
              })),
            },
          ]);
          todoId = selectedTodo;
        }
      } else {
        const { selectedTodo } = await inquirer.prompt([
          {
            type: "list",
            name: "selectedTodo",
            message: "Select a todo to reopen:",
            choices: todos.map((todo) => ({
              name: `${formatTodoTitle(todo)} - ${
                todo.description || "No description"
              }`,
              value: todo.id,
            })),
          },
        ]);
        todoId = selectedTodo;
      }
    }

    const spinner = ora("Reopening todo...").start();

    const updatedTodo = await todoService.updateTodo(todoId!, {
      completed: false,
    });

    spinner.stop();

    console.log(colors.success("\n🔄 Todo reopened!\n"));
    console.log(colors.primary(`○ ${updatedTodo.title}`));
    console.log("");
  } catch (error) {
    console.error(
      colors.error(
        `\n❌ Error reopening todo: ${
          error instanceof Error ? error.message : "Unknown error"
        }\n`
      )
    );
  }
}
