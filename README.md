# New ToolsHub

A comprehensive collection of developer tools inspired by xJavaFxTool but implemented as a modern web application. This project provides a wide range of utilities accessible through a web interface, making them available across all devices and platforms.

## Features

- **Multiple Tools**: Collection of essential developer tools including encryption/decryption, QR code generation, time conversion, character encoding, and more
- **Responsive Design**: Works on all devices from desktop to mobile
- **Progressive Web App**: Can be installed on devices and used offline
- **Fast & Lightweight**: Minimal dependencies and optimized for performance
- **Modern UI**: Clean, intuitive interface designed with user experience in mind
- **Extensible**: Easy to add new tools to the collection

## Available Tools

### Security & Encryption
- **Encryption & Decryption**: Multiple algorithms including Base64, MD5, SHA, AES, Caesar cipher, and ROT13
- **QR Code Generator**: Create custom QR codes with various options

### Data Conversion
- **Time Converter**: Convert between timestamps and readable dates, calculate time differences, timezone conversion
- **Character Converter**: Convert between different character encodings, numeral systems, and text formats
- **URL Shortener**: Quickly shorten long URLs with custom options

### Development Tools
- **JSON Formatter**: Format, validate, and manipulate JSON data
- **Regex Tester**: Test and debug regular expressions with real-time feedback
- **Color Converter**: Convert between different color formats (HEX, RGB, HSL)

### Utility Tools
- **Cron Expression Builder**: Build and validate cron expressions
- **File Utilities**: Tools for file operations
- **Network Tools**: Utilities for network diagnostics
- **Image Tools**: Compress, resize, convert, and manipulate images

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd new-toolshub
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Access the application at `http://localhost:3001`

## Development

To run in development mode with auto-restart on changes:

```bash
npm run dev
```

## Project Structure

```
new-toolshub/
├── public/                 # Static files (HTML, CSS, JS, images)
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   ├── tools/             # Individual tool HTML files
│   └── images/            # Image assets
├── src/                   # Source code for backend services
│   ├── controllers/       # Request handlers
│   ├── models/            # Data models
│   ├── routes/            # Route definitions
│   ├── utils/             # Utility functions
│   └── views/             # View templates
├── package.json           # Dependencies and scripts
├── server.js              # Main server file
└── README.md              # This file
```

## Technologies Used

- **Backend**: Node.js with Express.js
- **Frontend**: Pure HTML, CSS, and JavaScript (no heavy frameworks for performance)
- **Styling**: Custom CSS with Bootstrap for responsive components
- **Icons**: Font Awesome
- **PWA**: Service workers for offline capability

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [xJavaFxTool](https://github.com/864381832/xJavaFxTool) - A great collection of JavaFX-based tools
- Built with modern web technologies for cross-platform accessibility