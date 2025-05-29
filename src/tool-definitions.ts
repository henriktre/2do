import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const TODO_TOOLS: Tool[] = [
  {
    name: "create_todo",
    description: "Create a new todo item",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Todo title" },
        description: {
          type: "string",
          description: "Todo description",
        },
        dueDate: {
          type: "string",
          description: "Due date (ISO string)",
        },
        priority: {
          type: "string",
          enum: ["low", "medium", "high"],
          description: "Todo priority",
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Todo tags",
        },
      },
      required: ["title"],
    },
  },
  {
    name: "get_todo",
    description: "Get a specific todo by ID",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Todo ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "list_todos",
    description: "List all todos",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "update_todo",
    description: "Update an existing todo",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Todo ID" },
        title: { type: "string", description: "Todo title" },
        description: {
          type: "string",
          description: "Todo description",
        },
        completed: {
          type: "boolean",
          description: "Completion status",
        },
        dueDate: {
          type: "string",
          description: "Due date (ISO string)",
        },
        priority: {
          type: "string",
          enum: ["low", "medium", "high"],
          description: "Todo priority",
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Todo tags",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "delete_todo",
    description: "Delete a todo",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Todo ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "search_todos",
    description: "Search todos by title, description, or tags",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query" },
      },
      required: ["query"],
    },
  },
  {
    name: "get_todos_by_status",
    description: "Get todos by completion status",
    inputSchema: {
      type: "object",
      properties: {
        completed: {
          type: "boolean",
          description: "Completion status",
        },
      },
      required: ["completed"],
    },
  },
  {
    name: "get_todos_by_priority",
    description: "Get todos by priority level",
    inputSchema: {
      type: "object",
      properties: {
        priority: {
          type: "string",
          enum: ["low", "medium", "high"],
          description: "Priority level",
        },
      },
      required: ["priority"],
    },
  },
  {
    name: "get_todos_by_tag",
    description: "Get todos by tag",
    inputSchema: {
      type: "object",
      properties: {
        tag: { type: "string", description: "Tag name" },
      },
      required: ["tag"],
    },
  },
  {
    name: "get_overdue_todos",
    description: "Get all overdue todos",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_todo_stats",
    description: "Get todo statistics",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "add_sample_todos",
    description: "Add sample todos to get started",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];
