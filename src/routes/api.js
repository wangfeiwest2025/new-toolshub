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

module.exports = router;
