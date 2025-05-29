# Todo Web UI

A beautiful React web interface for the MCP Todo Server, built with [Entur's Design System](https://linje.entur.no/).

## Features

- 🎨 **Modern UI** - Built with Entur's professional design components
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ⚡ **Real-time Sync** - Shares the same PocketBase database as the MCP server
- 🔍 **Advanced Filtering** - Filter by status, priority, and search text
- 📊 **Statistics Dashboard** - Visual overview of your todos
- ✅ **Full CRUD Operations** - Create, read, update, and delete todos
- 🏷️ **Tags Support** - Organize todos with custom tags
- 📅 **Due Dates** - Set and track due dates with overdue indicators
- 🎯 **Priority Levels** - High, medium, and low priority with visual indicators

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PocketBase running on port 8090

### Installation

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start development server
npm run dev
```

### Development

The web UI runs on `http://localhost:3000` and proxies API requests to PocketBase on `http://localhost:8090`.

#### Start Everything at Once

From the root project directory:

```bash
# Start both PocketBase and web UI
npm run dev:all
```

#### Manual Setup

1. **Start PocketBase** (from root directory):

   ```bash
   npm run pocketbase
   ```

2. **Start Web UI** (in separate terminal):

   ```bash
   cd web
   npm run dev
   ```

3. **Open in browser**: `http://localhost:3000`

## Architecture

### Frontend Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Entur Design System** - Professional UI components

### API Integration

- **PocketBase REST API** - Database operations
- **Real-time Updates** - Automatic data synchronization
- **Error Handling** - User-friendly error messages
- **Loading States** - Smooth user experience

### Components

- `TodoList` - Main todo list with filtering and search
- `TodoItem` - Individual todo card with actions
- `TodoForm` - Create/edit todo form
- `TodoStats` - Statistics dashboard

### Services

- `todoService` - API client for PocketBase
- `useTodos` - React hook for todo operations
- `useTodoStats` - React hook for statistics

## Design System

This app showcases [Entur's Design System](https://linje.entur.no/) components:

- **@entur/button** - Primary and secondary buttons
- **@entur/form** - Text fields, text areas, and form controls
- **@entur/typography** - Consistent text styling
- **@entur/layout** - Grid and spacing utilities
- **@entur/tokens** - Design tokens and CSS variables

## API Endpoints

The web UI communicates with PocketBase through these endpoints:

- `GET /api/collections/todos/records` - List all todos
- `POST /api/collections/todos/records` - Create todo
- `PATCH /api/collections/todos/records/:id` - Update todo
- `DELETE /api/collections/todos/records/:id` - Delete todo

## Features in Detail

### Todo Management

- ✅ **Create todos** with title, description, priority, tags, and due dates
- ✏️ **Edit todos** inline or in dedicated forms
- 🗑️ **Delete todos** with confirmation
- ☑️ **Toggle completion** with visual feedback

### Filtering & Search

- 🔍 **Search** by title, description, or tags
- 📋 **Filter by status** - All, Pending, Completed
- 🎯 **Filter by priority** - All, High, Medium, Low
- 🔄 **Auto-sorting** - Pending first, then by priority and date

### Visual Design

- 🎨 **Priority indicators** - Color-coded borders and badges
- 📅 **Due date highlighting** - Overdue items in red
- 🏷️ **Tag visualization** - Styled tag chips
- 📊 **Statistics cards** - Overview metrics
- ✅ **Completion states** - Strikethrough and muted styling

### User Experience

- ⚡ **Fast loading** - Optimized builds and caching
- 📱 **Responsive** - Mobile-first design
- ♿ **Accessible** - WCAG compliant components
- 🔄 **Error recovery** - Graceful error handling
- 💾 **Auto-save** - Immediate persistence

## Multiple Access Methods

Your todos are accessible through:

1. **Web UI** (this app) - `http://localhost:3000`
2. **MCP Server** - Claude Desktop integration
3. **PocketBase Admin** - `http://localhost:8090/_/`
4. **Direct API** - REST endpoints

All methods share the same database, so changes sync automatically!

## Development Tips

### Customizing Styling

Entur components can be customized using CSS custom properties:

```css
:root {
  --entur-primary-color: #1976d2;
  --entur-secondary-color: #666;
}
```

### Adding New Features

1. **Update types** in `src/types/todo.ts`
2. **Extend API service** in `src/services/todoService.ts`
3. **Update hooks** in `src/hooks/useTodos.ts`
4. **Modify components** as needed

### Testing

```bash
# Run type checking
npm run build

# Start development server
npm run dev
```

## Deployment

### Production Build

```bash
npm run build
```

### Deploy to Static Hosting

The `dist/` folder contains a static React app that can be deployed to:

- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

### Environment Variables

- `VITE_API_BASE_URL` - PocketBase API URL (default: `/api`)

## License

MIT License - see LICENSE.md file.
