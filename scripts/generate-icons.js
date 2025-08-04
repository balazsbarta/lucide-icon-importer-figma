// Script to generate the complete Lucide icons data for the Figma plugin
const fs = require('fs');
const path = require('path');

// Import the lucide library
const lucide = require('lucide');

console.log('Generating Lucide icons data...');

// Function to get official Lucide metadata for an icon
function getOfficialLucideMetadata(iconName) {
  try {
    // Convert PascalCase to kebab-case for file lookup
    const kebabName = iconName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
    
    // Try to read the official metadata file from lucide package
    const metadataPath = path.join(__dirname, '../node_modules/lucide/icons', `${kebabName}.json`);
    
    if (fs.existsSync(metadataPath)) {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      return {
        tags: metadata.tags || [],
        categories: metadata.categories || []
      };
    }
  } catch (error) {
    console.warn(`Could not load metadata for ${iconName}:`, error.message);
  }
  
  return { tags: [], categories: [] };
}

const allIcons = {};
let processedCount = 0;
let errorCount = 0;

// Function to convert Lucide icon data to SVG string
function lucideToSvg(iconData) {
  if (!Array.isArray(iconData) || iconData.length < 3) return null;
  
  const [tagName, attributes, children] = iconData;
  if (tagName !== 'svg') return null;
  
  // Convert children to SVG elements (keep original structure)
  function renderChildren(children) {
    if (!Array.isArray(children)) return '';
    
    return children.map(child => {
      if (Array.isArray(child) && child.length >= 2) {
        const [childTag, childAttrs, childChildren] = child;
        
        // Convert attributes object to string
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
  
  // Convert attributes to string
  const attrString = Object.entries(attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
  
  // Return SVG with original structure (let Figma handle flattening)
  return `<svg ${attrString}>${renderChildren(children)}</svg>`;
}

// Function to get keywords for an icon using enhanced semantic analysis
function getIconKeywords(iconName) {
  // Convert PascalCase to kebab-case for analysis
  const kebabName = iconName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
  const nameWords = kebabName.split('-');
  
  // Enhanced keyword mapping based on Lucide/Feather design principles
  const keywordMap = {
    // Food & Dining
    'cake': ['birthday', 'celebration', 'dessert', 'party', 'sweet', 'food', 'treat', 'anniversary', 'festive', 'bakery', 'slice'],
    'pizza': ['food', 'italian', 'slice', 'restaurant', 'meal', 'dinner', 'cheese', 'delivery', 'fast-food'],
    'coffee': ['drink', 'beverage', 'cafe', 'morning', 'espresso', 'cup', 'hot', 'caffeine', 'break'],
    'wine': ['alcohol', 'drink', 'beverage', 'glass', 'restaurant', 'celebration', 'grape', 'bottle'],
    'beer': ['alcohol', 'drink', 'beverage', 'pub', 'bar', 'bottle', 'glass', 'celebration'],
    'utensils': ['food', 'dining', 'restaurant', 'eating', 'cutlery', 'knife', 'fork', 'meal'],
    'chef-hat': ['cooking', 'chef', 'kitchen', 'restaurant', 'culinary', 'food', 'professional'],
    
    // Navigation & Arrows
    'home': ['house', 'building', 'residence', 'start', 'main', 'dashboard', 'homepage'],
    'arrow-up': ['top', 'increase', 'north', 'ascend', 'rise', 'upward', 'above', 'direction'],
    'arrow-down': ['bottom', 'decrease', 'south', 'descend', 'fall', 'downward', 'below', 'direction'],
    'arrow-left': ['back', 'previous', 'west', 'return', 'undo', 'leftward', 'reverse', 'direction'],
    'arrow-right': ['forward', 'next', 'east', 'continue', 'proceed', 'rightward', 'advance', 'direction'],
    'chevron-up': ['collapse', 'up', 'expand', 'accordion', 'dropdown', 'direction'],
    'chevron-down': ['expand', 'down', 'collapse', 'accordion', 'dropdown', 'direction'],
    'chevron-left': ['previous', 'back', 'left', 'navigation', 'direction'],
    'chevron-right': ['next', 'forward', 'right', 'navigation', 'direction'],
    
    // Communication & Social
    'heart': ['love', 'like', 'favorite', 'health', 'romance', 'bookmark', 'care', 'affection'],
    'star': ['favorite', 'rating', 'bookmark', 'important', 'quality', 'award', 'premium', 'featured'],
    'message-circle': ['chat', 'communication', 'conversation', 'talk', 'discuss', 'feedback'],
    'mail': ['email', 'message', 'envelope', 'letter', 'communication', 'inbox', 'send', 'contact'],
    'phone': ['call', 'telephone', 'contact', 'mobile', 'device', 'communication', 'dial'],
    'users': ['people', 'team', 'group', 'community', 'social', 'crowd', 'audience'],
    'user': ['person', 'account', 'profile', 'avatar', 'member', 'customer', 'individual'],
    'thumbs-up': ['like', 'approve', 'good', 'positive', 'recommend', 'agree', 'success'],
    'thumbs-down': ['dislike', 'disapprove', 'bad', 'negative', 'disagree', 'reject'],
    
    // Technology & Digital
    'search': ['find', 'magnify', 'lookup', 'seek', 'explore', 'discover', 'filter', 'query'],
    'settings': ['config', 'gear', 'preferences', 'options', 'tools', 'admin', 'control'],
    'wifi': ['internet', 'connection', 'network', 'wireless', 'signal', 'connectivity', 'online'],
    'battery': ['power', 'energy', 'charge', 'electricity', 'device', 'fuel', 'level'],
    'smartphone': ['mobile', 'phone', 'device', 'cellular', 'app', 'technology'],
    'laptop': ['computer', 'notebook', 'device', 'work', 'technology', 'portable'],
    'monitor': ['screen', 'display', 'computer', 'desktop', 'television', 'viewing'],
    'database': ['data', 'storage', 'server', 'information', 'records', 'archive'],
    'cloud': ['weather', 'sky', 'storage', 'data', 'online', 'overcast', 'computing', 'backup'],
    
    // Media & Entertainment
    'play': ['start', 'begin', 'media', 'video', 'audio', 'music', 'entertainment'],
    'pause': ['stop', 'halt', 'media', 'break', 'suspend', 'freeze'],
    'volume': ['audio', 'sound', 'speaker', 'music', 'noise', 'level'],
    'camera': ['photo', 'picture', 'photography', 'capture', 'snapshot', 'image', 'lens', 'media'],
    'video': ['movie', 'film', 'recording', 'media', 'play', 'streaming', 'cinema'],
    'music': ['audio', 'sound', 'song', 'melody', 'tune', 'player', 'entertainment'],
    'headphones': ['audio', 'music', 'sound', 'listening', 'earphones', 'device'],
    'radio': ['broadcast', 'audio', 'music', 'listening', 'station', 'wireless'],
    
    // Files & Organization
    'file': ['document', 'paper', 'record', 'data', 'text', 'attachment', 'storage'],
    'folder': ['directory', 'collection', 'group', 'organize', 'container', 'archive', 'category'],
    'image': ['photo', 'picture', 'graphic', 'visual', 'media', 'illustration', 'artwork'],
    'download': ['save', 'import', 'get', 'receive', 'fetch', 'install', 'transfer'],
    'upload': ['send', 'export', 'share', 'transfer', 'publish', 'submit', 'post'],
    'trash': ['delete', 'remove', 'garbage', 'waste', 'discard', 'bin', 'destroy'],
    'archive': ['storage', 'backup', 'compress', 'organize', 'save', 'preserve'],
    
    // Actions & Interface
    'edit': ['modify', 'change', 'update', 'write', 'pencil', 'customize', 'alter'],
    'plus': ['add', 'create', 'new', 'increase', 'positive', 'expand', 'insert'],
    'minus': ['subtract', 'remove', 'decrease', 'negative', 'less', 'reduce', 'delete'],
    'check': ['confirm', 'approve', 'done', 'complete', 'verified', 'success', 'valid', 'tick'],
    'x': ['close', 'cancel', 'exit', 'remove', 'delete', 'dismiss', 'error', 'cross'],
    'copy': ['duplicate', 'clone', 'replicate', 'reproduction', 'backup'],
    'cut': ['remove', 'delete', 'slice', 'trim', 'separate'],
    'paste': ['insert', 'place', 'add', 'attach', 'apply'],
    
    // Security & Privacy
    'lock': ['secure', 'private', 'protected', 'safety', 'closed', 'encrypted', 'restricted'],
    'unlock': ['open', 'access', 'available', 'public', 'free', 'unrestricted', 'accessible'],
    'eye': ['view', 'see', 'visible', 'watch', 'observe', 'preview', 'visibility'],
    'eye-off': ['hide', 'invisible', 'private', 'secret', 'hidden', 'concealed', 'blind'],
    'shield': ['protection', 'security', 'defense', 'safety', 'guard', 'firewall'],
    'key': ['password', 'access', 'unlock', 'security', 'login', 'authentication'],
    
    // Time & Calendar
    'calendar': ['date', 'schedule', 'time', 'event', 'appointment', 'planning', 'organize'],
    'clock': ['time', 'hour', 'minute', 'watch', 'timer', 'schedule', 'duration'],
    'alarm-clock': ['wake', 'alert', 'reminder', 'time', 'morning', 'notification'],
    'stopwatch': ['timer', 'measure', 'time', 'duration', 'sport', 'racing'],
    
    // Weather & Nature
    'sun': ['light', 'day', 'bright', 'weather', 'solar', 'sunshine', 'morning', 'warm'],
    'moon': ['night', 'dark', 'lunar', 'sleep', 'evening', 'crescent', 'nighttime'],
    'star': ['night', 'space', 'astronomy', 'celestial', 'bright', 'twinkle'],
    'umbrella': ['rain', 'weather', 'protection', 'cover', 'shield', 'shelter', 'safety'],
    'tree': ['nature', 'plant', 'forest', 'environment', 'green', 'growth', 'wood'],
    'flower': ['nature', 'plant', 'garden', 'beautiful', 'bloom', 'petal', 'spring'],
    
    // Transportation
    'car': ['vehicle', 'transport', 'drive', 'automobile', 'travel', 'road', 'transportation', 'motor'],
    'plane': ['flight', 'travel', 'airport', 'aviation', 'transportation', 'journey', 'aircraft', 'fly'],
    'train': ['railway', 'transport', 'travel', 'locomotive', 'station', 'track'],
    'bike': ['bicycle', 'cycling', 'transport', 'exercise', 'sport', 'pedal', 'ride'],
    'ship': ['boat', 'ocean', 'water', 'transport', 'sailing', 'maritime', 'vessel'],
    
    // Shopping & Commerce
    'shopping-cart': ['store', 'buy', 'purchase', 'ecommerce', 'retail', 'basket', 'checkout', 'commerce'],
    'shopping-bag': ['store', 'purchase', 'retail', 'bag', 'shopping', 'carry', 'buy'],
    'credit-card': ['payment', 'money', 'finance', 'purchase', 'banking', 'transaction'],
    'dollar-sign': ['money', 'currency', 'price', 'cost', 'finance', 'payment', 'cash'],
    'gift': ['present', 'surprise', 'birthday', 'celebration', 'holiday', 'package', 'reward', 'giving'],
    
    // Health & Medical
    'heart': ['health', 'medical', 'cardiology', 'life', 'vital', 'pulse', 'healthcare'],
    'activity': ['health', 'fitness', 'exercise', 'heartbeat', 'vital', 'monitor'],
    'pill': ['medicine', 'drug', 'medication', 'health', 'pharmacy', 'treatment'],
    'thermometer': ['temperature', 'fever', 'health', 'medical', 'measure', 'heat'],
    
    // Education & Learning
    'book': ['read', 'literature', 'education', 'knowledge', 'study', 'novel', 'library', 'learning'],
    'graduation-cap': ['education', 'university', 'degree', 'learning', 'student', 'achievement'],
    'bookmark': ['save', 'mark', 'remember', 'favorite', 'reference', 'note'],
    'pencil': ['write', 'edit', 'draw', 'sketch', 'note', 'school', 'creative'],
    
    // Alerts & Status
    'alert-triangle': ['warning', 'caution', 'danger', 'attention', 'error', 'important'],
    'info': ['information', 'details', 'help', 'about', 'question', 'explain'],
    'check-circle': ['success', 'complete', 'done', 'approved', 'verified', 'confirmed'],
    'x-circle': ['error', 'failed', 'cancel', 'remove', 'delete', 'wrong'],
    'bell': ['notification', 'alert', 'reminder', 'alarm', 'ring', 'sound']
  };
  
  // Start with base keywords from the icon name
  let keywords = [...nameWords];
  
  // Add exact match keywords if available
  if (keywordMap[kebabName]) {
    keywords = [...keywords, ...keywordMap[kebabName]];
  }
  
  // Add semantic keywords based on word patterns
  nameWords.forEach(word => {
    // Direction and movement
    if (['arrow', 'chevron', 'triangle'].includes(word)) {
      keywords.push('direction', 'navigation', 'pointer');
    }
    if (['up', 'down', 'left', 'right'].includes(word)) {
      keywords.push('direction', 'movement');
    }
    
    // Shapes and geometry
    if (['circle', 'square', 'triangle', 'diamond'].includes(word)) {
      keywords.push('shape', 'geometric', 'form');
    }
    
    // Actions and states
    if (['check', 'verified', 'confirm'].includes(word)) {
      keywords.push('success', 'valid', 'approved');
    }
    if (['alert', 'warning', 'danger'].includes(word)) {
      keywords.push('attention', 'caution', 'important');
    }
    if (['play', 'pause', 'stop'].includes(word)) {
      keywords.push('media', 'control', 'player');
    }
    
    // Technology patterns
    if (['wifi', 'signal', 'network'].includes(word)) {
      keywords.push('connection', 'internet', 'wireless');
    }
    if (['battery', 'power', 'energy'].includes(word)) {
      keywords.push('electricity', 'charge', 'device');
    }
    if (['volume', 'sound', 'audio'].includes(word)) {
      keywords.push('music', 'speaker', 'hearing');
    }
    
    // File and data
    if (['file', 'document', 'folder'].includes(word)) {
      keywords.push('storage', 'data', 'organize');
    }
    if (['download', 'upload', 'cloud'].includes(word)) {
      keywords.push('transfer', 'sync', 'backup');
    }
    
    // Communication
    if (['message', 'mail', 'chat'].includes(word)) {
      keywords.push('communication', 'contact', 'social');
    }
    if (['phone', 'call', 'mobile'].includes(word)) {
      keywords.push('device', 'communication', 'contact');
    }
    
    // Time and scheduling
    if (['calendar', 'clock', 'time'].includes(word)) {
      keywords.push('schedule', 'appointment', 'date');
    }
    
    // User and social
    if (['user', 'users', 'person'].includes(word)) {
      keywords.push('account', 'profile', 'people');
    }
    if (['heart', 'like', 'favorite'].includes(word)) {
      keywords.push('love', 'preference', 'bookmark');
    }
    
    // Security and privacy
    if (['lock', 'unlock', 'key'].includes(word)) {
      keywords.push('security', 'access', 'protection');
    }
    if (['eye', 'visible', 'hidden'].includes(word)) {
      keywords.push('visibility', 'privacy', 'view');
    }
  });
  
  // Remove duplicates and return
  return [...new Set(keywords)].filter(keyword => keyword.length > 1);
}

// Get all keys from lucide
const allKeys = Object.keys(lucide);
console.log(`Total lucide exports: ${allKeys.length}`);

// Filter for actual icon data (arrays starting with 'svg')
const iconNames = allKeys.filter(key => {
  const value = lucide[key];
  return Array.isArray(value) && 
         value.length >= 3 && 
         value[0] === 'svg' &&
         key !== 'icons' &&
         key !== 'default';
});

console.log(`Found ${iconNames.length} potential Lucide icons:`, iconNames.slice(0, 10));

for (const iconName of iconNames) {
  try {
    const iconData = lucide[iconName];
    const svgString = lucideToSvg(iconData);
    
    if (svgString) {
      // Convert PascalCase to kebab-case for consistency
      const kebabName = iconName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
      
      allIcons[kebabName] = {
        name: kebabName,
        svg: svgString,
        keywords: getIconKeywords(iconName),
        categories: []
      };
      
      processedCount++;
    }
  } catch (error) {
    console.warn(`Failed to process icon ${iconName}:`, error.message);
    errorCount++;
  }
}

console.log(`Successfully processed ${processedCount} icons`);
console.log(`Errors: ${errorCount}`);

// Generate TypeScript content
const tsContent = `// Auto-generated Lucide icons data for Figma plugin
// Generated on ${new Date().toISOString()}
// Total icons: ${processedCount}

export const LUCIDE_ICONS_DATA = ${JSON.stringify(allIcons, null, 2)};
`;

// Write to TypeScript file
const outputPath = path.join(__dirname, '../src/lucide-icons-data.ts');
fs.writeFileSync(outputPath, tsContent);

console.log(`Generated ${outputPath} with ${processedCount} icons`);
console.log(`File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
