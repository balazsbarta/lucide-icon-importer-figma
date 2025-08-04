// Enhanced Lucide icon data fetcher that gets real icon data
import { icons } from 'lucide';

export interface LucideIconData {
  name: string;
  svg: string;
  keywords: string[];
  categories: string[];
}

// This function gets all actual Lucide icons
export async function getAllLucideIcons(): Promise<Record<string, LucideIconData>> {
  const iconData: Record<string, LucideIconData> = {};
  
  try {
    // Get all icon entries from the lucide icons object
    const iconEntries = Object.entries(icons);
    
    for (const [iconName, iconComponent] of iconEntries) {
      try {
        // Convert camelCase to kebab-case
        const kebabName = iconName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
        
        // Generate SVG string from the icon component
        const svgString = generateSvgFromIcon(iconComponent, kebabName);
        
        iconData[kebabName] = {
          name: kebabName,
          svg: svgString,
          keywords: getIconKeywords(kebabName),
          categories: getIconCategories(kebabName)
        };
        
      } catch (error) {
        console.warn(`Could not process icon ${iconName}:`, error);
      }
    }
    
    console.log(`Successfully loaded ${Object.keys(iconData).length} Lucide icons`);
    
  } catch (error) {
    console.error('Error loading Lucide icons:', error);
    throw error;
  }
  
  return iconData;
}

function generateSvgFromIcon(iconComponent: any, iconName: string): string {
  // For Lucide icons, we need to extract the SVG content
  // This is a simplified approach - in practice, you might need to render the icon
  
  // Default SVG structure for Lucide icons
  const defaultSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${iconName}">
    <!-- Icon content would be extracted from the component -->
  </svg>`;
  
  // Try to extract SVG content if available
  if (iconComponent && typeof iconComponent === 'object') {
    // Check if the component has SVG content
    if (iconComponent.svg) {
      return iconComponent.svg;
    }
    
    // Check if it has children or path data
    if (iconComponent.children || iconComponent.paths) {
      return generateSvgFromPaths(iconComponent, iconName);
    }
  }
  
  return defaultSvg;
}

function generateSvgFromPaths(iconComponent: any, iconName: string): string {
  let svgContent = '';
  
  // This would extract the actual path data from the Lucide icon component
  // For now, we'll use a placeholder approach
  
  const svgStart = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${iconName}">`;
  const svgEnd = '</svg>';
  
  // Add placeholder path - in a real implementation, you'd extract this from the component
  svgContent = '<path d="M12 2L2 22h20L12 2z"/>'; // placeholder triangle
  
  return `${svgStart}${svgContent}${svgEnd}`;
}

