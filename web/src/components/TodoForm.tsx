import React, { useState } from "react";
import { Button } from "@entur/button";
import { TextField, TextArea } from "@entur/form";
import { CreateTodoRequest } from "../types/todo";

interface TodoFormProps {
  onSubmit: (todo: CreateTodoRequest) => Promise<void>;
  onCancel?: () => void;
}

export function TodoForm({ onSubmit, onCancel }: TodoFormProps) {
  const [formData, setFormData] = useState<CreateTodoRequest>({
    title: "",
    description: "",
    priority: "medium",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        ...formData,
        tags: tagInput
          ? tagInput
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
      });
      setFormData({ title: "", description: "", priority: "medium", tags: [] });
      setTagInput("");
    } catch (error) {
      console.error("Failed to create todo:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "16px" }}
    >
      <TextField
        label="Title"
        value={formData.title}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, title: e.target.value }))
        }
        placeholder="What needs to be done?"
        required
      />

      <TextArea
        label="Description (optional)"
        value={formData.description || ""}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, description: e.target.value }))
        }
        placeholder="Add more details..."
        rows={3}
      />

      <div style={{ display: "flex", gap: "16px" }}>
        <div style={{ flex: 1 }}>
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
            value={formData.priority}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                priority: e.target.value as "low" | "medium" | "high",
              }))
            }
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <TextField
            label="Due Date (optional)"
            type="date"
            value={formData.dueDate || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
            }
          />
        </div>
      </div>

      <TextField
        label="Tags (optional)"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        placeholder="design, urgent, review (comma separated)"
      />

      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} type="button">
            Cancel
          </Button>
        )}
        <Button
          variant="primary"
          type="submit"
          disabled={!formData.title.trim() || isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Todo"}
        </Button>
      </div>
    </form>
  );
}
