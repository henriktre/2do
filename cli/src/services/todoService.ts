import fetch from "node-fetch";
import {
  Todo,
  TodoStats,
  CreateTodoRequest,
  UpdateTodoRequest,
} from "../types/todo.js";

const API_BASE =
  process.env.TODO_API_URL || "http://localhost:8090/api/collections/todos";

export class TodoService {
  async getAllTodos(): Promise<Todo[]> {
    try {
      const response = await fetch(`${API_BASE}/records`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = (await response.json()) as any;
      return data.items || [];
    } catch (error) {
      throw new Error(
        `Failed to fetch todos: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getTodo(id: string): Promise<Todo> {
    try {
      const response = await fetch(`${API_BASE}/records/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return (await response.json()) as Todo;
    } catch (error) {
      throw new Error(
        `Failed to fetch todo: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async createTodo(todo: CreateTodoRequest): Promise<Todo> {
    try {
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
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return (await response.json()) as Todo;
    } catch (error) {
      throw new Error(
        `Failed to create todo: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async updateTodo(
    id: string,
    updates: Omit<UpdateTodoRequest, "id">
  ): Promise<Todo> {
    try {
      const response = await fetch(`${API_BASE}/records/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return (await response.json()) as Todo;
    } catch (error) {
      throw new Error(
        `Failed to update todo: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async deleteTodo(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/records/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      throw new Error(
        `Failed to delete todo: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
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

  async getOverdueTodos(): Promise<Todo[]> {
    const allTodos = await this.getAllTodos();
    const now = new Date().toISOString();
    return allTodos.filter(
      (todo) => !todo.completed && todo.dueDate && todo.dueDate < now
    );
  }
}
