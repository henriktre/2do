import { TodoStore } from "./todo-store.js";

export class TodoToolHandlers {
  constructor(private todoStore: TodoStore) {}

  async handleCreateTodo(args: any) {
    if (!args?.title) {
      throw new Error("Title is required");
    }
    const todo = await this.todoStore.createTodo(args);
    return {
      content: [
        {
          type: "text",
          text: `Created todo: ${JSON.stringify(todo, null, 2)}`,
        },
      ],
    };
  }

  async handleGetTodo(args: any) {
    const { id } = args;
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

  async handleListTodos() {
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

  async handleUpdateTodo(args: any) {
    if (!args?.id) {
      throw new Error("ID is required");
    }
    const { id, ...updateData } = args;
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

  async handleDeleteTodo(args: any) {
    const { id } = args;
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

  async handleSearchTodos(args: any) {
    const { query } = args;
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

  async handleGetTodosByStatus(args: any) {
    const { completed } = args;
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

  async handleGetTodosByPriority(args: any) {
    const { priority } = args;
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

  async handleGetTodosByTag(args: any) {
    const { tag } = args;
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

  async handleGetOverdueTodos() {
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

  async handleGetTodoStats() {
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

  async handleAddSampleTodos() {
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

  async handleToolCall(name: string, args: any) {
    switch (name) {
      case "create_todo":
        return this.handleCreateTodo(args);
      case "get_todo":
        return this.handleGetTodo(args);
      case "list_todos":
        return this.handleListTodos();
      case "update_todo":
        return this.handleUpdateTodo(args);
      case "delete_todo":
        return this.handleDeleteTodo(args);
      case "search_todos":
        return this.handleSearchTodos(args);
      case "get_todos_by_status":
        return this.handleGetTodosByStatus(args);
      case "get_todos_by_priority":
        return this.handleGetTodosByPriority(args);
      case "get_todos_by_tag":
        return this.handleGetTodosByTag(args);
      case "get_overdue_todos":
        return this.handleGetOverdueTodos();
      case "get_todo_stats":
        return this.handleGetTodoStats();
      case "add_sample_todos":
        return this.handleAddSampleTodos();
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
