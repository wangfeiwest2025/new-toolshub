const express = require('express');
const router = express.Router();
const urlShortener = require('../utils/urlShortener');

// URL Shortener API
router.post('/shorten', (req, res) => {
  try {
    const { url } = req.body;
    const result = urlShortener.shortenUrl(url);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/expand/:code', (req, res) => {
  try {
    const result = urlShortener.expandUrl(req.params.code);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

router.get('/stats/:code', (req, res) => {
  try {
    const result = urlShortener.getUrlStats(req.params.code);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

router.delete('/delete/:code', (req, res) => {
  try {
    const result = urlShortener.deleteUrl(req.params.code);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

// Hash generator API
const crypto = require('crypto');

function hashData(data, algorithm) {
  const hash = crypto.createHash(algorithm);
  hash.update(data);
  return hash.digest('hex');
}

router.post('/hash', (req, res) => {
  try {
    const { text, algorithm = 'sha256' } = req.body;
    
    if (!text) {
      return res.status(400).json({ success: false, error: 'Text is required' });
    }

    const validAlgorithms = ['sha256', 'sha512', 'sha1', 'md5'];
    const algo = validAlgorithms.includes(algorithm) ? algorithm : 'sha256';
    
    const hash = hashData(text, algo);
    res.json({ success: true, data: { text, algorithm: algo, hash } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// UUID Generator API
function generateUUIDv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

router.get('/uuid', (req, res) => {
  const count = Math.min(parseInt(req.query.count) || 1, 100);
  const uuids = [];
  for (let i = 0; i < count; i++) {
    uuids.push(generateUUIDv4());
  }
  res.json({ success: true, data: { uuids } });
});

// Password Generator API
function generatePassword(length = 16, options = {}) {
  const { uppercase = true, lowercase = true, numbers = true, symbols = true } = options;
  
  let chars = '';
  if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (numbers) chars += '0123456789';
  if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  
  let password = '';
  const array = new Uint32Array(length);
  crypto.randomFillSync(array);
  
  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length];
  }
  
  return password;
}

router.post('/password', (req, res) => {
  try {
    const { length = 16, uppercase, lowercase, numbers, symbols } = req.body;
    const password = generatePassword(length, { uppercase, lowercase, numbers, symbols });
    res.json({ success: true, data: { password, length } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, status: 'OK', timestamp: new Date().toISOString() });
});

// Timestamp Converter API
router.get('/timestamp', (req, res) => {
  try {
    const { convert, format } = req.query;
    const now = Date.now();
    
    if (convert) {
      // Convert timestamp to date
      const date = new Date(parseInt(convert));
      return res.json({ 
        success: true, 
        data: { 
          timestamp: date.getTime(),
          datetime: date.toISOString(),
          local: date.toLocaleString('zh-CN'),
          unix: Math.floor(date.getTime() / 1000)
        }
      });
    }
    
    res.json({ 
      success: true, 
      data: { 
        timestamp: now,
        datetime: new Date(now).toISOString(),
        local: new Date(now).toLocaleString('zh-CN'),
        unix: Math.floor(now / 1000)
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Color Converter API
router.get('/color', (req, res) => {
  try {
    const { hex, rgb } = req.query;
    let result = {};
    
    if (hex) {
      // HEX to RGB
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      result = { hex, rgb: `rgb(${r}, ${g}, ${b})`, r, g, b };
    } else if (rgb) {
      // RGB to HEX
      const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        const [, r, g, b] = match;
        const toHex = (n) => parseInt(n).toString(16).padStart(2, '0');
        result = { rgb, hex: `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase() };
      }
    } else {
      return res.status(400).json({ success: false, error: 'Provide hex or rgb parameter' });
    }
    
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Number to Chinese API
function numberToChinese(num) {
  if (num === 0) return '零';
  
  const chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const chnUnitChar = ['', '十', '百', '千', '万', '亿', '兆'];
  
  let str = '';
  let unitPos = 0;
  
  while (num > 0) {
    const digit = num % 10;
    if (digit !== 0) {
      str = chnNumChar[digit] + chnUnitChar[unitPos] + str;
    } else if (str.length > 0 && str[0] !== '零') {
      str = '零' + str;
    }
    num = Math.floor(num / 10);
    unitPos++;
  }
  
  // Clean up consecutive zeros
  str = str.replace(/零+/g, '零').replace(/零+$/, '').replace(/^零/, '');
  
  // Fix "一十" to "十"
  str = str.replace(/^一十/, '十');
  
  return str;
}

function numberToRMBChinese(num) {
  const chnNumChar = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const chnUnitChar = ['', '拾', '佰', '仟'];
  const chnUnitSection = ['', '万', '亿'];
  
  let str = '';
  let unitPos = 0;
  let needZero = false;
  let isNeg = false;
  
  if (num < 0) {
    isNeg = true;
    num = Math.abs(num);
  }
  
  const sectionToChinese = (section) => {
    let str = '';
    let unitPos = 0;
    let needZero = false;
    
    while (section > 0) {
      const sectionNum = section % 10;
      if (sectionNum === 0) {
        if (needZero) {
          needZero = false;
          str = chnNumChar[0] + str;
        }
      } else {
        str = chnNumChar[sectionNum] + chnUnitChar[unitPos] + str;
        needZero = true;
      }
      unitPos++;
      section = Math.floor(section / 10);
    }
    return str;
  };
  
  let section = Math.floor(num / 10000);
  let remainder = num % 10000;
  
  while (section > 0) {
    str = sectionToChinese(section) + chnUnitSection[unitPos] + str;
    needZero = true;
    section = Math.floor(section / 10000);
    unitPos++;
  }
  
  str = sectionToChinese(remainder) + str;
  str = str.replace(/零+/g, '零').replace(/零+$/, '').replace(/^零/, '');
  str += '元整';
  if (isNeg) str = '负' + str;
  
  return str;
}

router.get('/number-chinese', (req, res) => {
  try {
    const { n, type } = req.query;
    
    if (!n) {
      return res.status(400).json({ success: false, error: 'Parameter n is required' });
    }
    
    const num = parseFloat(n);
    if (isNaN(num)) {
      return res.status(400).json({ success: false, error: 'Invalid number' });
    }
    
    let result;
    if (type === 'rmb') {
      result = numberToRMBChinese(num);
    } else {
      result = numberToChinese(Math.floor(num));
    }
    
    res.json({ success: true, data: { input: n, output: result, type: type || 'number' } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Case Converter API
function convertCase(str, type) {
  switch (type) {
    case 'camel': return str.replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
    case 'snake': return str.replace(/[A-Z]/g, c => '_' + c.toLowerCase());
    case 'kebab': return str.replace(/[A-Z]/g, c => '-' + c.toLowerCase());
    case 'pascal': return str.replace(/[-_](\w)/g, (_, c) => c.toUpperCase()).replace(/^./, c => c.toUpperCase());
    case 'constant': return str.replace(/[A-Z]/g, c => '_' + c.toLowerCase()).replace(/^_/, '');
    case 'upper': return str.toUpperCase();
    case 'lower': return str.toLowerCase();
    default: return str;
  }
}

router.get('/case-converter', (req, res) => {
  try {
    const { text, type } = req.query;
    
    if (!text) {
      return res.status(400).json({ success: false, error: 'Parameter text is required' });
    }
    
    res.json({ 
      success: true, 
      data: { 
        original: text,
        camelCase: convertCase(text, 'camel'),
        snake_case: convertCase(text, 'snake'),
        'kebab-case': convertCase(text, 'kebab'),
        PascalCase: convertCase(text, 'pascal'),
        CONSTANT_CASE: convertCase(text, 'constant'),
        UPPER: convertCase(text, 'upper'),
        lower: convertCase(text, 'lower')
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Base64 Converter API
router.post('/base64', (req, res) => {
  try {
    const { text, action } = req.body;
    
    if (!text) {
      return res.status(400).json({ success: false, error: 'Text is required' });
    }
    
    if (action === 'decode') {
      const decoded = Buffer.from(text, 'base64').toString('utf8');
      res.json({ success: true, data: { input: text, output: decoded, action: 'decode' } });
    } else {
      const encoded = Buffer.from(text).toString('base64');
      res.json({ success: true, data: { input: text, output: encoded, action: 'encode' } });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// URL Encoder/Decoder API
router.get('/url', (req, res) => {
  try {
    const { text, action } = req.query;
    
    if (!text) {
      return res.status(400).json({ success: false, error: 'Parameter text is required' });
    }
    
    let result;
    if (action === 'decode') {
      result = decodeURIComponent(text);
    } else {
      result = encodeURIComponent(text);
    }
    
    res.json({ success: true, data: { input: text, output: result, action: action || 'encode' } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cron Expression Builder API
function parseCron(cron) {
  const parts = cron.split(/\s+/);
  if (parts.length !== 5) return null;
  
  return {
    minute: parts[0],
    hour: parts[1],
    dayOfMonth: parts[2],
    month: parts[3],
    dayOfWeek: parts[4]
  };
}

router.get('/cron', (req, res) => {
  try {
    const { expression, action } = req.query;
    
    if (action === 'validate' && expression) {
      const parsed = parseCron(expression);
      const isValid = parsed !== null && !expression.match(/[^0-9*/,\-\s]/);
      res.json({ success: true, data: { expression, valid: isValid, parsed } });
    } else if (expression) {
      const parsed = parseCron(expression);
      res.json({ success: true, data: { expression, parsed } });
    } else {
      // Generate next run times
      const now = new Date();
      const next = [];
      for (let i = 0; i < 5; i++) {
        const nextDate = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
        next.push(nextDate.toISOString());
      }
      res.json({ success: true, data: { nextRun: next } });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// UUID Generator API (additional)
router.get('/uuid/:version', (req, res) => {
  try {
    const { version } = req.params;
    if (version !== 'v4') {
      return res.status(400).json({ success: false, error: 'Only v4 UUID supported' });
    }
    const uuid = generateUUIDv4();
    res.json({ success: true, data: { uuid, version: 'v4' } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
