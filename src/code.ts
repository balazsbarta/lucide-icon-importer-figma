// Main plugin code that runs in the Figma plugin environment
import { LUCIDE_ICONS_DATA } from './lucide-icons-data';

interface LucideIconData {
  name: string;
  svg: string;
  keywords: string[];
  categories: string[];
}

console.log('Lucide Icon Importer plugin loaded');

// This shows the HTML page in "ui.html"
figma.showUI(__html__, { width: 360, height: 500 });

interface ImportOptions {
  createComponents: boolean;
  includeKeywords: boolean;
  organizeByCategory: boolean;
}

// Listen for messages from the UI
figma.ui.onmessage = async (msg: any) => {
  console.log('Received message:', msg);
  
  if (msg.type === 'import-icons') {
    console.log('Starting icon import with options:', msg.options);
    try {
      await importLucideIcons(msg.options);
      console.log('Icon import completed successfully');
      figma.ui.postMessage({ type: 'complete' });
    } catch (error) {
      console.error('Error importing icons:', error);
      figma.ui.postMessage({ 
        type: 'error', 
        data: { message: error instanceof Error ? error.message : 'Unknown error' }
      });
    }
  }
};

async function importLucideIcons(options: ImportOptions) {
  console.log('importLucideIcons function started with options:', options);
  
  // Create a new page for the icons
  const iconPage = figma.createPage();
  iconPage.name = 'Lucide Icons';
  figma.currentPage = iconPage;
  console.log('Created new page:', iconPage.name);

  // Get all Lucide icons data
  console.log('Getting icons data...');
  const iconsData = await getLucideIconsData();
  console.log('Icons data retrieved, count:', Object.keys(iconsData).length);
  
  const icons = Object.entries(iconsData);
  const total = icons.length;
  
  figma.ui.postMessage({
    type: 'progress',
    data: { current: 0, total, message: 'Starting import...' }
  });

  // Grid layout settings
  const ICON_SIZE = 24;
  const FRAME_SIZE = 24; // Frame size
  const COLS = 20;
  const SPACING = 64; // 40px gap + 24px icon = 64px spacing between icon centers
  
  let currentX = 0;
  let currentY = 0;
  let col = 0;

  for (let i = 0; i < icons.length; i++) {
    const [iconName, iconData] = icons[i];
    
    figma.ui.postMessage({
      type: 'progress',
      data: { current: i + 1, total, message: `Processing ${iconName}...` }
    });

    try {
      // Import SVG as vector and create component directly
      const svgNode = await createVectorFromSvg(iconData.svg, iconName);
      if (svgNode) {
        // Position the SVG content without resizing it
        svgNode.x = currentX;
        svgNode.y = currentY;
        // Don't resize the SVG node - keep original proportions
        
        // Create component directly from the SVG node if option is enabled
        if (options.createComponents) {
          await createComponentFromSvg(svgNode, iconName, iconData, options, currentX, currentY);
        } else {
          // If not creating components, just add the SVG to the page
          figma.currentPage.appendChild(svgNode);
        }
      }
      
      // Update grid position
      col++;
      if (col >= COLS) {
        col = 0;
        currentX = 0;
        currentY += SPACING;
      } else {
        currentX += SPACING;
      }
      
    } catch (error) {
      console.error(`Error processing icon ${iconName}:`, error);
    }

    // Add small delay to prevent overwhelming Figma
    if (i % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
  
  // Zoom to fit all icons
  figma.viewport.scrollAndZoomIntoView(iconPage.children);
}

async function createVectorFromSvg(svgString: string, iconName: string): Promise<FrameNode | null> {
  try {
    console.log(`Creating vector for ${iconName}`);
    
    // Use Figma's built-in SVG import
    const svgNode = await figma.createNodeFromSvg(svgString);
    
    if (svgNode) {
      svgNode.name = iconName;
      console.log(`Successfully created SVG node for ${iconName}`);
      return svgNode;
    } else {
      console.warn(`Failed to create SVG node for ${iconName}`);
      return null;
    }
  } catch (error) {
    console.error(`Error creating vector from SVG for ${iconName}:`, error);
    return null;
  }
}

async function createComponentFromSvg(svgNode: FrameNode, iconName: string, iconData: LucideIconData, options: ImportOptions, x: number, y: number): Promise<void> {
  try {
    // First, flatten all the vector paths in the SVG node
    const vectorNodes: VectorNode[] = [];
    
    // Collect all vector nodes from the SVG
    function collectVectorNodes(node: SceneNode) {
      if (node.type === 'VECTOR') {
        vectorNodes.push(node as VectorNode);
      } else if ('children' in node) {
        for (const child of node.children) {
          collectVectorNodes(child);
        }
      }
    }
    
    collectVectorNodes(svgNode);
    
    // If we have multiple vector nodes, flatten them
    let flattenedNode: VectorNode | null = null;
    if (vectorNodes.length > 1) {
      // Select all vector nodes and flatten them
      figma.currentPage.selection = vectorNodes;
      const flattened = figma.flatten(vectorNodes);
      if (flattened && flattened.type === 'VECTOR') {
        flattenedNode = flattened as VectorNode;
        flattenedNode.name = iconName;
      }
    } else if (vectorNodes.length === 1) {
      flattenedNode = vectorNodes[0];
      flattenedNode.name = iconName;
    }
    
    // Create component from the flattened vector
    if (flattenedNode) {
      const component = figma.createComponent();
      component.name = iconName;
      component.resize(24, 24); // Fixed 24x24 size
      component.x = x;
      component.y = y;
      
      // Clone the flattened vector into the component
      const vectorClone = flattenedNode.clone();
      vectorClone.name = "Vector"; // Consistent naming for all vectors
      
      // Add it to the component first
      component.appendChild(vectorClone);
      
      // PRESERVE ORIGINAL POSITIONING - Do NOT center the vector
      // The original Lucide SVG positioning should be maintained
      // This ensures icons like wifi signals, arrows, etc. maintain their intended alignment
      // vectorClone.x and vectorClone.y will maintain their original SVG coordinates
      
      // Set component description with keywords
      if (options.includeKeywords && iconData.keywords.length > 0) {
        component.description = iconData.keywords.join(', ');
      } else {
        component.description = `Lucide icon: ${iconName}`;
      }
      
      // Add to page
      figma.currentPage.appendChild(component);
      
      // Remove the original flattened vector since we've created a component from it
      flattenedNode.remove();
    } else {
      // Fallback: if no vector nodes found, create component from SVG node directly
      const component = figma.createComponent();
      component.name = iconName;
      component.resize(24, 24); // Fixed 24x24 size
      component.x = x;
      component.y = y;
      
      // Copy SVG node children to component and rename vectors consistently
      const children = [...svgNode.children];
      for (const child of children) {
        const clonedChild = child.clone();
        if (clonedChild.type === 'VECTOR') {
          clonedChild.name = "Vector"; // Consistent naming
        }
        component.appendChild(clonedChild);
      }
      
      // Set component description with keywords
      if (options.includeKeywords && iconData.keywords.length > 0) {
        component.description = iconData.keywords.join(', ');
      } else {
        component.description = `Lucide icon: ${iconName}`;
      }
      
      // Add to page
      figma.currentPage.appendChild(component);
    }
    
    // Remove the original SVG node since we've created a component from it
    svgNode.remove();
    
  } catch (error) {
    console.error(`Error creating component for ${iconName}:`, error);
    // If component creation fails, at least add the SVG node to the page
    figma.currentPage.appendChild(svgNode);
  }
}

async function getLucideIconsData(): Promise<Record<string, LucideIconData>> {
  console.log('Loading Lucide icons data...');
  
  // Use the pre-generated icon data
  console.log(`Loaded ${Object.keys(LUCIDE_ICONS_DATA).length} Lucide icons`);
  return LUCIDE_ICONS_DATA;
}
