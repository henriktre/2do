# Multi-Interface Todo Application

A modern todo application built on PocketBase with three powerful ways to manage your tasks: a beautiful web interface, an interactive command-line tool, and AI assistant integration.

**One todo list. Three ways to access it.**

## 🌟 Features

- 🌐 **Web Interface** - Modern React UI with Entur Design System
- 💻 **CLI Tool** - Beautiful terminal interface with rich interactivity
- 🤖 **AI Integration** - Natural language todo management via Claude Desktop
- 💾 **Unified Data** - All interfaces share the same PocketBase database
- 🔄 **Real-time Sync** - Changes appear instantly across all interfaces
- 🎯 **Rich Metadata** - Priorities, due dates, tags, and descriptions
- 📊 **Analytics** - Visual statistics and progress tracking
- 🔍 **Smart Search** - Filter and search across all todo properties

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Web Browser   │    │   Terminal      │    │  Claude Desktop │
│                 │    │                 │    │                 │
└────────┬────────┘    └────────┬────────┘    └────────┬────────┘
         │                      │                      │
         ▼                      ▼                      ▼
    ┌─────────────────────────────────────────────────────────────┐
    │                   PocketBase Server                         │
    │                (Unified Data Layer)                         │
    └─────────────────────────────────────────────────────────────┘
```

All three interfaces connect to the same PocketBase database, ensuring your todos stay synchronized no matter how you access them.

## 🚀 Quick Start

### Prerequisites

- **Node.js**: Version 16 or higher
- **PocketBase**: Included in the `pocketbase/` directory

### Setup (3 steps)

1. **Install Dependencies**:

   ```bash
   npm install
   npm run build:all
   ```

2. **Start the app**:

   ```bash
   npm start
   ```

   > ✨ **Auto-Setup**: PocketBase automatically creates the database and todos collection on first run!

3. **Choose Your Interface**:
   - **Web UI**: → http://localhost:3000
   - **CLI**: → use `todo` command anywhere
   - **AI Assistant**: Configure Claude Desktop (see below)
   - **API/SDK** Navigate to the pocketbase admin GUI (http://127.0.0.1:8090/_/) and click the `API Preview` button to read the API/SDK documentation (SDK's available are JS and Dart)

### MCP Setup

1. **Configure Claude Desktop**:

   Open your configuration file:

   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%/Claude/claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

2. **Add MCP Server**:

   ```json
   {
     "mcpServers": {
       "todo": {
         "command": "node",
         "args": ["/absolute/path/to/your/mcp-todo/dist/index.js"],
         "cwd": "/absolute/path/to/your/mcp-todo",
         "env": {
           "MCP_AUTO_START_POCKETBASE": "true"
         }
       }
     }
   }
   ```

   **Replace the paths** with your actual project directory.

3. **Restart Claude Desktop** and test with: _"Show me my todos"_

## 🌐 Web Interface

A modern, responsive React application built with Entur's Design System.

### Features

- 🎨 **Professional Design** - Clean, accessible interface
- 📱 **Responsive** - Works on desktop, tablet, and mobile
- ⚡ **Real-time Updates** - See changes instantly
- 🔍 **Advanced Filtering** - Search by text, status, priority
- 📊 **Visual Analytics** - Progress tracking and insights
- 🏷️ **Tag Management** - Organize with custom tags

### Quick Start

```bash
# Start everything
npm run dev:all

# Or start separately:
npm run pocketbase  # Terminal 1
npm run web         # Terminal 2
```

Then open **http://localhost:3000** in your browser.

## 💻 Command Line Interface

A beautiful, interactive terminal application with rich colors and intuitive commands.

### Features

- 🎨 **Beautiful Terminal UI** - Colors, tables, progress bars
- ⚡ **Fast Commands** - Quick operations for power users
- 🔄 **Interactive Mode** - Menu-driven interface
- 📊 **Rich Statistics** - Visual progress tracking
- 🔍 **Smart Filtering** - Search by any property
- 📅 **Due Date Tracking** - Overdue highlighting

### Installation

```bash
# Build and install globally
npm run cli:build
cd cli && npm link
```

### Usage

```bash
# Interactive mode (recommended for beginners)
todo

