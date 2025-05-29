# PocketBase Setup Instructions

## ✅ Automatic Setup

**Good news!** PocketBase automatically applies migrations when it starts up. No manual setup required!

When PocketBase starts for the first time, it will:

- ✅ Create `pb_data/` directory and SQLite database
- ✅ Apply migration `1748601711_created_todos.js`
- ✅ Create todos collection with all fields and API rules
- ✅ Generate TypeScript definitions

**The MCP server is ready to use immediately!**

## 🔧 Creating an Admin Account (Optional)

If you want to view and manage your todos through the database admin UI:

### Setup Admin Access

1. **Start PocketBase**:

   ```bash
   ./pocketbase serve
   ```

   Or use the MCP server auto-start: `npm run start:auto`

2. **Visit Admin UI**: Open http://127.0.0.1:8090/_/ in your browser

3. **Create Admin Account**:
   - Enter your email address
   - Create a secure password
   - Click "Create admin"

### View the Database Admin UI

Once you have admin access, you can:

- **📊 Browse Todos**: View all your todos in a table format
- **🔍 Search & Filter**: Find specific todos quickly
- **📝 Edit Data**: Modify todos directly in the web interface
- **📋 View Schema**: See the auto-created todos collection structure
- **📈 Monitor API**: Check API usage and logs
- **💾 Export Data**: Download your todos for backup

**Admin UI URL**: http://127.0.0.1:8090/_/

That's it! No manual collection creation needed.
