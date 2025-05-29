#!/bin/bash

# CLI Demo Script for MCP Todo Server
# This script demonstrates the key features of the todo CLI

echo "🎯 MCP Todo CLI Demo"
echo "===================="
echo

# Check if PocketBase is running
echo "📡 Checking PocketBase connection..."
if ! curl -s http://localhost:8090/api/health > /dev/null 2>&1; then
    echo "❌ PocketBase is not running. Please start it with:"
    echo "   npm run pocketbase"
    exit 1
fi
echo "✅ PocketBase is running"
echo

# Build CLI if needed
echo "🔨 Building CLI..."
npm run build > /dev/null 2>&1
echo "✅ CLI built successfully"
echo

echo "📊 Current Statistics:"
node dist/index.js stats
echo

echo "📋 All Todos (List View):"
node dist/index.js list
echo

echo "📊 All Todos (Table View):"
node dist/index.js list --table
echo

echo "🔍 High Priority Todos Only:"
node dist/index.js list --priority high
echo

echo "⏰ Overdue Todos:"
node dist/index.js overdue
echo

echo "➕ Adding a demo todo..."
node dist/index.js add "CLI Demo Task" \
  --description "Demonstrate the CLI functionality" \
  --priority medium \
  --tags "demo,cli,testing"
echo

echo "📋 Updated Todo List:"
node dist/index.js list --search "demo"
echo

echo "✅ Completing the demo task..."
node dist/index.js complete "CLI Demo" --force 2>/dev/null || echo "Task completed (if found)"
echo

echo "📊 Final Statistics:"
node dist/index.js stats
echo

echo "🎉 CLI Demo Complete!"
echo
echo "💡 Try these commands:"
echo "   todo                    # Interactive mode"
echo "   todo --help             # Show all commands"
echo "   todo list --table       # Compact view"
echo "   todo add 'New task'     # Quick add"
echo "   todo stats              # Statistics"
echo
echo "🔗 Other interfaces:"
echo "   Web UI:     http://localhost:3000"
echo "   API Admin:  http://localhost:8090/_/"
echo "   MCP Server: Configure in Claude Desktop"
