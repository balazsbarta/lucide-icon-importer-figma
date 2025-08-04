# Lucide Icon Importer for Figma

A Figma plugin that imports all Lucide icons into your design, automatically flattening them to single vector shapes and creating components with descriptions and keywords.

## Features

- 🎯 **Complete Icon Set**: Imports all available Lucide icons
- 🔄 **Auto-Flattening**: Converts icons to single vector shapes for easier editing
- 📦 **Component Creation**: Automatically creates components from each icon
- 🏷️ **Rich Metadata**: Includes icon descriptions, keywords, and categories
- 📐 **Grid Layout**: Organizes icons in a clean grid for easy browsing
- ⚡ **Fast Import**: Batch processing with progress indicators

## Installation

1. Clone this repository or download the files
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the plugin:
   ```bash
   npm run build
   ```
4. In Figma, go to `Plugins > Development > Import plugin from manifest...`
5. Select the `manifest.json` file from this project
6. The plugin will now appear in your `Plugins > Development` menu

## Usage

1. **Open the Plugin**: 
   - Go to `Plugins > Development > Lucide Icon Importer`
   - Or use `Plugins > Import All Lucide Icons`

2. **Configure Options**:
   - ✅ **Create components from icons**: Creates Figma components for each icon
   - ✅ **Include keywords in descriptions**: Adds searchable keywords to component descriptions
   - ⬜ **Organize by category**: Groups icons by their categories (future feature)

3. **Import Icons**:
   - Click "Import All Icons"
   - Watch the progress as icons are imported
   - Icons will be placed on a new page called "Lucide Icons"

## What You Get

After importing, you'll have:

- **Individual Frames**: Each icon in its own 64x64px frame with the icon name
- **Vector Shapes**: Icons converted to single vector paths for easy editing and replacement
- **Components**: Ready-to-use components with proper naming
- **Rich Descriptions**: Official tags for search

## Icon Organization

Icons are laid out in a grid with:
- 20 icons per row
- 40px spacing between icons
- 24x24px icon size within 64x64px frames
- Alphabetical ordering

## Example Component Description

```
house, building, residence, homepage, main
```

## Development

### Building
```bash
npm run build
```

### Development Mode
```bash
npm run dev
```

This will watch for file changes and rebuild automatically.

### Project Structure

```
├── manifest.json              # Figma plugin manifest
├── ui.html                    # Plugin UI interface
├── src/
│   ├── code.ts                # Main plugin logic (runs in Figma)
│   ├── ui.ts                  # UI script (runs in iframe)
│   └── lucide-icons-data.ts   # Generated icon data with SVG strings and keywords
├── scripts/
│   └── generate-icons.js      # Script to generate icon data from Lucide package
├── dist/                      # Built JavaScript files
│   ├── code.js
│   └── ui.js
└── package.json
```

## Customization

### Changing Layout
Adjust the grid layout by modifying these constants in `src/code.ts`:
```typescript
const ICON_SIZE = 24;      // Icon size in pixels
const FRAME_SIZE = 64;     // Frame size in pixels
const COLS = 20;           // Number of columns
const SPACING = 80;        // Spacing between frames
```

### Icon Data Generation
Keywords and categories are automatically generated using semantic analysis in `scripts/generate-icons.js`. The script analyzes icon names and applies comprehensive semantic mappings to generate relevant keywords for each icon.

## Troubleshooting

### Icons Not Appearing
- Ensure the build completed successfully
- Check the browser console for any error messages
- Verify the manifest.json points to the correct file paths

### Performance Issues
- The plugin processes icons in batches to prevent overwhelming Figma
- Large icon sets may take a few minutes to complete
- Close other heavy plugins while importing

### Import Fails
- Check that you have sufficient memory and processing power
- Try importing smaller batches if issues persist
- Restart Figma if the plugin becomes unresponsive

## License

This project is open source. Lucide icons are also open source and maintained by the Lucide team.

## Credits

- **Lucide Icons**: https://lucide.dev/
- **Figma Plugin API**: https://www.figma.com/plugin-docs/
- Built with TypeScript and Webpack
