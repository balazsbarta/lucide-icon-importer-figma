// Script to generate the complete Lucide icons data for the Figma plugin
const fs = require('fs');
const path = require('path');

// Import the lucide library
const lucide = require('lucide');

console.log('Generating Lucide icons data...');

// Smart semantic keyword generator for Lucide icons
function getIconKeywords(iconName) {
  // Convert PascalCase to kebab-case for analysis
  const kebabName = iconName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
  const nameWords = kebabName.split('-').filter(word => word.length > 1);
  
  let keywords = new Set(nameWords); // Start with the name words
  
  // Category-based semantic keywords
  const semanticMap = {
    // Navigation & Arrows
    arrow: ['direction', 'navigation', 'pointer', 'movement'],
    chevron: ['direction', 'navigation', 'expand', 'collapse'],
    triangle: ['shape', 'direction', 'pointer'],
    corner: ['direction', 'turn', 'angle'],
    
    // Actions & Controls
    play: ['media', 'start', 'begin', 'video', 'audio'],
    pause: ['media', 'stop', 'halt', 'break'],
    stop: ['media', 'end', 'halt', 'square'],
    skip: ['media', 'next', 'forward', 'jump'],
    rewind: ['media', 'back', 'previous', 'reverse'],
    volume: ['audio', 'sound', 'speaker', 'music'],
    
    // Files & Data
    file: ['document', 'data', 'storage', 'text'],
    folder: ['directory', 'organize', 'collection', 'group'],
    archive: ['compress', 'backup', 'storage', 'save'],
    download: ['save', 'import', 'get', 'receive'],
    upload: ['send', 'export', 'share', 'publish'],
    cloud: ['storage', 'sync', 'backup', 'online'],
    database: ['data', 'storage', 'server', 'records'],
    
    // Communication & Social
    message: ['chat', 'communication', 'text', 'talk'],
    mail: ['email', 'envelope', 'send', 'contact'],
    phone: ['call', 'contact', 'device', 'mobile'],
    user: ['person', 'account', 'profile', 'member'],
    users: ['people', 'team', 'group', 'community'],
    heart: ['love', 'favorite', 'like', 'bookmark'],
    star: ['favorite', 'rating', 'bookmark', 'important'],
    
    // Interface & Editing
    edit: ['modify', 'change', 'write', 'pencil'],
    plus: ['add', 'create', 'new', 'increase'],
    minus: ['subtract', 'remove', 'decrease', 'less'],
    x: ['close', 'cancel', 'exit', 'delete', 'remove'],
    check: ['confirm', 'approve', 'done', 'success'],
    search: ['find', 'magnify', 'lookup', 'filter'],
    settings: ['config', 'preferences', 'options', 'gear'],
    
    // Security & Privacy
    lock: ['secure', 'private', 'protected', 'safety'],
    unlock: ['open', 'access', 'public', 'free'],
    eye: ['view', 'visible', 'watch', 'see'],
    shield: ['protection', 'security', 'defense', 'guard'],
    key: ['password', 'access', 'security', 'login'],
    
    // Technology & Devices
    wifi: ['internet', 'connection', 'wireless', 'network'],
    bluetooth: ['wireless', 'connection', 'device', 'pair'],
    battery: ['power', 'energy', 'charge', 'device'],
    monitor: ['screen', 'display', 'computer', 'desktop'],
    smartphone: ['mobile', 'device', 'phone', 'app'],
    laptop: ['computer', 'notebook', 'device', 'portable'],
    camera: ['photo', 'picture', 'capture', 'image'],
    
    // Layout & Alignment
    align: ['layout', 'position', 'arrange', 'organize'],
    center: ['middle', 'position', 'layout', 'balance'],
    left: ['position', 'layout', 'align', 'direction'],
    right: ['position', 'layout', 'align', 'direction'],
    vertical: ['layout', 'position', 'column', 'orientation'],
    horizontal: ['layout', 'position', 'row', 'orientation'],
    justify: ['layout', 'position', 'space', 'distribute'],
    
    // Time & Calendar
    calendar: ['date', 'schedule', 'event', 'time'],
    clock: ['time', 'hour', 'watch', 'schedule'],
    alarm: ['alert', 'reminder', 'wake', 'notification'],
    timer: ['countdown', 'stopwatch', 'duration', 'measure'],
    
    // Weather & Nature
    sun: ['weather', 'day', 'bright', 'light'],
    moon: ['night', 'dark', 'lunar', 'evening'],
    cloud: ['weather', 'sky', 'overcast'],
    rain: ['weather', 'water', 'precipitation', 'storm'],
    snow: ['weather', 'winter', 'cold', 'precipitation'],
    wind: ['weather', 'air', 'breeze', 'movement'],
    
    // Transportation
    car: ['vehicle', 'transport', 'drive', 'automobile'],
    plane: ['flight', 'travel', 'airport', 'aviation'],
    train: ['railway', 'transport', 'station', 'locomotive'],
    bike: ['bicycle', 'cycling', 'exercise', 'ride'],
    ship: ['boat', 'ocean', 'water', 'maritime'],
    
    // Shopping & Commerce
    shopping: ['buy', 'purchase', 'store', 'retail'],
    cart: ['shopping', 'basket', 'buy', 'ecommerce'],
    bag: ['shopping', 'carry', 'purchase', 'store'],
    credit: ['payment', 'money', 'finance', 'card'],
    dollar: ['money', 'currency', 'price', 'cost'],
    gift: ['present', 'surprise', 'celebration', 'giving'],
    
    // Health & Medical
    activity: ['health', 'fitness', 'heartbeat', 'exercise'],
    pill: ['medicine', 'medication', 'health', 'drug'],
    thermometer: ['temperature', 'fever', 'health', 'measure'],
    stethoscope: ['medical', 'doctor', 'health', 'diagnosis'],
    
    // Education & Learning
    book: ['read', 'education', 'knowledge', 'study'],
    graduation: ['education', 'university', 'degree', 'achievement'],
    bookmark: ['save', 'mark', 'favorite', 'reference'],
    pencil: ['write', 'draw', 'edit', 'school'],
    
    // Business & Work
    briefcase: ['business', 'work', 'professional', 'office'],
    building: ['office', 'business', 'company', 'structure'],
    chart: ['analytics', 'data', 'statistics', 'graph'],
    trending: ['analytics', 'growth', 'statistics', 'chart'],
    
    // Gaming & Entertainment
    gamepad: ['gaming', 'controller', 'play', 'console'],
    dice: ['gaming', 'random', 'chance', 'game'],
    trophy: ['award', 'achievement', 'winner', 'prize'],
    
    // Tools & Construction
    hammer: ['tool', 'construction', 'build', 'repair'],
    wrench: ['tool', 'repair', 'fix', 'maintenance'],
    screwdriver: ['tool', 'repair', 'construction', 'fix'],
    
    // Maps & Location
    map: ['location', 'navigation', 'geography', 'travel'],
    compass: ['direction', 'navigation', 'orientation', 'travel'],
    globe: ['world', 'earth', 'international', 'global'],
    
    // Home & Furniture
    home: ['house', 'building', 'residence', 'main'],
    door: ['entrance', 'exit', 'access', 'portal'],
    window: ['view', 'opening', 'glass', 'light'],
    bed: ['sleep', 'rest', 'furniture', 'bedroom'],
    
    // Food & Dining
    coffee: ['drink', 'beverage', 'cafe', 'morning'],
    pizza: ['food', 'italian', 'meal', 'dinner'],
    cake: ['dessert', 'celebration', 'birthday', 'sweet'],
    utensils: ['food', 'dining', 'eating', 'cutlery'],
    
    // Media & Entertainment
    video: ['media', 'movie', 'film', 'recording'],
    image: ['photo', 'picture', 'graphic', 'visual'],
    music: ['audio', 'sound', 'song', 'melody'],
    
    // Accessibility & Support
    accessibility: ['a11y', 'access', 'support', 'inclusive'],
    
    // Air & Ventilation
    air: ['ventilation', 'breath', 'atmosphere', 'oxygen'],
    vent: ['ventilation', 'airflow', 'circulation', 'hvac'],
    
    // Collections & Albums
    album: ['collection', 'gallery', 'photos', 'music']
  };
  
  // Add semantic keywords based on exact word matches first
  nameWords.forEach(word => {
    if (semanticMap[word]) {
      semanticMap[word].forEach(keyword => keywords.add(keyword));
    }
  });
  
  // Add semantic keywords based on partial matches
  nameWords.forEach(word => {
    Object.keys(semanticMap).forEach(key => {
      // Only match if the word contains the key or vice versa (but not too loose)
      if (word.length > 2 && key.length > 2) {
        if (word.includes(key) && word !== key) {
          semanticMap[key].forEach(keyword => keywords.add(keyword));
        }
        if (key.includes(word) && key !== word) {
          semanticMap[key].forEach(keyword => keywords.add(keyword));
        }
      }
    });
  });
  
  // Add contextual keywords based on common patterns
  nameWords.forEach(word => {
    // State and direction keywords
    if (['up', 'down', 'left', 'right'].includes(word)) {
      ['direction', 'movement', 'orientation'].forEach(k => keywords.add(k));
    }
    if (['open', 'close', 'closed'].includes(word)) {
      ['state', 'toggle', 'visibility'].forEach(k => keywords.add(k));
    }
    if (['on', 'off', 'enabled', 'disabled'].includes(word)) {
      ['state', 'toggle', 'control'].forEach(k => keywords.add(k));
    }
    if (['big', 'small', 'large', 'mini', 'tiny'].includes(word)) {
      ['size', 'scale', 'dimension'].forEach(k => keywords.add(k));
    }
    if (['fast', 'slow', 'quick', 'speed'].includes(word)) {
      ['performance', 'velocity', 'tempo'].forEach(k => keywords.add(k));
    }
    
    // Color and appearance
    if (['color', 'paint', 'brush', 'palette'].includes(word)) {
      ['design', 'art', 'creative', 'visual'].forEach(k => keywords.add(k));
    }
    
    // Numbers and counting
    if (['one', 'two', 'three', 'first', 'second', 'last'].includes(word) || /^\d+$/.test(word)) {
      ['number', 'count', 'order', 'sequence'].forEach(k => keywords.add(k));
    }
  });
  
  // Add category-based keywords based on full icon name patterns
  if (kebabName.includes('arrow') || kebabName.includes('chevron')) {
    ['navigation', 'direction', 'ui', 'interface'].forEach(k => keywords.add(k));
  }
  if (kebabName.includes('circle') || kebabName.includes('square') || kebabName.includes('triangle')) {
    ['shape', 'geometric', 'form', 'basic'].forEach(k => keywords.add(k));
  }
  if (kebabName.includes('alert') || kebabName.includes('warning') || kebabName.includes('danger')) {
    ['notification', 'attention', 'important', 'status'].forEach(k => keywords.add(k));
  }
  if (kebabName.includes('wifi') || kebabName.includes('signal') || kebabName.includes('network')) {
    ['connection', 'internet', 'communication', 'wireless'].forEach(k => keywords.add(k));
  }
  
  // Ensure every icon has at least some basic keywords
  if (keywords.size <= nameWords.length) {
    // Add general UI/interface keywords for icons that don't match patterns
    ['ui', 'interface', 'icon', 'design'].forEach(k => keywords.add(k));
    
    // Add keywords based on common icon categories
    if (kebabName.includes('text') || kebabName.includes('font') || kebabName.includes('type')) {
      ['typography', 'text', 'content'].forEach(k => keywords.add(k));
    }
    if (kebabName.includes('layout') || kebabName.includes('grid') || kebabName.includes('columns')) {
      ['layout', 'design', 'structure'].forEach(k => keywords.add(k));
    }
  }
  
  // Convert Set to Array and filter appropriately
  const result = Array.from(keywords).filter(keyword => 
    keyword.length > 1 // Keep all meaningful keywords
  ).sort();
  
  // Ensure we always have at least 3 keywords
  if (result.length < 3) {
    result.push('ui', 'interface', 'design');
  }
  
  return result;
}

