require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Translate } = require("@google-cloud/translate").v2;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const translate = new Translate({
  key: process.env.GOOGLE_CLOUD_API_KEY,
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/api/languages", async (req, res) => {
  try {
    const [languages] = await translate.getLanguages();

    const popularLanguages = [
      { code: "vi", name: "Tiếng Việt" },
      { code: "en", name: "Anh" },
      { code: "ko", name: "Hàn" },
      { code: "zh", name: "Trung" },
      { code: "ja", name: "Nhật" },
      { code: "fr", name: "Pháp" },
    ];

    res.json({
      success: true,
      languages: popularLanguages,
      total: languages.length,
    });
  } catch (error) {
    console.error("Error getting languages:", error);
    res.status(500).json({
      success: false,
      error: "Could not load languages",
    });
  }
});

app.post("/api/translate", async (req, res) => {
  try {
    const { text, from, to } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: "Text is required",
      });
    }

    if (!to) {
      return res.status(400).json({
        success: false,
        error: "Target language is required",
      });
    }

    const options = {
      to: to,
      format: "text",
    };

    if (from && from !== "auto") {
      options.from = from;
    }

    const [translation] = await translate.translate(text, options);

    let detectedLanguage = from;
    if (!from || from === "auto") {
      const [detection] = await translate.detect(text);
      detectedLanguage = detection.language;
    }

    res.json({
      success: true,
      originalText: text,
      translatedText: translation,
      fromLanguage: detectedLanguage,
      toLanguage: to,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Translation error:", error);

    if (error.code === 400) {
      res.status(400).json({
        success: false,
        error: "Invalid input data",
      });
    } else if (error.code === 403) {
      res.status(403).json({
        success: false,
        error: "Invalid API key or quota exceeded",
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Translation failed. Please try again.",
      });
    }
  }
});

app.post("/api/detect", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: "Text is required for language detection",
      });
    }

    const [detection] = await translate.detect(text);

    res.json({
      success: true,
      language: detection.language,
      confidence: detection.confidence,
      text: text,
    });
  } catch (error) {
    console.error("Language detection error:", error);
    res.status(500).json({
      success: false,
      error: "Language detection failed",
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log("API Endpoints:");
  console.log("  GET  /api/languages - Get supported languages");
  console.log("  POST /api/translate  - Translate text");
  console.log("  POST /api/detect     - Detect language");
  console.log("  GET  /api/health     - Health check");

  if (
    !process.env.GOOGLE_CLOUD_API_KEY ||
    process.env.GOOGLE_CLOUD_API_KEY === "YOUR_GOOGLE_CLOUD_API_KEY"
  ) {
    console.log("Warning: Please configure GOOGLE_CLOUD_API_KEY in .env file");
  }
});

module.exports = app;
