// SVG to Figma vector conversion utilities
export interface SVGPath {
  d: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export function parseSvgString(svgString: string): SVGPath[] {
  const paths: SVGPath[] = [];
  
  // Basic SVG parsing - extract path elements
  const pathRegex = /<path[^>]*d="([^"]*)"[^>]*>/g;
  const fillRegex = /fill="([^"]*)"/;
  const strokeRegex = /stroke="([^"]*)"/;
  const strokeWidthRegex = /stroke-width="([^"]*)"/;
  
  let match;
  while ((match = pathRegex.exec(svgString)) !== null) {
    const pathElement = match[0];
    const d = match[1];
    
    const fillMatch = pathElement.match(fillRegex);
    const strokeMatch = pathElement.match(strokeRegex);
    const strokeWidthMatch = pathElement.match(strokeWidthRegex);
    
    paths.push({
      d,
      fill: fillMatch ? fillMatch[1] : undefined,
      stroke: strokeMatch ? strokeMatch[1] : undefined,
      strokeWidth: strokeWidthMatch ? parseFloat(strokeWidthMatch[1]) : undefined
    });
  }
  
  // Also parse other basic shapes
  const lineRegex = /<line[^>]*x1="([^"]*)"[^>]*y1="([^"]*)"[^>]*x2="([^"]*)"[^>]*y2="([^"]*)"[^>]*>/g;
  while ((match = lineRegex.exec(svgString)) !== null) {
    const x1 = parseFloat(match[1]);
    const y1 = parseFloat(match[2]);
    const x2 = parseFloat(match[3]);
    const y2 = parseFloat(match[4]);
    
    paths.push({
      d: `M${x1},${y1}L${x2},${y2}`,
      stroke: 'currentColor',
      strokeWidth: 2
    });
  }
  
  const circleRegex = /<circle[^>]*cx="([^"]*)"[^>]*cy="([^"]*)"[^>]*r="([^"]*)"[^>]*>/g;
  while ((match = circleRegex.exec(svgString)) !== null) {
    const cx = parseFloat(match[1]);
    const cy = parseFloat(match[2]);
    const r = parseFloat(match[3]);
    
    // Convert circle to path
    const d = `M${cx-r},${cy}A${r},${r} 0 1,0 ${cx+r},${cy}A${r},${r} 0 1,0 ${cx-r},${cy}`;
    
    paths.push({
      d,
      stroke: 'currentColor',
      strokeWidth: 2
    });
  }
  
  const rectRegex = /<rect[^>]*x="([^"]*)"[^>]*y="([^"]*)"[^>]*width="([^"]*)"[^>]*height="([^"]*)"[^>]*>/g;
  while ((match = rectRegex.exec(svgString)) !== null) {
    const x = parseFloat(match[1]);
    const y = parseFloat(match[2]);
    const width = parseFloat(match[3]);
    const height = parseFloat(match[4]);
    
    const d = `M${x},${y}L${x+width},${y}L${x+width},${y+height}L${x},${y+height}Z`;
    
    paths.push({
      d,
      stroke: 'currentColor',
      strokeWidth: 2
    });
  }
  
  const polylineRegex = /<polyline[^>]*points="([^"]*)"[^>]*>/g;
  while ((match = polylineRegex.exec(svgString)) !== null) {
    const points = match[1].trim().split(/\s+|,/);
    let d = '';
    
    for (let i = 0; i < points.length; i += 2) {
      const x = points[i];
      const y = points[i + 1];
      
      if (i === 0) {
        d += `M${x},${y}`;
      } else {
        d += `L${x},${y}`;
      }
    }
    
    paths.push({
      d,
      stroke: 'currentColor',
      strokeWidth: 2
    });
  }
  
  const polygonRegex = /<polygon[^>]*points="([^"]*)"[^>]*>/g;
  while ((match = polygonRegex.exec(svgString)) !== null) {
    const points = match[1].trim().split(/\s+|,/);
    let d = '';
    
    for (let i = 0; i < points.length; i += 2) {
      const x = points[i];
      const y = points[i + 1];
      
      if (i === 0) {
        d += `M${x},${y}`;
      } else {
        d += `L${x},${y}`;
      }
    }
    d += 'Z'; // Close the path for polygon
    
    paths.push({
      d,
      stroke: 'currentColor',
      strokeWidth: 2
    });
  }
  
  return paths;
}