const allIcons = {};
let processedCount = 0;
let errorCount = 0;

// Function to convert Lucide icon data to SVG string
function lucideToSvg(iconData) {
  if (!Array.isArray(iconData) || iconData.length === 0) return null;
  
  // New Lucide format: direct array of elements like [['path', {d: '...'}], ['circle', {cx: '...'}]]
  // We need to wrap these in an SVG element
  
  // Convert children to SVG elements (preserve original positioning)
  function renderChildren(children) {
    if (!Array.isArray(children)) return '';
    
    return children.map(child => {
      if (Array.isArray(child) && child.length >= 2) {
        const [childTag, childAttrs, childChildren] = child;
        
        // Convert attributes object to string - preserve all original attributes
        const attrString = Object.entries(childAttrs || {})
          .map(([key, value]) => `${key}="${value}"`)
          .join(' ');
        
        if (childChildren && Array.isArray(childChildren)) {
          return `<${childTag} ${attrString}>${renderChildren(childChildren)}</${childTag}>`;
        } else {
          return `<${childTag} ${attrString}/>`;
        }
      }
      return '';
    }).join('');
  }
  
  // Create standard SVG wrapper with Lucide's default attributes
  const svgAttributes = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  };
  
  const attrString = Object.entries(svgAttributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
  
  // Return SVG with original structure and positioning preserved
  return `<svg ${attrString}>${renderChildren(iconData)}</svg>`;
}