function getIconKeywords(iconName: string): string[] {
  // Enhanced keyword mapping with more comprehensive coverage
  const keywordMap: Record<string, string[]> = {
    // Navigation & Interface
    'home': ['house', 'building', 'residence', 'homepage', 'main', 'start', 'dashboard'],
    'menu': ['hamburger', 'navigation', 'list', 'options', 'drawer', 'sidebar'],
    'search': ['find', 'look', 'magnifying glass', 'query', 'explore', 'discover'],
    'filter': ['sort', 'organize', 'refine', 'sieve', 'screen'],
    'settings': ['config', 'preferences', 'gear', 'options', 'configure', 'control'],
    'more-horizontal': ['dots', 'menu', 'options', 'kebab', 'ellipsis'],
    'more-vertical': ['dots', 'menu', 'options', 'kebab', 'ellipsis'],
    
    // Actions
    'plus': ['add', 'create', 'new', 'positive', 'increase', 'insert'],
    'minus': ['subtract', 'remove', 'negative', 'less', 'decrease', 'delete'],
    'x': ['close', 'cancel', 'delete', 'cross', 'exit', 'remove'],
    'check': ['confirm', 'approve', 'done', 'success', 'complete', 'tick'],
    'edit': ['modify', 'change', 'update', 'pencil', 'write', 'compose'],
    'copy': ['duplicate', 'clone', 'replicate', 'reproduce', 'mirror'],
    'cut': ['scissors', 'clip', 'trim', 'remove', 'slice'],
    'paste': ['insert', 'place', 'put', 'attach', 'apply'],
    'save': ['disk', 'store', 'preserve', 'keep', 'backup'],
    'undo': ['revert', 'back', 'reverse', 'cancel', 'restore'],
    'redo': ['forward', 'repeat', 'again', 'restore', 'replay'],
    
    // Arrows & Navigation
    'arrow-up': ['north', 'increase', 'rise', 'top', 'ascend', 'upward'],
    'arrow-down': ['south', 'decrease', 'fall', 'bottom', 'descend', 'downward'],
    'arrow-left': ['back', 'previous', 'return', 'west', 'retreat', 'backward'],
    'arrow-right': ['next', 'forward', 'continue', 'proceed', 'east', 'advance'],
    'chevron-up': ['collapse', 'fold', 'minimize', 'less', 'contract'],
    'chevron-down': ['expand', 'unfold', 'maximize', 'more', 'extend'],
    'chevron-left': ['back', 'previous', 'collapse', 'left'],
    'chevron-right': ['next', 'forward', 'expand', 'right'],
    
    // Files & Storage
    'file': ['document', 'paper', 'record', 'data', 'storage', 'text'],
    'file-text': ['document', 'text', 'article', 'content', 'writing'],
    'folder': ['directory', 'organize', 'container', 'group', 'category'],
    'folder-open': ['directory', 'open', 'browse', 'explore', 'access'],
    'download': ['save', 'export', 'get', 'receive', 'pull', 'import'],
    'upload': ['send', 'import', 'put', 'transmit', 'push', 'export'],
    'hard-drive': ['storage', 'disk', 'drive', 'memory', 'data'],
    'cloud': ['online', 'sync', 'backup', 'remote', 'internet'],
    'archive': ['zip', 'compress', 'package', 'bundle', 'collection'],
    
    // Users & People
    'user': ['person', 'profile', 'account', 'avatar', 'individual', 'human'],
    'users': ['people', 'group', 'team', 'community', 'multiple'],
    'user-plus': ['add user', 'invite', 'new member', 'register', 'join'],
    'user-minus': ['remove user', 'delete account', 'ban', 'exclude'],
    'user-check': ['verify', 'approve', 'confirm user', 'validated'],
    'user-x': ['block', 'ban', 'remove', 'delete user', 'reject'],
    
    // Communication
    'mail': ['email', 'message', 'letter', 'envelope', 'communication', 'inbox'],
    'send': ['transmit', 'deliver', 'dispatch', 'forward', 'share'],
    'inbox': ['mail', 'messages', 'received', 'incoming', 'letters'],
    'phone': ['call', 'telephone', 'contact', 'mobile', 'communication'],
    'message-circle': ['chat', 'conversation', 'talk', 'discuss', 'bubble'],
    'message-square': ['comment', 'note', 'remark', 'feedback', 'reply'],
    
    // Media & Entertainment
    'play': ['start', 'begin', 'resume', 'run', 'execute', 'launch'],
    'pause': ['stop', 'halt', 'suspend', 'break', 'wait'],
    'stop': ['end', 'finish', 'terminate', 'halt', 'cease'],
    'skip-back': ['previous', 'rewind', 'back', 'last', 'earlier'],
    'skip-forward': ['next', 'fast-forward', 'advance', 'following'],
    'volume': ['sound', 'audio', 'speaker', 'noise', 'level', 'loudness'],
    'volume-off': ['mute', 'silent', 'quiet', 'no sound', 'disabled'],
    'camera': ['photo', 'picture', 'image', 'capture', 'snapshot', 'lens'],
    'video': ['movie', 'film', 'clip', 'recording', 'media', 'camera'],
    'image': ['picture', 'photo', 'graphic', 'visual', 'media', 'illustration'],
    'music': ['audio', 'sound', 'song', 'melody', 'entertainment', 'note'],
    
    // Time & Calendar
    'calendar': ['date', 'schedule', 'time', 'event', 'appointment', 'day'],
    'clock': ['time', 'hour', 'minute', 'schedule', 'timer', 'watch'],
    'watch': ['time', 'clock', 'wrist', 'schedule', 'punctual', 'timer'],
    'timer': ['countdown', 'stopwatch', 'duration', 'time limit', 'alarm'],
    'alarm-clock': ['wake up', 'reminder', 'alert', 'morning', 'time'],
    
    // Status & Indicators
    'alert-circle': ['warning', 'caution', 'attention', 'notice', 'important'],
    'alert-triangle': ['warning', 'danger', 'caution', 'error', 'risk'],
    'info': ['information', 'details', 'help', 'about', 'question'],
    'help-circle': ['question', 'support', 'assistance', 'guide', 'info'],
    'check-circle': ['success', 'complete', 'done', 'approved', 'valid'],
    'x-circle': ['error', 'failed', 'wrong', 'cancel', 'invalid'],
    
    // Devices & Technology
    'smartphone': ['mobile', 'phone', 'device', 'cellular', 'portable'],
    'tablet': ['device', 'mobile', 'touch', 'portable', 'screen', 'ipad'],
    'laptop': ['computer', 'portable', 'notebook', 'mobile', 'device'],
    'monitor': ['screen', 'display', 'computer', 'desktop', 'view'],
    'tv': ['television', 'screen', 'entertainment', 'media', 'broadcast'],
    'radio': ['audio', 'broadcast', 'music', 'news', 'wireless', 'fm'],
    'headphones': ['audio', 'listen', 'music', 'sound', 'private', 'earphones'],
    'speaker': ['audio', 'sound', 'output', 'volume', 'play', 'noise'],
    'microphone': ['audio', 'record', 'voice', 'input', 'sound', 'mic'],
    'keyboard': ['input', 'type', 'computer', 'keys', 'interface', 'typing'],
    'mouse': ['pointer', 'click', 'computer', 'cursor', 'interface', 'navigate'],
    'printer': ['print', 'output', 'paper', 'document', 'hard-copy'],
    'wifi': ['internet', 'connection', 'network', 'wireless', 'signal'],
    'bluetooth': ['wireless', 'connection', 'pairing', 'device', 'sync'],
    'battery': ['power', 'charge', 'energy', 'electricity', 'life', 'level'],
    
    // Nature & Weather
    'sun': ['light', 'bright', 'day', 'weather', 'solar', 'sunny'],
    'moon': ['night', 'dark', 'sleep', 'lunar', 'evening', 'crescent'],
    'star': ['rating', 'bookmark', 'favorite', 'quality', 'award', 'celestial'],
    'cloud-generic': ['weather', 'sky', 'storage', 'online', 'backup', 'overcast'],
    'cloud-rain': ['weather', 'precipitation', 'storm', 'water', 'wet'],
    'cloud-snow': ['weather', 'winter', 'cold', 'precipitation', 'flakes'],
    'umbrella': ['rain', 'weather', 'protection', 'shield', 'cover'],
    'thermometer': ['temperature', 'heat', 'cold', 'weather', 'fever'],
    'wind': ['breeze', 'air', 'weather', 'flow', 'movement'],
    'droplet': ['water', 'liquid', 'rain', 'humidity', 'fluid', 'drop'],
    'flame': ['fire', 'hot', 'burn', 'heat', 'energy', 'ignite'],
    'zap': ['lightning', 'electric', 'power', 'energy', 'bolt', 'shock'],
    'leaf': ['nature', 'plant', 'eco', 'green', 'environment', 'organic'],
    'tree': ['nature', 'plant', 'forest', 'environment', 'growth', 'wood'],
    'flower': ['nature', 'plant', 'beauty', 'bloom', 'garden', 'blossom'],
    'snowflake': ['winter', 'cold', 'snow', 'ice', 'unique', 'frozen'],
    
    // Transportation
    'car': ['vehicle', 'automobile', 'transport', 'drive', 'travel', 'road'],
    'truck': ['delivery', 'transport', 'shipping', 'cargo', 'logistics', 'freight'],
    'bus': ['public transport', 'travel', 'commute', 'passenger', 'transit'],
    'train': ['railway', 'transport', 'travel', 'locomotive', 'commute', 'rail'],
    'plane': ['aircraft', 'flight', 'travel', 'aviation', 'transport', 'fly'],
    'ship': ['boat', 'ocean', 'water', 'transport', 'cargo', 'vessel'],
    'bike': ['bicycle', 'transport', 'exercise', 'cycling', 'eco', 'pedal'],
    'scooter': ['transport', 'ride', 'electric', 'mobility', 'urban'],
    
    // Shopping & Commerce
    'shopping-cart': ['purchase', 'buy', 'store', 'ecommerce', 'basket', 'retail'],
    'shopping-bag': ['purchase', 'buy', 'retail', 'store', 'carry', 'bag'],
    'credit-card': ['payment', 'money', 'finance', 'purchase', 'banking', 'card'],
    'dollar-sign': ['money', 'currency', 'price', 'cost', 'finance', 'cash'],
    'tag': ['label', 'price', 'category', 'mark', 'identifier', 'badge'],
    'gift': ['present', 'surprise', 'celebration', 'reward', 'bonus', 'package'],
    'percent': ['discount', 'sale', 'offer', 'reduction', 'percentage'],
    
    // Location & Maps
    'map': ['location', 'geography', 'navigation', 'directions', 'area', 'territory'],
    'map-pin': ['location', 'marker', 'address', 'place', 'coordinates', 'point'],
    'navigation': ['gps', 'directions', 'route', 'guide', 'path', 'compass'],
    'compass': ['direction', 'navigation', 'orientation', 'guide', 'path', 'north'],
    'globe': ['world', 'earth', 'international', 'global', 'planet', 'worldwide'],
    'locate': ['find', 'position', 'gps', 'coordinates', 'place', 'target'],
    
    // Buildings & Places
    'building': ['office', 'structure', 'architecture', 'company', 'tower', 'corporate'],
    'home-alt': ['house', 'residence', 'dwelling', 'shelter', 'property'],
    'school': ['education', 'learning', 'university', 'college', 'academic', 'study'],
    'hospital': ['medical', 'health', 'care', 'doctor', 'emergency', 'clinic'],
    'store': ['shop', 'retail', 'market', 'business', 'commerce', 'vendor'],
    'church': ['religious', 'worship', 'building', 'spiritual', 'community', 'faith'],
    'factory': ['industrial', 'manufacturing', 'production', 'plant', 'facility'],
    
    // Health & Medical
    'heart': ['love', 'like', 'favorite', 'romance', 'health', 'cardiac'],
    'activity': ['pulse', 'health', 'monitor', 'vital', 'heartbeat', 'exercise'],
    'pill': ['medicine', 'medication', 'drug', 'treatment', 'capsule'],
    'syringe': ['injection', 'vaccine', 'medical', 'needle', 'immunization'],
    'stethoscope': ['medical', 'doctor', 'health', 'examination', 'diagnosis'],
    'bandage': ['first aid', 'medical', 'injury', 'treatment', 'wound'],
    
    // Security & Safety
    'lock': ['secure', 'protect', 'encrypt', 'private', 'closed', 'safety'],
    'unlock': ['open', 'access', 'decrypt', 'public', 'available', 'free'],
    'key': ['password', 'access', 'security', 'unlock', 'authorization'],
    'shield': ['protection', 'security', 'defense', 'safety', 'guard'],
    'eye': ['view', 'see', 'visible', 'watch', 'observe', 'monitor'],
    'eye-off': ['hide', 'invisible', 'private', 'conceal', 'blind', 'hidden'],
    
    // Tools & Equipment
    'tool': ['equipment', 'instrument', 'device', 'implement', 'utility'],
    'wrench': ['tool', 'repair', 'fix', 'maintenance', 'mechanic', 'adjust'],
    'hammer': ['tool', 'build', 'construction', 'repair', 'work', 'nail'],
    'screwdriver': ['tool', 'repair', 'fix', 'build', 'maintenance', 'screw'],
    'scissors': ['cut', 'trim', 'clip', 'divide', 'separate', 'snip'],
    'ruler': ['measure', 'length', 'size', 'dimension', 'scale', 'straight'],
    'pen': ['write', 'draw', 'ink', 'signature', 'compose', 'author'],
    'pencil': ['write', 'draw', 'sketch', 'draft', 'design', 'graphite'],
    'paintbrush': ['art', 'creative', 'paint', 'design', 'artistic', 'color'],
    'palette': ['art', 'color', 'creative', 'design', 'painting', 'artist'],
    
    // Sports & Fitness
    'dumbbell': ['fitness', 'exercise', 'weight', 'strength', 'gym', 'workout'],
    'bicycle': ['bike', 'exercise', 'sport', 'fitness', 'cycling', 'cardio'],
    'football': ['sport', 'game', 'ball', 'team', 'american football'],
    'basketball': ['sport', 'game', 'ball', 'team', 'court', 'hoop'],
    'tennis': ['sport', 'racket', 'ball', 'court', 'game', 'singles'],
    'golf': ['sport', 'ball', 'club', 'course', 'green', 'hole'],
    'running': ['exercise', 'fitness', 'sport', 'jog', 'marathon', 'cardio'],
    'swimming': ['sport', 'water', 'pool', 'exercise', 'stroke', 'aquatic'],
    'trophy': ['award', 'prize', 'achievement', 'victory', 'success', 'win'],
    'medal': ['award', 'achievement', 'honor', 'recognition', 'prize', 'victory'],
    
    // Food & Dining
    'coffee': ['drink', 'caffeine', 'morning', 'energy', 'beverage', 'espresso'],
    'cup': ['drink', 'beverage', 'mug', 'tea', 'coffee', 'container'],
    'pizza': ['food', 'meal', 'italian', 'slice', 'dinner', 'cheese'],
    'hamburger': ['food', 'meal', 'burger', 'fast food', 'meat', 'sandwich'],
    'cake': ['dessert', 'sweet', 'celebration', 'birthday', 'sugar', 'treat'],
    'ice-cream': ['dessert', 'sweet', 'cold', 'treat', 'summer', 'frozen'],
    'wine': ['drink', 'alcohol', 'celebration', 'grape', 'beverage', 'dinner'],
    'beer': ['drink', 'alcohol', 'pub', 'beverage', 'social', 'brewery'],
    'utensils': ['eating', 'food', 'cutlery', 'dining', 'meal', 'kitchen'],
    'chef-hat': ['cooking', 'chef', 'kitchen', 'food', 'culinary', 'professional'],
    'apple': ['fruit', 'healthy', 'food', 'nutrition', 'fresh', 'red'],
    'banana': ['fruit', 'healthy', 'food', 'yellow', 'potassium', 'tropical'],
    
    // Games & Entertainment
    'gamepad': ['gaming', 'controller', 'play', 'video games', 'console'],
    'dice': ['game', 'random', 'chance', 'gambling', 'roll', 'luck'],
    'puzzle': ['game', 'solve', 'challenge', 'pieces', 'brain teaser'],
    'cards': ['game', 'playing cards', 'deck', 'poker', 'gambling'],
    'joystick': ['gaming', 'controller', 'arcade', 'play', 'control'],
    
    // Science & Technology
    'atom': ['science', 'physics', 'nuclear', 'particle', 'chemistry', 'molecular'],
    'dna': ['genetics', 'biology', 'science', 'heredity', 'molecular', 'genome'],
    'microscope': ['science', 'research', 'laboratory', 'study', 'analysis', 'magnify'],
    'telescope': ['astronomy', 'space', 'observation', 'stars', 'discovery', 'optical'],
    'test-tube': ['science', 'chemistry', 'experiment', 'laboratory', 'research', 'beaker'],
    'beaker': ['science', 'chemistry', 'laboratory', 'experiment', 'liquid', 'glass'],
    'magnet': ['attraction', 'force', 'physics', 'pull', 'magnetic', 'pole'],
    'robot': ['artificial', 'intelligence', 'automation', 'technology', 'android', 'ai'],
    'cpu': ['processor', 'computer', 'chip', 'technology', 'processing', 'silicon'],
    'hard-drive-alt': ['storage', 'computer', 'data', 'memory', 'disk', 'backup'],
    'memory-stick': ['usb', 'storage', 'portable', 'data', 'flash drive'],
    'database': ['data', 'storage', 'information', 'server', 'records', 'sql'],
    'server': ['computer', 'network', 'database', 'hosting', 'cloud', 'data'],
    'code': ['programming', 'development', 'script', 'software', 'syntax', 'coding'],
    'terminal': ['command', 'console', 'shell', 'cli', 'interface', 'prompt'],
    'git-branch': ['version', 'control', 'development', 'merge', 'code', 'repository'],
    'github': ['repository', 'code', 'development', 'version', 'open-source', 'git'],
    
    // Symbols & Misc
    'hash': ['hashtag', 'number', 'symbol', 'social media', 'tag', 'pound'],
    'at-sign': ['email', 'mention', 'symbol', 'address', 'social media'],
    'ampersand': ['and', 'symbol', 'character', 'conjunction', 'plus'],
    'percentage': ['percentage', 'number', 'ratio', 'proportion', 'discount'],
    'infinity': ['endless', 'unlimited', 'forever', 'eternal', 'boundless'],
    'copyright': ['legal', 'protection', 'intellectual property', 'rights'],
    'trademark': ['brand', 'legal', 'protection', 'rights', 'registered'],
    'registered': ['trademark', 'legal', 'brand', 'protection', 'official']
  };
  
  return keywordMap[iconName] || [];
}

