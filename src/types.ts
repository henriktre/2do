export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  priority: "low" | "medium" | "high";
  tags: string[];
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  tags?: string[];
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  tags?: string[];
}
