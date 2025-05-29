import React, { useState } from "react";
import { Button } from "@entur/button";
import { TextField } from "@entur/form";
import { useTodos } from "../hooks/useTodos";
import { TodoItem } from "./TodoItem";
import { TodoForm } from "./TodoForm";
import { TodoStats } from "./TodoStats";
import { Todo } from "../types/todo";

export function TodoList() {
  const {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
  } = useTodos();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "completed"
  >("all");
  const [filterPriority, setFilterPriority] = useState<
    "all" | "high" | "medium" | "low"
  >("all");

  const handleCreateTodo = async (todoData: any) => {
    await createTodo(todoData);
    setShowForm(false);
  };

  const handleDeleteTodo = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      await deleteTodo(id);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !todo.title.toLowerCase().includes(query) &&
        !todo.description?.toLowerCase().includes(query) &&
        !todo.tags.some((tag) => tag.toLowerCase().includes(query))
      ) {
        return false;
      }
    }

    // Status filter
    if (filterStatus === "pending" && todo.completed) return false;
    if (filterStatus === "completed" && !todo.completed) return false;

    // Priority filter
    if (filterPriority !== "all" && todo.priority !== filterPriority)
      return false;

    return true;
  });

  const sortedTodos = filteredTodos.sort((a, b) => {
    // Sort by completion status first (pending first)
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // Then by priority (high -> medium -> low)
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (a.priority !== b.priority) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }

    // Finally by creation date (newest first)
    return new Date(b.created).getTime() - new Date(a.created).getTime();
  });

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
          fontSize: "18px",
        }}
      >
        Loading todos...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          color: "#d32f2f",
          textAlign: "center",
          padding: "20px",
          backgroundColor: "#ffebee",
          borderRadius: "8px",
          border: "1px solid #ffcdd2",
        }}
      >
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <TodoStats />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ margin: 0 }}>Todo List ({filteredTodos.length})</h2>
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Todo"}
        </Button>
      </div>

      {showForm && (
        <div
          style={{
            marginBottom: "24px",
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Create New Todo</h3>
          <TodoForm
            onSubmit={handleCreateTodo}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <TextField
          label="Search todos"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, description, or tags..."
          style={{ flex: 1, minWidth: "300px" }}
        />

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as "all" | "pending" | "completed")
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              minWidth: "120px",
            }}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Priority
          </label>
          <select
            value={filterPriority}
            onChange={(e) =>
              setFilterPriority(
                e.target.value as "all" | "high" | "medium" | "low"
              )
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              minWidth: "120px",
            }}
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {sortedTodos.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#666",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
          }}
        >
          {todos.length === 0 ? (
            <div>
              <p style={{ marginBottom: "16px", fontSize: "18px" }}>
                No todos yet!
              </p>
              <p>Click "Add Todo" to create your first task.</p>
            </div>
          ) : (
            <p>No todos match your current filters.</p>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {sortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={toggleComplete}
              onDelete={handleDeleteTodo}
            />
          ))}
        </div>
      )}
    </div>
  );
}
