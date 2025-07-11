# Command Palette Documentation

## Overview
The command palette is a powerful search-driven interface that provides quick access to all functionality in your n8n workflow management application. It can be triggered with keyboard shortcuts and provides categorized access to navigation, actions, and system functions.

## Usage

### Opening the Command Palette
- **Keyboard Shortcut**: Press `⌘K` (Mac) or `Ctrl+K` (Windows/Linux)
- **Button**: Click the "Open Command Palette" button on the home page
- **Programmatic**: Dispatch a keyboard event with `key: 'k'` and `metaKey: true`

### Navigation
- **Search**: Type to filter commands across all categories
- **Arrow Keys**: Navigate up/down through results
- **Enter**: Execute the selected command
- **Escape**: Close the command palette

## Command Categories

### 1. Navigation
Quick access to all main pages:
- **Home** (`⌘H`) - Landing page
- **Dashboard** (`⌘D`) - Main analytics dashboard
- **Workflows** (`⌘W`) - Workflow management
- **Templates** (`⌘T`) - Browse 3,807+ templates
- **Integrations** (`⌘I`) - View available integrations
- **Executions** (`⌘E`) - Monitor workflow executions
- **Credentials** (`⌘C`) - Manage API credentials
- **Search** (`⌘S`) - Global search
- **Documentation** (`⌘?`) - Help documentation
- **System Health** - Monitor system status

### 2. Quick Actions
Frequently used actions:
- **Create New Workflow** (`⌘N`) - Start building a new workflow
- **Deploy Template** (`⌘⇧D`) - Deploy a template to n8n
- **Test Connection** (`⌘⇧T`) - Test n8n API connectivity
- **Refresh Data** (`⌘R`) - Reload all data
- **Toggle Theme** (`⌘⇧L`) - Switch between light/dark theme

### 3. Workflow Management
Workflow-specific operations:
- **List All Workflows** - View all workflows
- **Active Workflows Only** - Filter to active workflows
- **Recent Executions** - View recent executions
- **Failed Executions** - View failed executions

### 4. Template Categories
Browse templates by category:
- **AI/ML Templates** - 1,996+ AI workflows
- **Communication Templates** - 562+ messaging workflows
- **Database Templates** - 183+ database workflows
- **Email Templates** - Gmail automation workflows

### 5. Popular Searches
Common search queries:
- **OpenAI Workflows** - AI-powered workflows
- **Slack Integration** - Slack messaging workflows
- **Gmail Automation** - Email automation
- **Discord Bots** - Discord bot workflows

### 6. System & Admin
System administration:
- **System Health Check** - Check n8n connectivity
- **API Documentation** - View API docs
- **Credential Management** - Manage API keys
- **Integration Catalog** - Browse 365+ integrations

## Technical Implementation

### Components
- **CommandPalette** - Main component with search and navigation
- **CommandDialog** - Dialog wrapper with accessibility features
- **CommandInput** - Search input with icons
- **CommandList** - Scrollable results list
- **CommandItem** - Individual command items
- **CommandGroup** - Category grouping
- **CommandShortcut** - Keyboard shortcut display

### Features
- **Real-time Search** - Filters across all categories
- **Keyboard Navigation** - Full keyboard support
- **Accessibility** - Screen reader compatible
- **Responsive Design** - Works on all screen sizes
- **Icon Support** - Lucide React icons
- **Categorization** - Organized by functionality
- **Shortcuts** - Keyboard shortcuts displayed

### Integration
- **Router Integration** - Uses Next.js router for navigation
- **API Integration** - Direct API calls for actions like connection testing
- **Theme Integration** - Theme toggle functionality
- **Toast Integration** - Future enhancement for notifications

## Extending the Command Palette

### Adding New Commands
To add new commands, update the `categories` array in `src/components/command-palette.tsx`:

```typescript
{
  name: "Command Name",
  description: "Command description",
  icon: IconName,
  shortcut: "⌘X",
  onSelect: () => runCommand(() => {
    // Command logic here
  }),
}
```

### Adding New Categories
Add new categories to the `categories` array:

```typescript
{
  name: "New Category",
  items: [
    // Commands here
  ],
}
```

### Keyboard Shortcuts
Available modifier keys:
- `⌘` - Command/Meta key (Mac)
- `Ctrl` - Control key (Windows/Linux)
- `⇧` - Shift key
- `⌥` - Option/Alt key

## Best Practices

1. **Keep descriptions clear** - Use concise, descriptive text
2. **Use appropriate icons** - Match icons to functionality
3. **Organize logically** - Group related commands
4. **Test keyboard navigation** - Ensure all shortcuts work
5. **Consider accessibility** - Add proper ARIA labels
6. **Update documentation** - Keep this file current with changes

## Troubleshooting

### Common Issues
- **Keyboard shortcuts not working** - Check for conflicting browser shortcuts
- **API calls failing** - Verify n8n connection and credentials
- **Search not filtering** - Check search logic in `filteredCategories`
- **Icons not displaying** - Ensure icons are imported from lucide-react

### Performance
- Search filtering uses `useMemo` for optimization
- Large command lists are virtualized in the dialog
- API calls are debounced to prevent excessive requests 