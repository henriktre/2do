import { Todo, CreateTodoRequest, UpdateTodoRequest } from "./types.js";
import { randomUUID } from "crypto";
import PocketBase from "pocketbase";

export class TodoStore {
  private pb: PocketBase;

  constructor() {
    this.pb = new PocketBase("http://127.0.0.1:8090");
    // Don't auto-initialize to avoid timing issues with stdio
  }

  async addSampleTodos() {
    const sampleTodos: CreateTodoRequest[] = [
      {
        title: "Set up MCP server",
        description: "Configure and test the Model Context Protocol server",
        priority: "high",
        tags: ["development", "mcp"],
      },
      {
        title: "Write documentation",
        description: "Create user guide for the todo MCP server",
        priority: "medium",
        tags: ["documentation"],
      },
      {
        title: "Add tests",
        description: "Write unit tests for todo operations",
        priority: "low",
        tags: ["testing", "development"],
      },
    ];

    for (const todo of sampleTodos) {
      await this.createTodo(todo);
    }
  }

  async createTodo(request: CreateTodoRequest): Promise<Todo> {
    try {
      const todoData: any = {
        title: request.title,
        description: request.description || "",
        completed: Boolean(false), // Explicitly convert to boolean
        priority: request.priority || "medium",
        tags: request.tags || [],
      };

      // Only add dueDate if it's provided
      if (request.dueDate) {
        todoData.dueDate = request.dueDate;
      }

      console.log("Creating todo with data:", JSON.stringify(todoData));

      const record = await this.pb.collection("todos").create(todoData);
      return this.mapRecordToTodo(record);
    } catch (error: any) {
      console.error("Error creating todo:", error);
      console.error("Error details:", error.response || error.data);
      throw new Error(`Failed to create todo: ${error}`);
    }
  }

  async getTodo(id: string): Promise<Todo | undefined> {
    try {
      const record = await this.pb.collection("todos").getOne(id);
      return this.mapRecordToTodo(record);
    } catch (error: any) {
      if (error?.status === 404) {
        return undefined;
      }
      console.error("Error getting todo:", error);
      throw new Error(`Failed to get todo: ${error}`);
    }
  }

  async getAllTodos(): Promise<Todo[]> {
    try {
      const records = await this.pb.collection("todos").getFullList({
        sort: "-created",
      });
      return records.map((record) => this.mapRecordToTodo(record));
    } catch (error) {
      console.error("Error getting all todos:", error);
      throw new Error(`Failed to get todos: ${error}`);
    }
  }

  async updateTodo(
    id: string,
    request: UpdateTodoRequest
  ): Promise<Todo | undefined> {
    try {
      const updateData: any = {};

      if (request.title !== undefined) updateData.title = request.title;
      if (request.description !== undefined)
        updateData.description = request.description;
      if (request.completed !== undefined)
        updateData.completed = request.completed;
      if (request.dueDate !== undefined) updateData.dueDate = request.dueDate;
      if (request.priority !== undefined)
        updateData.priority = request.priority;
      if (request.tags !== undefined) updateData.tags = request.tags;

      const record = await this.pb.collection("todos").update(id, updateData);
      return this.mapRecordToTodo(record);
    } catch (error: any) {
      if (error?.status === 404) {
        return undefined;
      }
      console.error("Error updating todo:", error);
      throw new Error(`Failed to update todo: ${error}`);
    }
  }

  async deleteTodo(id: string): Promise<boolean> {
    try {
      await this.pb.collection("todos").delete(id);
      return true;
    } catch (error: any) {
      if (error?.status === 404) {
        return false;
      }
      console.error("Error deleting todo:", error);
      throw new Error(`Failed to delete todo: ${error}`);
    }
  }