# Quick commands
todo list                    # List all todos
todo add "Buy groceries"     # Quick add
todo complete "groceries"    # Mark as done
todo stats                   # Show statistics
todo --help                  # See all commands
```

### Advanced Usage

```bash
# Filtering and search
todo list --status pending         # Only pending todos
todo list --priority high          # Only high priority
todo list --table                  # Compact table view
todo list --search "development"   # Search by text

# Creating todos with full options
todo add "Complex task" \
  --description "Detailed description" \
  --priority high \
  --tags "work,urgent" \
  --due 2025-06-15

# Management commands
todo complete "task name"    # Mark as completed
todo delete "old task"       # Remove todo
todo clear                   # Clear completed todos
todo overdue                 # Show overdue items
```

## 🤖 AI Assistant Integration (Claude Desktop)

Manage your todos naturally using AI through the Model Context Protocol (MCP).

### Features

- 🗣️ **Natural Language** - "Create a high-priority task for the meeting"
- 🔍 **Smart Queries** - "Show me overdue tasks tagged with 'work'"
- 📊 **Analytics** - "What's my completion rate this week?"
- 🎯 **Context Aware** - AI understands priorities, due dates, tags

### Example Interactions

- _"Create a new todo to review the quarterly report with high priority"_
- _"Show me all high priority tasks that are overdue"_
- _"Mark my MCP setup todo as completed"_
- _"What are my todo statistics?"_
- _"Find all todos tagged with 'development'"_
- _"Delete completed todos from last week"_

## 📊 Todo Data Structure

```typescript
{
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  dueDate?: string;  // ISO 8601 format
  created: string;   // ISO 8601 format
  updated: string;   // ISO 8601 format
}
```

## 🔧 Development

### Scripts

```bash
# Building
npm run build           # Build MCP server
npm run build:all       # Build everything (MCP + Web + CLI)

# Development
npm run dev             # MCP server watch mode
npm run web             # Start web UI
npm run cli             # CLI development mode
npm run dev:all         # Start PocketBase + Web UI

# Database
npm run pocketbase      # Start PocketBase server
npm run setup           # Build + start PocketBase

# CLI
npm run cli:build       # Build CLI
npm run cli:link        # Build + link globally
```

### Project Structure

```
├── src/                 # MCP server source
├── web/                 # React web application
├── cli/                 # Command-line interface
├── pocketbase/          # Database server + config
├── pb_data/            # Database files (auto-generated)
└── pb_migrations/      # Database migrations
```

### Available Endpoints

**Web UI**: http://localhost:3000  
**PocketBase Admin**: http://localhost:8090/\_/  
**API Base**: http://localhost:8090/api/

## 🌍 Multiple Access Points

Your todos are accessible through:

1. **🌐 Web Interface** - Modern browser experience
2. **💻 Command Line** - Terminal power-user interface
3. **🤖 AI Assistant** - Natural language via Claude Desktop
4. **🔧 Admin Panel** - Direct database management
5. **📡 REST API** - Programmatic access for integrations

All interfaces share the same database - changes sync automatically!

## 🎯 Use Cases

### Personal Productivity

- Daily task management with beautiful interfaces
- Cross-device synchronization
- AI-powered task creation and management

### Development Workflow

- Feature tracking with tags and priorities
- CLI integration in development environment
- AI assistant for project planning

### Team Collaboration

- Shared todo lists via web interface
- Consistent data across team members
- API integration with other tools

## 🚀 What's Next?

This todo application demonstrates the power of multi-interface design:

- **One Backend** - PocketBase provides robust, scalable data storage
- **Multiple Frontends** - Each optimized for different use cases
- **Unified Experience** - Consistent data and functionality across all interfaces

Whether you prefer clicking in a browser, typing in a terminal, or talking to an AI, your todos are always accessible and synchronized.

---

Built with ❤️ using PocketBase, React, Node.js, and the Model Context Protocol.
