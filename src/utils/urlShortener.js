const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const URL_FILE = path.join(DATA_DIR, 'urls.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize URL storage
let urlStore = {};
if (fs.existsSync(URL_FILE)) {
  try {
    urlStore = JSON.parse(fs.readFileSync(URL_FILE, 'utf8'));
  } catch (e) {
    urlStore = {};
  }
}

function saveUrls() {
  fs.writeFileSync(URL_FILE, JSON.stringify(urlStore, null, 2));
}

function generateShortCode(length = 6) {
  return crypto.randomBytes(length).toString('base64url').substring(0, length);
}

function shortenUrl(originalUrl) {
  if (!originalUrl) {
    throw new Error('URL is required');
  }

  // Validate URL
  try {
    new URL(originalUrl);
  } catch (e) {
    throw new Error('Invalid URL format');
  }

  // Check if URL already exists
  for (const code in urlStore) {
    if (urlStore[code].originalUrl === originalUrl) {
      return { shortCode: code, shortUrl: `http://localhost:3001/s/${code}`, originalUrl };
    }
  }

  // Generate unique short code
  let shortCode;
  do {
    shortCode = generateShortCode();
  } while (urlStore[shortCode]);

  urlStore[shortCode] = {
    originalUrl,
    createdAt: new Date().toISOString(),
    clicks: 0
  };

  saveUrls();

  return {
    shortCode,
    shortUrl: `http://localhost:3001/s/${shortCode}`,
    originalUrl
  };
}

function expandUrl(shortCode) {
  if (!urlStore[shortCode]) {
    throw new Error('Short URL not found');
  }

  urlStore[shortCode].clicks++;
  urlStore[shortCode].lastAccessed = new Date().toISOString();
  saveUrls();

  return {
    originalUrl: urlStore[shortCode].originalUrl,
    clicks: urlStore[shortCode].clicks
  };
}

function getUrlStats(shortCode) {
  if (!urlStore[shortCode]) {
    throw new Error('Short URL not found');
  }

  return urlStore[shortCode];
}

function deleteUrl(shortCode) {
  if (!urlStore[shortCode]) {
    throw new Error('Short URL not found');
  }

  const deleted = urlStore[shortCode];
  delete urlStore[shortCode];
  saveUrls();

  return deleted;
}

module.exports = {
  shortenUrl,
  expandUrl,
  getUrlStats,
  deleteUrl
};