  async searchTodos(query: string): Promise<Todo[]> {
    try {
      const filter = `title ~ "${query}" || description ~ "${query}"`;
      const records = await this.pb.collection("todos").getFullList({
        filter,
        sort: "-created",
      });

      // Also search in tags (client-side since PocketBase JSON search is limited)
      const allRecords = await this.pb.collection("todos").getFullList({
        sort: "-created",
      });

      const tagMatches = allRecords.filter((record) => {
        const tags = record.tags || [];
        return tags.some((tag: string) =>
          tag.toLowerCase().includes(query.toLowerCase())
        );
      });

      // Combine and deduplicate results
      const combinedRecords = [...records];
      tagMatches.forEach((tagMatch) => {
        if (!combinedRecords.find((r) => r.id === tagMatch.id)) {
          combinedRecords.push(tagMatch);
        }
      });

      return combinedRecords.map((record) => this.mapRecordToTodo(record));
    } catch (error) {
      console.error("Error searching todos:", error);
      throw new Error(`Failed to search todos: ${error}`);
    }
  }

  async getTodosByStatus(completed: boolean): Promise<Todo[]> {
    try {
      const filter = `completed = ${completed}`;
      const records = await this.pb.collection("todos").getFullList({
        filter,
        sort: "-created",
      });
      return records.map((record) => this.mapRecordToTodo(record));
    } catch (error) {
      console.error("Error getting todos by status:", error);
      throw new Error(`Failed to get todos by status: ${error}`);
    }
  }

  async getTodosByPriority(
    priority: "low" | "medium" | "high"
  ): Promise<Todo[]> {
    try {
      const filter = `priority = "${priority}"`;
      const records = await this.pb.collection("todos").getFullList({
        filter,
        sort: "-created",
      });
      return records.map((record) => this.mapRecordToTodo(record));
    } catch (error) {
      console.error("Error getting todos by priority:", error);
      throw new Error(`Failed to get todos by priority: ${error}`);
    }
  }

  async getTodosByTag(tag: string): Promise<Todo[]> {
    try {
      // Get all todos and filter by tag (client-side since PocketBase JSON search is limited)
      const records = await this.pb.collection("todos").getFullList({
        sort: "-created",
      });

      const filteredRecords = records.filter((record) => {
        const tags = record.tags || [];
        return tags.includes(tag);
      });

      return filteredRecords.map((record) => this.mapRecordToTodo(record));
    } catch (error) {
      console.error("Error getting todos by tag:", error);
      throw new Error(`Failed to get todos by tag: ${error}`);
    }
  }

  async getOverdueTodos(): Promise<Todo[]> {
    try {
      const now = new Date().toISOString();
      const filter = `dueDate < "${now}" && completed = false`;
      const records = await this.pb.collection("todos").getFullList({
        filter,
        sort: "-created",
      });
      return records.map((record) => this.mapRecordToTodo(record));
    } catch (error) {
      console.error("Error getting overdue todos:", error);
      throw new Error(`Failed to get overdue todos: ${error}`);
    }
  }

  async getStats() {
    try {
      const todos = await this.getAllTodos();
      const completed = todos.filter((t) => t.completed).length;
      const pending = todos.length - completed;
      const overdue = (await this.getOverdueTodos()).length;

      const byPriority = {
        high: todos.filter((t) => t.priority === "high" && !t.completed).length,
        medium: todos.filter((t) => t.priority === "medium" && !t.completed)
          .length,
        low: todos.filter((t) => t.priority === "low" && !t.completed).length,
      };

      return {
        total: todos.length,
        completed,
        pending,
        overdue,
        byPriority,
      };
    } catch (error) {
      console.error("Error getting stats:", error);
      throw new Error(`Failed to get stats: ${error}`);
    }
  }

  private mapRecordToTodo(record: any): Todo {
    return {
      id: record.id,
      title: record.title,
      description: record.description,
      completed: record.completed,
      createdAt: new Date(record.created),
      updatedAt: new Date(record.updated),
      dueDate: record.dueDate ? new Date(record.dueDate) : undefined,
      priority: record.priority,
      tags: record.tags || [],
    };
  }
}
