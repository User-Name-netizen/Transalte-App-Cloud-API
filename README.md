# Google Translate App

Multi-language text translation app using Google Cloud Translation API.

## Features

- Translate text between multiple languages
- Auto language detection
- Text-to-speech support
- Copy to clipboard
- Responsive design

## Technologies

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **API**: Google Cloud Translation API

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Configure API key in `.env`:

```
GOOGLE_CLOUD_API_KEY=your_api_key_here
```

3. Run the server:

```bash
node src/server.js
```

4. Open http://localhost:3000

## Project Structure

```
google-translate-app/
├── package.json          # Dependencies
├── .env                  # API configuration
├── src/
│   └── server.js        # Backend server
└── public/
    ├── index.html       # Main interface
    ├── styles.css       # Styling
    └── script.js        # Frontend logic
```

## API Endpoints

- **GET /api/languages** - Get supported languages
- **POST /api/translate** - Translate text
- **POST /api/detect** - Detect language
- **GET /api/health** - Health check
