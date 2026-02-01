require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Import routes
const apiRoutes = require('./src/routes/api');
const urlShortener = require('./src/utils/urlShortener');

// API Routes
app.use('/api', apiRoutes);

// Short URL redirect
app.get('/s/:code', (req, res) => {
  try {
    const result = urlShortener.expandUrl(req.params.code);
    res.redirect(result.originalUrl);
  } catch (error) {
    res.sendFile(path.join(__dirname, 'public', 'tools', 'url-shortener.html'));
  }
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve individual tool pages
app.get('/tools/:toolName', (req, res) => {
  const toolName = req.params.toolName;
  res.sendFile(path.join(__dirname, 'public', 'tools', `${toolName}.html`));
});

// Start server
server.listen(PORT, () => {
  console.log(`New ToolsHub server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the tools`);
});