export function createVectorNodeFromPaths(paths: SVGPath[], name: string): VectorNode {
  const vectorNode = figma.createVector();
  vectorNode.name = name;
  
  if (paths.length > 0) {
    // For simplicity, we'll use the first path
    // In a full implementation, you'd want to combine multiple paths
    const firstPath = paths[0];
    
    try {
      // Set the vector path data
      vectorNode.vectorPaths = [{
        windingRule: 'NONZERO',
        data: firstPath.d
      }];
      
      // Set fills and strokes
      const fills: Paint[] = [];
      const strokes: Paint[] = [];
      
      if (firstPath.fill && firstPath.fill !== 'none' && firstPath.fill !== 'transparent') {
        if (firstPath.fill === 'currentColor') {
          fills.push({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } });
        } else {
          const color = parseColor(firstPath.fill);
          if (color) {
            fills.push({ type: 'SOLID', color });
          }
        }
      }
      
      if (firstPath.stroke && firstPath.stroke !== 'none' && firstPath.stroke !== 'transparent') {
        if (firstPath.stroke === 'currentColor') {
          strokes.push({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } });
        } else {
          const color = parseColor(firstPath.stroke);
          if (color) {
            strokes.push({ type: 'SOLID', color });
          }
        }
      }
      
      // Default to black stroke if no fill or stroke specified
      if (fills.length === 0 && strokes.length === 0) {
        strokes.push({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } });
      }
      
      vectorNode.fills = fills;
      vectorNode.strokes = strokes;
      
      if (firstPath.strokeWidth) {
        vectorNode.strokeWeight = firstPath.strokeWidth;
      } else if (strokes.length > 0) {
        vectorNode.strokeWeight = 2;
      }
      
      // Set stroke properties for better appearance
      if (strokes.length > 0) {
        vectorNode.strokeCap = 'ROUND';
        vectorNode.strokeJoin = 'ROUND';
      }
      
    } catch (error) {
      console.warn(`Could not set vector path for ${name}:`, error);
      // Fallback: create a simple rectangle
      vectorNode.vectorPaths = [{
        windingRule: 'NONZERO',
        data: 'M2,2L22,2L22,22L2,22Z'
      }];
      vectorNode.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
      vectorNode.strokeWeight = 2;
    }
  }
  
  return vectorNode;
}

function parseColor(colorString: string): RGB | null {
  // Handle hex colors
  if (colorString.startsWith('#')) {
    const hex = colorString.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16) / 255;
      const g = parseInt(hex[1] + hex[1], 16) / 255;
      const b = parseInt(hex[2] + hex[2], 16) / 255;
      return { r, g, b };
    } else if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      return { r, g, b };
    }
  }
  
  // Handle rgb() colors
  const rgbMatch = colorString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]) / 255;
    const g = parseInt(rgbMatch[2]) / 255;
    const b = parseInt(rgbMatch[3]) / 255;
    return { r, g, b };
  }
  
  // Handle named colors (basic set)
  const namedColors: Record<string, RGB> = {
    'black': { r: 0, g: 0, b: 0 },
    'white': { r: 1, g: 1, b: 1 },
    'red': { r: 1, g: 0, b: 0 },
    'green': { r: 0, g: 1, b: 0 },
    'blue': { r: 0, g: 0, b: 1 },
    'yellow': { r: 1, g: 1, b: 0 },
    'cyan': { r: 0, g: 1, b: 1 },
    'magenta': { r: 1, g: 0, b: 1 },
    'gray': { r: 0.5, g: 0.5, b: 0.5 },
    'grey': { r: 0.5, g: 0.5, b: 0.5 }
  };
  
  return namedColors[colorString.toLowerCase()] || null;
}
