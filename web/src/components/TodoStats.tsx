import React from "react";
import { useTodoStats } from "../hooks/useTodos";

export function TodoStats() {
  const { stats, loading, error } = useTodoStats();

  if (loading) return <div>Loading stats...</div>;
  if (error) return <div style={{ color: "#d32f2f" }}>Error: {error}</div>;
  if (!stats) return null;

  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        marginBottom: "24px",
      }}
    >
      <div
        style={{
          padding: "16px",
          backgroundColor: "#e3f2fd",
          borderRadius: "8px",
          border: "1px solid #bbdefb",
        }}
      >
        <h3 style={{ margin: "0 0 8px 0", color: "#1976d2" }}>Total Todos</h3>
        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#1976d2" }}>
          {stats.total}
        </div>
      </div>

      <div
        style={{
          padding: "16px",
          backgroundColor: "#e8f5e8",
          borderRadius: "8px",
          border: "1px solid #c8e6c9",
        }}
      >
        <h3 style={{ margin: "0 0 8px 0", color: "#388e3c" }}>Completed</h3>
        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#388e3c" }}>
          {stats.completed}
        </div>
        <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
          {completionRate}% completion rate
        </div>
      </div>

      <div
        style={{
          padding: "16px",
          backgroundColor: "#fff3e0",
          borderRadius: "8px",
          border: "1px solid #ffcc02",
        }}
      >
        <h3 style={{ margin: "0 0 8px 0", color: "#f57c00" }}>Pending</h3>
        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#f57c00" }}>
          {stats.pending}
        </div>
      </div>

      {stats.overdue > 0 && (
        <div
          style={{
            padding: "16px",
            backgroundColor: "#ffebee",
            borderRadius: "8px",
            border: "1px solid #ffcdd2",
          }}
        >
          <h3 style={{ margin: "0 0 8px 0", color: "#d32f2f" }}>Overdue</h3>
          <div
            style={{ fontSize: "24px", fontWeight: "bold", color: "#d32f2f" }}
          >
            {stats.overdue}
          </div>
        </div>
      )}

      <div
        style={{
          padding: "16px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          border: "1px solid #e0e0e0",
        }}
      >
        <h3 style={{ margin: "0 0 8px 0", color: "#666" }}>By Priority</h3>
        <div style={{ fontSize: "14px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "4px",
            }}
          >
            <span style={{ color: "#d32f2f" }}>High:</span>
            <span style={{ fontWeight: "bold" }}>{stats.byPriority.high}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "4px",
            }}
          >
            <span style={{ color: "#f57c00" }}>Medium:</span>
            <span style={{ fontWeight: "bold" }}>
              {stats.byPriority.medium}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#388e3c" }}>Low:</span>
            <span style={{ fontWeight: "bold" }}>{stats.byPriority.low}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
