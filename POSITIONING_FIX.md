# Icon Positioning Fix

## Problem
The previous version was centering all icon vectors within their component frames, which destroyed the intentional positioning from the original Lucide SVGs. This caused issues where:

- WiFi signal icons lost their bottom-left alignment
- Arrows lost their specific positioning
- Other directional icons were incorrectly centered

## Solution
1. **SVG Generation**: Modified `lucideToSvg()` function to preserve all original SVG attributes including viewBox and positioning
2. **Component Creation**: Removed the explicit centering logic (`vectorClone.x = 0; vectorClone.y = 0`)
3. **Position Preservation**: Added `preservePositioning: true` flag to icon data
4. **Original ViewBox**: Stored original viewBox information for reference

## What Changed
- **scripts/generate-icons.js**: Enhanced to preserve original SVG structure and positioning
- **src/code.ts**: Removed vector centering logic in `createComponentFromSvg()`
- **Icon Data**: Added positioning metadata to each icon

## Result
Icons now maintain their original Lucide positioning and alignment, ensuring consistency with the official Lucide icon set.

## Testing
1. Load the plugin in Figma
2. Import icons
3. Compare positioning with official Lucide icons (especially directional ones like wifi, arrows, etc.)
4. Verify that icons like `wifi`, `signal`, `arrow-*` maintain their intended alignment
