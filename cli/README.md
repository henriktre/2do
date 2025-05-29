# Todo CLI

A beautiful, interactive command-line interface for the MCP Todo Server. Manage your todos with style and efficiency directly from your terminal!

## 🌟 Features

- 🎨 **Beautiful Terminal UI** - Rich colors, tables, and interactive prompts
- ⚡ **Fast & Efficient** - Quick commands for power users
- 🔄 **Interactive Mode** - Full menu-driven interface for easy navigation
- 📊 **Rich Statistics** - Visual progress tracking and insights
- 🔍 **Advanced Filtering** - Search and filter by status, priority, tags
- 📅 **Due Date Management** - Track deadlines with overdue highlighting
- 🏷️ **Tag Support** - Organize todos with custom tags
- 📱 **Multiple Display Modes** - List view and compact table view

## 🚀 Quick Start

### Installation

```bash
# Build the CLI
cd cli
npm install
npm run build

# Link globally (optional)
npm link
```

### Basic Usage

```bash
# Show help
todo --help

# Start interactive mode (recommended for beginners)
todo
# or
todo interactive

# Quick commands
todo list                          # List all todos
todo add "Buy groceries"           # Quick add
todo complete "groceries"          # Mark as done
todo stats                         # Show statistics
```

## 📋 Commands

### List Todos

```bash
# List all todos (default detailed view)
todo list
todo ls

# List with filters
todo list --status pending         # Only pending todos
todo list --status completed       # Only completed todos
todo list --priority high          # Only high priority
todo list --search "development"   # Search by text

# Table view (compact)
todo list --table
todo list --table --status pending
```

### Add Todos

```bash
# Interactive creation
todo add
todo create

# Quick add
todo add "Finish the report"

# Add with all options
todo add "Review code" \
  --description "Review pull request #123" \
  --priority high \
  --tags "development,review" \
  --due 2025-06-15
```

### Complete/Uncomplete Todos

```bash
# Interactive completion
todo complete
todo done

# Complete by search
todo complete "report"
todo complete --id todo_id_here

# Reopen completed todos
todo uncomplete "report"
todo reopen --id todo_id_here
```

### Delete Todos

```bash
# Interactive deletion
todo delete
todo remove
todo rm

# Delete by search
todo delete "old task"
todo delete --id todo_id_here

# Force delete (skip confirmation)
todo delete "task" --force

# Clear all completed todos
todo clear
todo clear --force
```

### Statistics & Analysis

```bash
# Show detailed statistics
todo stats

# Show overdue todos
todo overdue
```

## 🎯 Interactive Mode

The interactive mode provides a user-friendly menu system:

```bash
todo
# or
todo interactive
```

**Features:**

- 📋 List todos with filtering options
- 📊 Table view with customizable filters
- ➕ Add new todos with guided prompts
- ✅ Complete todos with selection menu
- 🔄 Reopen completed todos
- 🗑️ Delete todos with confirmation
- 📈 View statistics and insights
- ⏰ Check overdue todos
- 🧹 Clear completed todos

## 🎨 Visual Features

### Color-Coded Display

- 🔴 **High Priority** - Red text and indicators
- 🟡 **Medium Priority** - Yellow text and indicators
- 🟢 **Low Priority** - Green text and indicators
- ✅ **Completed** - Gray strikethrough text
- ⚠️ **Overdue** - Bold red warnings
- 🏷️ **Tags** - Cyan colored hashtags

### Status Indicators

- ○ Pending todo
- ✓ Completed todo
- ⚠️ Overdue warning
- 📅 Due date information
- 🎯 Priority levels

### Rich Statistics

- 📊 Completion percentage with progress bar
- 📈 Priority breakdown tables
- 💡 Intelligent insights and recommendations
- ⏰ Overdue tracking with day counts

## 🔧 Configuration

### Environment Variables

```bash
# Custom API endpoint (default: http://localhost:8090/api/collections/todos)
export TODO_API_URL="http://your-server:8090/api/collections/todos"
```

### API Connection

The CLI connects to your PocketBase server. Make sure it's running:

```bash
# From the main project directory
npm run pocketbase
# or
npm run dev:all  # Starts both PocketBase and web UI
```

## 💡 Usage Examples

### Daily Workflow

```bash
# Start your day - check what needs attention
todo overdue
todo stats

# Add a quick task
todo add "Morning standup meeting" --priority high --due 2025-05-30

# Work through your todos
todo list --status pending --priority high
todo complete "standup"

# End of day - clean up
todo clear  # Remove completed todos
```

### Project Management

```bash
# Add project todos with tags
todo add "Design user interface" --tags "design,frontend,ui" --priority high
todo add "Implement API endpoints" --tags "backend,api,development" --priority medium
todo add "Write tests" --tags "testing,quality" --priority low

# Track project progress
todo list --search "frontend"
todo list --table --priority high
todo stats
```

### Team Collaboration

```bash
# Filter by team/project tags
todo list --search "frontend"
todo list --search "backend"
todo list --search "testing"

# Check deadlines
todo overdue
todo list --search "deadline"
```

## 🎹 Keyboard Shortcuts

In interactive mode:

- **↑↓** Navigate menu options
- **Enter** Select option
- **Ctrl+C** Exit gracefully
- **Space** Toggle selections (in multi-select)

## 🔄 Integration

The CLI integrates seamlessly with:

- **MCP Server** - Same data, accessible via Claude Desktop
- **Web UI** - Beautiful browser interface at `http://localhost:3000`
- **PocketBase Admin** - Direct database access at `http://localhost:8090/_/`
- **REST API** - Programmatic access for custom integrations

All interfaces share the same database, so changes sync instantly!

## 🛠️ Development

### Adding Custom Commands

```typescript
// src/commands/custom.ts
export async function customCommand(todoService: TodoService): Promise<void> {
  // Your custom logic here
}

// src/index.ts
program
  .command("custom")
  .description("Your custom command")
  .action(async () => {
    await customCommand(todoService);
  });
```

### Extending Formatting

```typescript
// src/utils/formatting.ts
export function customFormatter(data: any): string {
  // Your custom formatting logic
}
```

## 📦 Scripts

```bash
# Development
npm run dev          # Watch mode for development
npm run build        # Build TypeScript to JavaScript
npm start            # Run built CLI

# Installation
npm link             # Link globally for system-wide access
npm unlink           # Remove global link
```

## 🚀 Performance Tips

- Use `--table` for faster display of many todos
- Use specific search terms to filter large lists
- Use `--force` flag to skip confirmations in scripts
- Set `TODO_API_URL` environment variable to avoid network discovery

## 🎯 Use Cases

### Personal Productivity

- Daily task management
- Project tracking
- Deadline monitoring
- Goal setting and tracking

### Development Workflow

- Feature tracking
- Bug management
- Code review tasks
- Release planning

### Team Coordination

- Sprint planning
- Task assignment
- Progress tracking
- Status reporting

## 🔮 Roadmap

- 📱 **Offline Mode** - Local caching for network resilience
- 🔄 **Sync Status** - Visual indicators for data synchronization
- 📊 **Custom Reports** - Exportable statistics and reports
- 🎨 **Themes** - Customizable color schemes
- ⌨️ **Shortcuts** - Custom keybindings for power users
- 🔗 **Integrations** - Calendar, email, and external service connections

---

Built with ❤️ using Node.js, TypeScript, and modern CLI libraries. Part of the comprehensive MCP Todo ecosystem!