// Get all keys from lucide
const allKeys = Object.keys(lucide);
console.log(`Total lucide exports: ${allKeys.length}`);

// Filter for actual icon data (now direct arrays instead of SVG-wrapped)
const iconNames = allKeys.filter(key => {
  const value = lucide[key];
  return Array.isArray(value) && 
         value.length > 0 && 
         Array.isArray(value[0]) && // Each element should be an array like ['path', {...}]
         key !== 'icons' &&
         key !== 'default';
});

console.log(`Found ${iconNames.length} potential Lucide icons:`, iconNames.slice(0, 10));

// Process all icons with enhanced semantic keywords (no GitHub API)
function processAllIcons() {
  console.log('Processing all icons with enhanced semantic keywords...');
  
  for (let i = 0; i < iconNames.length; i++) {
    const iconName = iconNames[i];
    
    try {
      const iconData = lucide[iconName];
      const svgString = lucideToSvg(iconData);
      
      if (svgString) {
        // Convert PascalCase to kebab-case for consistency
        const kebabName = iconName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
        
        // Use enhanced semantic keywords
        const keywords = getIconKeywords(iconName);
        
        // Create description
        const description = `${kebabName} icon from Lucide`;
        
        allIcons[kebabName] = {
          name: kebabName,
          svg: svgString,
          keywords: keywords,
          categories: [],
          description: description,
          hasOfficialTags: false,
          // Preserve original positioning - don't force centering in Figma
          preservePositioning: true,
          // Store original viewBox for reference (now standardized)
          originalViewBox: '0 0 24 24'
        };
        
        processedCount++;
        
        // Progress update every 200 icons
        if (processedCount % 200 === 0) {
          console.log(`Processed ${processedCount}/${iconNames.length} icons...`);
        }
      }
    } catch (error) {
      console.warn(`Failed to process icon ${iconName}:`, error.message);
      errorCount++;
    }
  }
}

