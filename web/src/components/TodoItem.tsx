import React from "react";
import { Button } from "@entur/button";
import { Todo } from "../types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onEdit?: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({
  todo,
  onToggleComplete,
  onEdit,
  onDelete,
}: TodoItemProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue =
    todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#d32f2f";
      case "medium":
        return "#f57c00";
      case "low":
        return "#388e3c";
      default:
        return "#666";
    }
  };

  return (
    <div
      style={{
        padding: "16px",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        backgroundColor: todo.completed ? "#f5f5f5" : "#fff",
        borderLeft: `4px solid ${getPriorityColor(todo.priority)}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggleComplete(todo.id)}
          style={{
            marginTop: "4px",
            width: "18px",
            height: "18px",
            cursor: "pointer",
          }}
        />

        <div style={{ flex: 1 }}>
          <h3
            style={{
              margin: "0 0 8px 0",
              fontSize: "18px",
              textDecoration: todo.completed ? "line-through" : "none",
              color: todo.completed ? "#666" : "#000",
            }}
          >
            {todo.title}
          </h3>

          {todo.description && (
            <p
              style={{
                margin: "0 0 8px 0",
                color: "#666",
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.description}
            </p>
          )}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "bold",
                color: "white",
                backgroundColor: getPriorityColor(todo.priority),
              }}
            >
              {todo.priority.toUpperCase()}
            </span>

            {todo.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  backgroundColor: "#e3f2fd",
                  color: "#1976d2",
                  border: "1px solid #bbdefb",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: "16px",
              fontSize: "12px",
              color: "#666",
            }}
          >
            {todo.dueDate && (
              <span style={{ color: isOverdue ? "#d32f2f" : "#666" }}>
                Due: {formatDate(todo.dueDate)}
                {isOverdue && " (Overdue)"}
              </span>
            )}
            <span>Created: {formatDate(todo.created)}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          {onEdit && (
            <Button
              variant="secondary"
              size="small"
              onClick={() => onEdit(todo)}
            >
              Edit
            </Button>
          )}
          <Button
            variant="secondary"
            size="small"
            onClick={() => onDelete(todo.id)}
            style={{ color: "#d32f2f" }}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
