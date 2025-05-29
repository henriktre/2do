import {
  Todo,
  TodoStats,
  CreateTodoRequest,
  UpdateTodoRequest,
} from "../types/todo";

const API_BASE = "/api/collections/todos";

class TodoService {
  async getAllTodos(): Promise<Todo[]> {
    const response = await fetch(`${API_BASE}/records`);
    if (!response.ok) {
      throw new Error("Failed to fetch todos");
    }
    const data = await response.json();
    return data.items || [];
  }

  async getTodo(id: string): Promise<Todo> {
    const response = await fetch(`${API_BASE}/records/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch todo");
    }
    return response.json();
  }

  async createTodo(todo: CreateTodoRequest): Promise<Todo> {
    const response = await fetch(`${API_BASE}/records`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...todo,
        completed: false,
        tags: todo.tags || [],
        priority: todo.priority || "medium",
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to create todo");
    }
    return response.json();
  }

  async updateTodo(
    id: string,
    updates: Omit<UpdateTodoRequest, "id">
  ): Promise<Todo> {
    const response = await fetch(`${API_BASE}/records/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error("Failed to update todo");
    }
    return response.json();
  }

  async deleteTodo(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/records/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete todo");
    }
  }

  async searchTodos(query: string): Promise<Todo[]> {
    const allTodos = await this.getAllTodos();
    const lowercaseQuery = query.toLowerCase();
    return allTodos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(lowercaseQuery) ||
        (todo.description &&
          todo.description.toLowerCase().includes(lowercaseQuery)) ||
        todo.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  async getTodosByStatus(completed: boolean): Promise<Todo[]> {
    const allTodos = await this.getAllTodos();
    return allTodos.filter((todo) => todo.completed === completed);
  }

  async getTodosByPriority(
    priority: "low" | "medium" | "high"
  ): Promise<Todo[]> {
    const allTodos = await this.getAllTodos();
    return allTodos.filter((todo) => todo.priority === priority);
  }

  async getOverdueTodos(): Promise<Todo[]> {
    const allTodos = await this.getAllTodos();
    const now = new Date().toISOString();
    return allTodos.filter(
      (todo) => !todo.completed && todo.dueDate && todo.dueDate < now
    );
  }

  async getStats(): Promise<TodoStats> {
    const allTodos = await this.getAllTodos();
    const completed = allTodos.filter((todo) => todo.completed).length;
    const pending = allTodos.length - completed;
    const now = new Date().toISOString();
    const overdue = allTodos.filter(
      (todo) => !todo.completed && todo.dueDate && todo.dueDate < now
    ).length;

    const byPriority = {
      high: allTodos.filter((todo) => todo.priority === "high").length,
      medium: allTodos.filter((todo) => todo.priority === "medium").length,
      low: allTodos.filter((todo) => todo.priority === "low").length,
    };

    return {
      total: allTodos.length,
      completed,
      pending,
      overdue,
      byPriority,
    };
  }

  async addSampleTodos(): Promise<void> {
    const sampleTodos: CreateTodoRequest[] = [
      {
        title: "Design new user interface",
        description: "Create mockups for the new dashboard",
        priority: "high",
        tags: ["design", "ui"],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        title: "Review pull requests",
        description: "Review and merge pending code changes",
        priority: "medium",
        tags: ["development", "review"],
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        title: "Update documentation",
        description: "Update API documentation with new endpoints",
        priority: "low",
        tags: ["documentation"],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    for (const todo of sampleTodos) {
      await this.createTodo(todo);
    }
  }
}

export const todoService = new TodoService();