// Run the processing
processAllIcons();

console.log(`Successfully processed ${processedCount} icons`);
console.log(`Errors: ${errorCount}`);

// All icons use enhanced semantic tags
const iconsWithOfficialTags = 0;
const iconsWithSemanticTags = processedCount;

console.log(`Icons with official Lucide tags: ${iconsWithOfficialTags}`);
console.log(`Icons using enhanced semantic tags: ${iconsWithSemanticTags}`);
console.log(`Note: Positioning preserved from original Lucide SVGs`);

// Generate TypeScript content
const tsContent = `// Auto-generated Lucide icons data for Figma plugin
// Generated on ${new Date().toISOString()}
// Total icons: ${processedCount}
// Icons with official tags: ${iconsWithOfficialTags}
// Icons with semantic tags: ${iconsWithSemanticTags}
// Note: Original positioning preserved

export const LUCIDE_ICONS_DATA = ${JSON.stringify(allIcons, null, 2)};
`;

// Generate JSON content for require() import
const jsonContent = JSON.stringify(allIcons, null, 2);

// Write to TypeScript file
const tsOutputPath = path.join(__dirname, '../src/lucide-icons-data.ts');
fs.writeFileSync(tsOutputPath, tsContent);

// Write to JSON file
const jsonOutputPath = path.join(__dirname, '../src/icons.json');
fs.writeFileSync(jsonOutputPath, jsonContent);

console.log(`Generated ${tsOutputPath} with ${processedCount} icons`);
console.log(`Generated ${jsonOutputPath} with ${processedCount} icons`);
console.log(`TS file size: ${(fs.statSync(tsOutputPath).size / 1024 / 1024).toFixed(2)} MB`);
console.log(`JSON file size: ${(fs.statSync(jsonOutputPath).size / 1024 / 1024).toFixed(2)} MB`);
