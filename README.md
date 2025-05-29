# MCP Todo Server

A Model Context Protocol (MCP) server that provides persistent todo list management capabilities to AI assistants using PocketBase as the backend.

## Prerequisites

- **Node.js**: Version 16 or higher
- **PocketBase**: Download from [PocketBase Releases](https://github.com/pocketbase/pocketbase/releases) and place the executable in the `pocketbase/` directory, or use the included executable

## Quick Start

1. **Install Dependencies**:

   ```bash
   npm install
   npm run build
   ```

2. **Get PocketBase**:

   ```bash
   # Download from https://github.com/pocketbase/pocketbase/releases
   # Place the executable in the pocketbase/ directory
   ```

3. **Ready to Use!**:

   > ✨ **Auto-Setup**: PocketBase automatically creates the database and todos collection on first run. No manual setup required!

   > 🧪 **Quick Test**: Run `npm run start:auto` to verify everything works.

### Usage Options

```bash
# Auto-start mode (recommended for Claude Desktop)
npm run start:auto

# Manual mode (start PocketBase separately first)
npm start

# Manual PocketBase startup only
npm run pocketbase
```

## Claude Desktop Integration

To use this MCP server with Claude Desktop:

1. **Open Claude Desktop Configuration**:

   - On macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - On Windows: `%APPDATA%/Claude/claude_desktop_config.json`
   - On Linux: `~/.config/Claude/claude_desktop_config.json`

2. **Add the todo server configuration** (with auto-start):

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

   **Replace `/absolute/path/to/your/mcp-todo/`** with the actual path to this project directory.

   > 💡 **Auto-Start Feature**: The `MCP_AUTO_START_POCKETBASE=true` environment variable makes the server automatically start PocketBase when Claude Desktop launches it. Remove this line if you prefer to start PocketBase manually.

3. **Restart Claude Desktop** for the changes to take effect.

4. **Verify Integration**: Ask Claude to "show me my todos" or "create a new todo" to test the integration.

### Example Claude Interactions

Once integrated, you can ask Claude to help manage your todos:

- **"Show me my current todos"** - Lists all todos
- **"Create a new todo to review the quarterly report with high priority"** - Creates todos with smart defaults
- **"Mark my MCP setup todo as completed"** - Updates todo status
- **"Show me all high priority tasks that are overdue"** - Advanced filtering
- **"What are my todo statistics?"** - Get overview and analytics
- **"Find all todos tagged with 'development'"** - Search by tags
- **"Delete the test todo"** - Remove completed items

### Development

```bash
npm run dev         # Watch mode with automatic rebuilding
npm run test        # Test the MCP server functionality
npm run pocketbase  # Start PocketBase server
npm run setup       # Build project and start PocketBase
```

## Available Tools

### Basic Operations

- `create_todo` - Create a new todo item
- `get_todo` - Get a specific todo by ID
- `list_todos` - List all todos
- `update_todo` - Update an existing todo
- `delete_todo` - Delete a todo

### Search and Filter

- `search_todos` - Search todos by title, description, or tags
- `get_todos_by_status` - Get todos by completion status
- `get_todos_by_priority` - Get todos by priority level
- `get_todos_by_tag` - Get todos by tag
- `get_overdue_todos` - Get all overdue todos

### Analytics

- `get_todo_stats` - Get todo statistics (total, completed, pending, overdue, by priority)

## Todo Structure

```typescript
{
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}
```

## Example Usage with MCP Client

The server starts with some sample todos to demonstrate functionality:

1. "Set up MCP server" (high priority, development/mcp tags)
2. "Write documentation" (medium priority, documentation tag)
3. "Add tests" (low priority, testing/development tags)

## Integration

To integrate this server with an AI assistant that supports MCP:

1. Build the server: `npm run build`
2. Configure your AI assistant to use this server via stdio
3. The AI assistant can now manage todos using the available tools

## Development

The server is built with:

- TypeScript for type safety
- MCP SDK for protocol implementation
- In-memory storage (todos reset on restart)

For persistent storage, you could extend the `TodoStore` class to use a database or file system.

## Project Structure

```
├── src/                          # TypeScript source code
│   ├── index.ts                  # MCP server implementation
│   ├── todo-store.ts            # PocketBase integration layer
│   └── types.ts                 # Type definitions
├── test/                        # Test utilities
│   └── test-server.js           # MCP server test script
├── pocketbase/                  # PocketBase setup and configuration
│   ├── pocketbase               # PocketBase executable (download separately)
│   ├── POCKETBASE_SETUP.md     # Database setup instructions
│   └── pocketbase-import-config.json # Collection configuration
├── pb_migrations/               # PocketBase database migrations (auto-generated)
├── pb_data/                     # PocketBase data directory (auto-generated)
└── README.md                    # This file
```

## Architecture

This MCP server uses a streamlined architecture with full automation:

- **MCP Server** (`src/index.ts`): Handles MCP protocol communication and auto-starts PocketBase
- **PocketBase Manager**: Automatically starts/stops PocketBase when needed
- **Todo Store** (`src/todo-store.ts`): Manages PocketBase database operations
- **PocketBase** (`pocketbase/`): Provides SQLite-based persistence with auto-migration
- **Admin UI**: Available at http://127.0.0.1:8090/_/ when PocketBase is running

### Automatic Features

When the MCP server starts, it automatically:

1. 🚀 **Starts PocketBase** process (if `MCP_AUTO_START_POCKETBASE=true`)
2. 📊 **Creates database** (pb_data/data.db) on first run
3. 🔄 **Applies migrations** from pb_migrations/ folder
4. ✅ **Sets up todos collection** with proper schema and API rules
5. ⏱️ **Waits for full initialization** before accepting requests
6. 🔗 Connects the MCP server to handle requests
7. 🛑 Gracefully shuts down PocketBase when the session ends

This provides a seamless experience where users don't need to manually manage PocketBase.
