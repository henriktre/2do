import inquirer from "inquirer";
import ora from "ora";
import { TodoService } from "../services/todoService.js";
import { CreateTodoRequest } from "../types/todo.js";
import { colors } from "../utils/formatting.js";

export async function createTodo(
  todoService: TodoService,
  options: {
    title?: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    tags?: string[];
    dueDate?: string;
    interactive?: boolean;
  } = {}
): Promise<void> {
  try {
    let todoData: CreateTodoRequest;

    if (options.interactive || !options.title) {
      // Interactive mode
      console.log(colors.primary("\n📝 Create a new todo\n"));

      const answers = await inquirer.prompt([
        {
          type: "input",
          name: "title",
          message: "Todo title:",
          default: options.title,
          validate: (input: string) => {
            if (!input.trim()) {
              return "Please enter a title for the todo";
            }
            return true;
          },
        },
        {
          type: "input",
          name: "description",
          message: "Description (optional):",
          default: options.description || "",
        },
        {
          type: "list",
          name: "priority",
          message: "Priority:",
          choices: [
            { name: "🔴 High", value: "high" },
            { name: "🟡 Medium", value: "medium" },
            { name: "🟢 Low", value: "low" },
          ],
          default: options.priority || "medium",
        },
        {
          type: "input",
          name: "tags",
          message: "Tags (comma-separated, optional):",
          default: options.tags?.join(", ") || "",
          filter: (input: string) => {
            return input
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean);
          },
        },
        {
          type: "input",
          name: "dueDate",
          message: "Due date (YYYY-MM-DD, optional):",
          default: options.dueDate || "",
          validate: (input: string) => {
            if (!input) return true; // Optional field

            const date = new Date(input);
            if (isNaN(date.getTime())) {
              return "Please enter a valid date in YYYY-MM-DD format";
            }

            if (date < new Date()) {
              return "Due date should be in the future";
            }

            return true;
          },
          filter: (input: string) => {
            if (!input) return undefined;
            return new Date(input).toISOString();
          },
        },
      ]);

      todoData = answers;
    } else {
      // Non-interactive mode
      todoData = {
        title: options.title,
        description: options.description,
        priority: options.priority || "medium",
        tags: options.tags || [],
        dueDate: options.dueDate
          ? new Date(options.dueDate).toISOString()
          : undefined,
      };
    }

    const spinner = ora("Creating todo...").start();

    const newTodo = await todoService.createTodo(todoData);

    spinner.stop();

    console.log(colors.success("\n✅ Todo created successfully!\n"));
    console.log(colors.primary(`📋 ${newTodo.title}`));

    if (newTodo.description) {
      console.log(colors.muted(`   ${newTodo.description}`));
    }

    const meta: string[] = [];
    meta.push(colors.warning(`Priority: ${newTodo.priority.toUpperCase()}`));

    if (newTodo.tags.length > 0) {
      meta.push(
        colors.info(`Tags: ${newTodo.tags.map((t) => `#${t}`).join(" ")}`)
      );
    }

    if (newTodo.dueDate) {
      meta.push(
        colors.warning(`Due: ${new Date(newTodo.dueDate).toLocaleDateString()}`)
      );
    }

    if (meta.length > 0) {
      console.log(colors.muted(`   ${meta.join(" • ")}`));
    }

    console.log("");
  } catch (error) {
    console.error(
      colors.error(
        `\n❌ Error creating todo: ${
          error instanceof Error ? error.message : "Unknown error"
        }\n`
      )
    );
  }
}

export async function quickAdd(
  todoService: TodoService,
  title: string
): Promise<void> {
  if (!title.trim()) {
    console.error(colors.error("\n❌ Please provide a todo title\n"));
    return;
  }

  const spinner = ora("Creating todo...").start();

  try {
    const newTodo = await todoService.createTodo({
      title: title.trim(),
      priority: "medium",
    });

    spinner.stop();

    console.log(colors.success(`\n✅ Added: "${newTodo.title}"\n`));
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