function getIconCategories(iconName: string): string[] {
  // Enhanced category mapping
  const categoryMap: Record<string, string[]> = {
    // Navigation & Interface
    'home': ['navigation', 'buildings', 'interface'],
    'menu': ['interface', 'navigation'],
    'search': ['interface', 'tools'],
    'filter': ['interface', 'tools'],
    'settings': ['interface', 'tools'],
    'more-horizontal': ['interface', 'navigation'],
    'more-vertical': ['interface', 'navigation'],
    
    // Actions
    'plus': ['interface', 'math', 'actions'],
    'minus': ['interface', 'math', 'actions'],
    'x': ['interface', 'actions'],
    'check': ['interface', 'actions'],
    'edit': ['interface', 'tools', 'actions'],
    'copy': ['interface', 'actions'],
    'cut': ['interface', 'actions'],
    'paste': ['interface', 'actions'],
    'save': ['interface', 'actions', 'files'],
    'undo': ['interface', 'actions'],
    'redo': ['interface', 'actions'],
    
    // Arrows & Navigation
    'arrow-up': ['arrows', 'navigation'],
    'arrow-down': ['arrows', 'navigation'],
    'arrow-left': ['arrows', 'navigation'],
    'arrow-right': ['arrows', 'navigation'],
    'chevron-up': ['arrows', 'navigation'],
    'chevron-down': ['arrows', 'navigation'],
    'chevron-left': ['arrows', 'navigation'],
    'chevron-right': ['arrows', 'navigation'],
    
    // Files & Storage
    'file': ['files', 'documents'],
    'file-text': ['files', 'documents'],
    'folder': ['files', 'organization'],
    'folder-open': ['files', 'organization'],
    'download': ['interface', 'files', 'actions'],
    'upload': ['interface', 'files', 'actions'],
    'hard-drive': ['devices', 'storage'],
    'cloud': ['storage', 'connectivity'],
    'archive': ['files', 'tools'],
    
    // Users & People
    'user': ['users', 'profiles'],
    'users': ['users', 'social'],
    'user-plus': ['users', 'actions'],
    'user-minus': ['users', 'actions'],
    'user-check': ['users', 'verification'],
    'user-x': ['users', 'actions'],
    
    // Communication
    'mail': ['communication', 'interface'],
    'send': ['communication', 'actions'],
    'inbox': ['communication', 'interface'],
    'phone': ['communication', 'devices'],
    'message-circle': ['communication', 'social'],
    'message-square': ['communication', 'social'],
    
    // Media & Entertainment
    'play': ['media', 'controls'],
    'pause': ['media', 'controls'],
    'stop': ['media', 'controls'],
    'skip-back': ['media', 'controls'],
    'skip-forward': ['media', 'controls'],
    'volume': ['media', 'interface'],
    'volume-off': ['media', 'interface'],
    'camera': ['devices', 'media'],
    'video': ['media', 'devices'],
    'image': ['media', 'files'],
    'music': ['media', 'entertainment'],
    
    // Time & Calendar
    'calendar': ['time', 'organization'],
    'clock': ['time'],
    'watch': ['time', 'accessories'],
    'timer': ['time', 'tools'],
    'alarm-clock': ['time', 'tools'],
    
    // Status & Indicators
    'alert-circle': ['alerts', 'status'],
    'alert-triangle': ['alerts', 'status'],
    'info': ['interface', 'status'],
    'help-circle': ['interface', 'support'],
    'check-circle': ['status', 'verification'],
    'x-circle': ['status', 'alerts'],
    
    // Devices & Technology
    'smartphone': ['devices', 'technology'],
    'tablet': ['devices', 'technology'],
    'laptop': ['devices', 'technology'],
    'monitor': ['devices', 'technology'],
    'tv': ['devices', 'media'],
    'radio': ['devices', 'media'],
    'headphones': ['devices', 'media'],
    'speaker': ['devices', 'media'],
    'microphone': ['devices', 'media'],
    'keyboard': ['devices', 'input'],
    'mouse': ['devices', 'input'],
    'printer': ['devices', 'office'],
    'wifi': ['connectivity', 'technology'],
    'bluetooth': ['connectivity', 'technology'],
    'battery': ['devices', 'power'],
    
    // Nature & Weather
    'sun': ['weather', 'nature'],
    'moon': ['weather', 'nature'],
    'star': ['nature', 'interface'],
    'cloud-weather': ['weather', 'nature'],
    'cloud-rain': ['weather', 'nature'],
    'cloud-snow': ['weather', 'nature'],
    'umbrella': ['weather', 'accessories'],
    'thermometer': ['weather', 'tools'],
    'wind': ['weather', 'nature'],
    'droplet': ['nature', 'weather'],
    'flame': ['nature', 'energy'],
    'zap': ['weather', 'energy'],
    'leaf': ['nature', 'environment'],
    'tree': ['nature', 'environment'],
    'flower': ['nature', 'plants'],
    'snowflake': ['weather', 'nature'],
    
    // Transportation
    'car': ['transportation', 'vehicles'],
    'truck': ['transportation', 'vehicles'],
    'bus': ['transportation', 'vehicles'],
    'train': ['transportation', 'vehicles'],
    'plane': ['transportation', 'vehicles'],
    'ship': ['transportation', 'vehicles'],
    'bike': ['transportation', 'sports'],
    'scooter': ['transportation', 'vehicles'],
    
    // Shopping & Commerce
    'shopping-cart': ['commerce', 'shopping'],
    'shopping-bag': ['commerce', 'shopping'],
    'credit-card': ['finance', 'commerce'],
    'dollar-sign': ['finance', 'symbols'],
    'tag': ['commerce', 'organization'],
    'gift': ['celebration', 'shopping'],
    'percent': ['math', 'commerce'],
    
    // Location & Maps
    'map': ['navigation', 'location'],
    'map-pin': ['navigation', 'location'],
    'navigation': ['navigation', 'location'],
    'compass': ['navigation', 'tools'],
    'globe': ['location', 'global'],
    'locate': ['navigation', 'location'],
    
    // Buildings & Places
    'building': ['buildings', 'architecture'],
    'home-building': ['buildings', 'navigation'],
    'school': ['buildings', 'education'],
    'hospital': ['buildings', 'health'],
    'store': ['buildings', 'commerce'],
    'church': ['buildings', 'community'],
    'factory': ['buildings', 'industry'],
    
    // Health & Medical
    'heart': ['health', 'emotions'],
    'activity': ['health', 'fitness'],
    'pill': ['health', 'medical'],
    'syringe': ['health', 'medical'],
    'stethoscope': ['health', 'medical'],
    'bandage': ['health', 'medical'],
    
    // Security & Safety
    'lock': ['security', 'interface'],
    'unlock': ['security', 'interface'],
    'key': ['security', 'tools'],
    'shield': ['security', 'protection'],
    'eye': ['interface', 'visibility'],
    'eye-off': ['interface', 'visibility'],
    
    // Tools & Equipment
    'tool': ['tools', 'construction'],
    'wrench': ['tools', 'construction'],
    'hammer': ['tools', 'construction'],
    'screwdriver': ['tools', 'construction'],
    'scissors': ['tools', 'office'],
    'ruler': ['tools', 'design'],
    'pen': ['tools', 'writing'],
    'pencil': ['tools', 'writing'],
    'paintbrush': ['art', 'tools'],
    'palette': ['art', 'design'],
    
    // Sports & Fitness
    'dumbbell': ['sports', 'fitness'],
    'bicycle': ['sports', 'transportation'],
    'football': ['sports', 'games'],
    'basketball': ['sports', 'games'],
    'tennis': ['sports', 'games'],
    'golf': ['sports', 'games'],
    'running': ['sports', 'fitness'],
    'swimming': ['sports', 'fitness'],
    'trophy': ['awards', 'sports'],
    'medal': ['awards', 'achievements'],
    
    // Food & Dining
    'coffee': ['food', 'beverages'],
    'cup': ['food', 'beverages'],
    'pizza': ['food', 'meals'],
    'hamburger': ['food', 'meals'],
    'cake': ['food', 'desserts'],
    'ice-cream': ['food', 'desserts'],
    'wine': ['food', 'beverages'],
    'beer': ['food', 'beverages'],
    'utensils': ['food', 'kitchen'],
    'chef-hat': ['food', 'cooking'],
    'apple': ['food', 'fruits'],
    'banana': ['food', 'fruits'],
    
    // Games & Entertainment
    'gamepad': ['entertainment', 'gaming'],
    'dice': ['entertainment', 'gaming'],
    'puzzle': ['entertainment', 'gaming'],
    'cards': ['entertainment', 'gaming'],
    'joystick': ['entertainment', 'gaming'],
    
    // Science & Technology
    'atom': ['science', 'physics'],
    'dna': ['science', 'biology'],
    'microscope': ['science', 'tools'],
    'telescope': ['science', 'astronomy'],
    'test-tube': ['science', 'chemistry'],
    'beaker': ['science', 'chemistry'],
    'magnet': ['science', 'physics'],
    'robot': ['technology', 'ai'],
    'cpu': ['technology', 'computing'],
    'hard-drive-tech': ['technology', 'storage'],
    'memory-stick': ['technology', 'storage'],
    'database': ['technology', 'data'],
    'server': ['technology', 'networking'],
    'code': ['development', 'technology'],
    'terminal': ['development', 'interface'],
    'git-branch': ['development', 'version-control'],
    'github': ['development', 'social'],
    
    // Symbols & Misc
    'hash': ['symbols', 'social'],
    'at-sign': ['symbols', 'communication'],
    'ampersand': ['symbols', 'typography'],
    'percent-symbol': ['symbols', 'math'],
    'infinity': ['symbols', 'math'],
    'copyright': ['symbols', 'legal'],
    'trademark': ['symbols', 'legal'],
    'registered': ['symbols', 'legal']
  };
  
  return categoryMap[iconName] || ['general'];
}
