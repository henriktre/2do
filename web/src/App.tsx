import React from "react";
import { TodoList } from "./components/TodoList";
import "@entur/tokens/dist/styles.css";
import "@entur/typography/dist/styles.css";
import "@entur/layout/dist/styles.css";
import "@entur/button/dist/styles.css";
import "@entur/form/dist/styles.css";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "#ffffff",
          padding: "16px 0",
          borderBottom: "1px solid #e0e0e0",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#1976d2",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            ✓
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "24px",
                color: "#1976d2",
                fontWeight: "bold",
              }}
            >
              Todo App
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#666",
              }}
            >
              Powered by Entur Design System
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "32px 20px",
        }}
      >
        <TodoList />
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#ffffff",
          borderTop: "1px solid #e0e0e0",
          padding: "20px 0",
          marginTop: "40px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px",
            textAlign: "center",
            color: "#666",
            fontSize: "14px",
          }}
        >
          <p style={{ margin: "0 0 8px 0" }}>
            Built with React and Entur Design System
          </p>
          <p style={{ margin: 0 }}>
            Connected to PocketBase backend • Synchronized with MCP Server
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
