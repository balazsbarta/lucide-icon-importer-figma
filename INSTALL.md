# Installation Guide for Lucide Icon Importer

## Quick Start

1. **Download or Clone**: Get this project on your computer
2. **Install Dependencies**: Open terminal in the project folder and run:
   ```bash
   npm install
   ```
3. **Build the Plugin**: Run:
   ```bash
   npm run build
   ```
4. **Import into Figma**: 
   - Open Figma
   - Go to `Plugins` → `Development` → `Import plugin from manifest...`
   - Select the `manifest.json` file from this folder
   - The plugin will appear in your plugins menu

## Using the Plugin

1. **Open the Plugin**: `Plugins` → `Lucide Icon Importer` → `Import All Lucide Icons`
2. **Choose Your Options**:
   - ✅ Create components from icons (recommended)
   - ✅ Include keywords in descriptions (recommended for searchability)
   - ⬜ Organize by category (future feature)
3. **Click "Import All Icons"** and wait for completion
4. **Find Your Icons**: A new page called "Lucide Icons" will be created with all icons

## What You'll Get

- **1,000+ Icons**: All Lucide icons imported as vector shapes
- **Components**: Each icon becomes a reusable component
- **Rich Metadata**: Searchable keywords and descriptions
- **Perfect Vectors**: Single-path vectors ready for customization
- **Grid Layout**: Organized 20 icons per row for easy browsing

## Pro Tips

- **Search Components**: Use Figma's component search with keywords like "arrow", "user", "mail"
- **Customize Colors**: Change the stroke color of any icon
- **Resize Safely**: Icons are vectors so they scale perfectly
- **Create Variants**: Use as a base for your own icon component variants
- **Export**: Use Figma's export tools to get SVG, PNG, or other formats

## Troubleshooting

**Plugin won't load?**
- Make sure you ran `npm install` and `npm run build`
- Check that `dist/code.js` and `dist/ui.js` exist

**Import takes too long?**
- This is normal for 1,000+ icons
- Close other plugins during import
- Be patient - it's worth the wait!

**Icons look wrong?**
- Icons are stroked by default (not filled)
- Change the stroke color in Figma's design panel
- Make sure stroke weight is set to 2 for best appearance

## Development

Want to modify the plugin?

```bash
# Start development mode (auto-rebuilds on changes)
npm run dev

# Build once
npm run build
```

Happy designing! 🎨
