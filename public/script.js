let currentLanguages = [];
let isTranslating = false;

const API_BASE = "";
const API_ENDPOINTS = {
  translate: "/api/translate",
  languages: "/api/languages",
  detect: "/api/detect",
  health: "/api/health",
};

const elements = {
  fromLanguage: document.getElementById("fromLanguage"),
  toLanguage: document.getElementById("toLanguage"),
  inputText: document.getElementById("inputText"),
  outputText: document.getElementById("outputText"),
  translateBtn: document.getElementById("translateBtn"),
  swapLanguages: document.getElementById("swapLanguages"),
  detectLanguage: document.getElementById("detectLanguage"),
  clearInput: document.getElementById("clearInput"),
  copyOutput: document.getElementById("copyOutput"),
  speakOutput: document.getElementById("speakOutput"),
  inputCharCount: document.getElementById("inputCharCount"),
  outputCharCount: document.getElementById("outputCharCount"),
  status: document.getElementById("status"),
  translationInfo: document.getElementById("translationInfo"),
  apiStatus: document.getElementById("apiStatus"),
  loadingOverlay: document.getElementById("loadingOverlay"),
  modal: document.getElementById("modal"),
  modalBody: document.getElementById("modalBody"),
  aboutBtn: document.getElementById("aboutBtn"),
  helpBtn: document.getElementById("helpBtn"),
  themeToggle: document.getElementById("themeToggle"),
  historyBtn: document.getElementById("historyBtn"),
  voiceBtn: document.getElementById("voiceBtn"),
};

class HistoryManager {
  static getHistory() {
    return JSON.parse(localStorage.getItem("translateHistory") || "[]");
  }

  static addToHistory(original, translated, from, to) {
    const history = HistoryManager.getHistory();
    const newEntry = {
      id: Date.now(),
      original,
      translated,
      from,
      to,
      timestamp: new Date().toISOString(),
    };

    history.unshift(newEntry);
    const limitedHistory = history.slice(0, 50);
    localStorage.setItem("translateHistory", JSON.stringify(limitedHistory));
  }

  static clearHistory() {
    localStorage.removeItem("translateHistory");
  }

  static showHistoryModal() {
    const history = HistoryManager.getHistory();

    let content = `
      <h2><i class="fas fa-history"></i> Translation History</h2>
      <button class="history-clear" onclick="HistoryManager.clearHistoryAndRefresh()">
        <i class="fas fa-trash"></i> Clear All History
      </button>
    `;

    if (history.length === 0) {
      content += "<p>No translation history found.</p>";
    } else {
      content += '<div class="history-modal">';
      history.forEach((item) => {
        const date = new Date(item.timestamp).toLocaleString();
        const fromLang = TranslatorApp.getLanguageName(item.from);
        const toLang = TranslatorApp.getLanguageName(item.to);

        content += `
          <div class="history-item" onclick="HistoryManager.useHistoryItem('${item.original}', '${item.translated}', '${item.from}', '${item.to}')">
            <div class="history-text">${item.original}</div>
            <div class="history-translation">→ ${item.translated}</div>
            <div class="history-meta">${fromLang} → ${toLang} • ${date}</div>
          </div>
        `;
      });
      content += "</div>";
    }

    elements.modalBody.innerHTML = content;
    elements.modal.classList.remove("hidden");
  }

  static useHistoryItem(original, translated, from, to) {
    elements.inputText.value = original;
    elements.outputText.value = translated;
    elements.fromLanguage.value = from;
    elements.toLanguage.value = to;

    elements.inputCharCount.textContent = Utils.formatCharCount(
      original.length
    );
    elements.outputCharCount.textContent = Utils.formatCharCount(
      translated.length
    );

    TranslatorApp.closeModal();
    Utils.showStatus("History item loaded", "success");
  }

  static clearHistoryAndRefresh() {
    HistoryManager.clearHistory();
    HistoryManager.showHistoryModal();
    Utils.showStatus("History cleared", "success");
  }
}

class ThemeManager {
  static init() {
    const savedTheme = localStorage.getItem("theme") || "light";
    ThemeManager.setTheme(savedTheme);
  }

  static toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    ThemeManager.setTheme(newTheme);
  }

  static setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    const icon = elements.themeToggle.querySelector("i");
    if (theme === "dark") {
      icon.className = "fas fa-sun";
      elements.themeToggle.title = "Switch to Light Mode";
    } else {
      icon.className = "fas fa-moon";
      elements.themeToggle.title = "Switch to Dark Mode";
    }
  }
}

class VoiceManager {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.setupSpeechRecognition();
  }

  setupSpeechRecognition() {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      console.warn("Speech recognition not supported");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      elements.inputText.value = text;
      elements.inputCharCount.textContent = Utils.formatCharCount(text.length);

      VoiceManager.stopListening();
      TranslatorApp.closeModal();
      Utils.showStatus(`Voice input: "${text}"`, "success");

      setTimeout(() => TranslatorApp.handleTranslate(), 500);
    };

    this.recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      VoiceManager.stopListening();
      TranslatorApp.closeModal();
      Utils.showStatus("Voice input failed: " + event.error, "error");
    };

    this.recognition.onend = () => {
      VoiceManager.stopListening();
    };
  }

  static startListening() {
    const voiceManager = window.voiceManager;
    if (!voiceManager || !voiceManager.recognition) {
      Utils.showStatus("Speech recognition not available", "error");
      return;
    }

    const fromLang = elements.fromLanguage.value;
    let lang = "vi-VN";

    const langMap = {
      vi: "vi-VN",
      en: "en-US",
      ko: "ko-KR",
      zh: "zh-CN",
      ja: "ja-JP",
      fr: "fr-FR",
    };

    if (fromLang !== "auto" && langMap[fromLang]) {
      lang = langMap[fromLang];
    }

    voiceManager.recognition.lang = lang;
    voiceManager.isListening = true;

    elements.voiceBtn.classList.add("voice-recording");

    VoiceManager.showVoiceModal();

    try {
      voiceManager.recognition.start();
      Utils.showStatus("Listening... Speak now", "info");
    } catch (error) {
      console.error("Failed to start recognition:", error);
      VoiceManager.stopListening();
      Utils.showStatus("Failed to start voice input", "error");
    }
  }

  static stopListening() {
    const voiceManager = window.voiceManager;
    if (voiceManager) {
      voiceManager.isListening = false;
    }

    elements.voiceBtn.classList.remove("voice-recording");

    if (voiceManager && voiceManager.recognition) {
      try {
        voiceManager.recognition.stop();
      } catch (error) {
        console.error("Error stopping recognition:", error);
      }
    }
  }

  static showVoiceModal() {
    const content = `
      <div class="voice-modal">
        <h2><i class="fas fa-microphone"></i> Voice Input</h2>
        <p>Speak clearly into your microphone...</p>
        
        <div class="voice-visualizer">
          <div class="voice-bar"></div>
          <div class="voice-bar"></div>
          <div class="voice-bar"></div>
          <div class="voice-bar"></div>
          <div class="voice-bar"></div>
        </div>
        
        <button onclick="VoiceManager.stopListening(); TranslatorApp.closeModal();" class="control-btn">
          <i class="fas fa-stop"></i> Stop Listening
        </button>
      </div>
    `;

    elements.modalBody.innerHTML = content;
    elements.modal.classList.remove("hidden");
  }
}

class Utils {
  static showStatus(message, type = "info") {
    elements.status.textContent = message;
    elements.status.className = `status-message ${type}`;

    setTimeout(() => {
      elements.status.style.display = "none";
    }, 5000);
  }

  static showLoading(show = true) {
    if (show) {
      elements.loadingOverlay.classList.remove("hidden");
    } else {
      elements.loadingOverlay.classList.add("hidden");
    }
  }

  static formatCharCount(count, max = 5000) {
    const element =
      count === elements.inputCharCount.textContent.split(" ")[0]
        ? elements.inputCharCount
        : elements.outputCharCount;

    if (count > max * 0.9) {
      element.classList.add("warning");
    } else if (count >= max) {
      element.classList.add("danger");
    } else {
      element.classList.remove("warning", "danger");
    }

    return `${count} characters`;
  }

  static validateInput(text) {
    if (!text || !text.trim()) {
      return { valid: false, error: "Please enter text to translate" };
    }

    if (text.length > 5000) {
      return { valid: false, error: "Text cannot exceed 5000 characters" };
    }

    return { valid: true };
  }

  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      Utils.showStatus("Copied to clipboard!", "success");
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      Utils.showStatus("Copied to clipboard!", "success");
    }
  }

  static speakText(text, lang = "vi") {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "auto" ? "vi" : lang;
      utterance.rate = 0.8;
      utterance.pitch = 1;

      speechSynthesis.speak(utterance);
      Utils.showStatus("Speaking...", "info");
    } else {
      Utils.showStatus("Browser does not support text-to-speech", "error");
    }
  }
}

class API {
  static async request(endpoint, options = {}) {
    try {
      const response = await fetch(API_BASE + endpoint, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "API request failed");
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  static async getLanguages() {
    return await API.request(API_ENDPOINTS.languages);
  }

  static async translateText(text, from, to) {
    return await API.request(API_ENDPOINTS.translate, {
      method: "POST",
      body: JSON.stringify({ text, from, to }),
    });
  }

  static async detectLanguage(text) {
    return await API.request(API_ENDPOINTS.detect, {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  }

  static async checkHealth() {
    try {
      const data = await API.request(API_ENDPOINTS.health);
      return data.success;
    } catch {
      return false;
    }
  }
}

class TranslatorApp {
  static async init() {
    console.log("Initializing Google Translate App...");

    try {
      // Initialize theme
      ThemeManager.init();

      // Initialize voice manager
      window.voiceManager = new VoiceManager();

      await TranslatorApp.checkAPIStatus();
      await TranslatorApp.loadLanguages();
      TranslatorApp.setupEventListeners();
      TranslatorApp.setupCharCounters();

      console.log("App initialized successfully!");
      Utils.showStatus("Application ready!", "success");
    } catch (error) {
      console.error("Initialization error:", error);
      Utils.showStatus("Error initializing application", "error");
    }
  }

  static async checkAPIStatus() {
    try {
      const isOnline = await API.checkHealth();
      elements.apiStatus.textContent = isOnline ? "Online" : "Offline";
      elements.apiStatus.className = `api-status ${
        isOnline ? "online" : "offline"
      }`;

      if (!isOnline) {
        throw new Error("API unavailable");
      }
    } catch (error) {
      elements.apiStatus.textContent = "Offline";
      elements.apiStatus.className = "api-status offline";
      throw error;
    }
  }

  static async loadLanguages() {
    try {
      console.log("Loading language list...");
      const data = await API.getLanguages();
      currentLanguages = data.languages;

      TranslatorApp.populateLanguageSelects();

      console.log(`Loaded ${currentLanguages.length} languages`);
    } catch (error) {
      console.error("Error loading languages:", error);
      Utils.showStatus("Could not load language list", "error");
      throw error;
    }
  }

  static populateLanguageSelects() {
    elements.toLanguage.innerHTML = "";

    currentLanguages.forEach((lang) => {
      const fromOption = document.createElement("option");
      fromOption.value = lang.code;
      fromOption.textContent = lang.name;
      elements.fromLanguage.appendChild(fromOption);

      const toOption = document.createElement("option");
      toOption.value = lang.code;
      toOption.textContent = lang.name;
      elements.toLanguage.appendChild(toOption);
    });

    elements.fromLanguage.value = "auto";
    elements.toLanguage.value = "en";
  }

  static setupEventListeners() {
    elements.translateBtn.addEventListener(
      "click",
      TranslatorApp.handleTranslate
    );

    elements.inputText.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "Enter") {
        TranslatorApp.handleTranslate();
      }
    });

    elements.swapLanguages.addEventListener(
      "click",
      TranslatorApp.handleSwapLanguages
    );

    elements.detectLanguage.addEventListener(
      "click",
      TranslatorApp.handleDetectLanguage
    );

    elements.clearInput.addEventListener(
      "click",
      TranslatorApp.handleClearInput
    );

    elements.copyOutput.addEventListener(
      "click",
      TranslatorApp.handleCopyOutput
    );

    elements.speakOutput.addEventListener(
      "click",
      TranslatorApp.handleSpeakOutput
    );

    // New feature event listeners
    elements.themeToggle.addEventListener("click", () => {
      ThemeManager.toggleTheme();
    });

    elements.historyBtn.addEventListener("click", () => {
      HistoryManager.showHistoryModal();
    });

    elements.voiceBtn.addEventListener("click", () => {
      VoiceManager.startListening();
    });

    const debouncedTranslate = Utils.debounce(() => {
      if (elements.inputText.value.trim()) {
        TranslatorApp.handleTranslate();
      }
    }, 1000);

    elements.inputText.addEventListener("input", debouncedTranslate);

    elements.aboutBtn.addEventListener("click", () =>
      TranslatorApp.showModal("about")
    );
    elements.helpBtn.addEventListener("click", () =>
      TranslatorApp.showModal("help")
    );

    elements.modal.addEventListener("click", (e) => {
      if (
        e.target === elements.modal ||
        e.target.classList.contains("modal-close")
      ) {
        TranslatorApp.closeModal();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        VoiceManager.stopListening();
        TranslatorApp.closeModal();
      }
    });
  }

  static setupCharCounters() {
    elements.inputText.addEventListener("input", () => {
      const count = elements.inputText.value.length;
      elements.inputCharCount.textContent = Utils.formatCharCount(count);
    });

    elements.inputCharCount.textContent = Utils.formatCharCount(0);
    elements.outputCharCount.textContent = Utils.formatCharCount(0);
  }

  static async handleTranslate() {
    if (isTranslating) return;

    const text = elements.inputText.value.trim();
    const from = elements.fromLanguage.value;
    const to = elements.toLanguage.value;

    const validation = Utils.validateInput(text);
    if (!validation.valid) {
      Utils.showStatus(validation.error, "error");
      elements.inputText.classList.add("shake");
      setTimeout(() => elements.inputText.classList.remove("shake"), 500);
      return;
    }

    if (!to || to === from) {
      Utils.showStatus("Please select a different target language", "error");
      return;
    }

    try {
      isTranslating = true;
      elements.translateBtn.disabled = true;
      elements.translateBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Translating...';

      Utils.showLoading(true);
      console.log(`Translating: "${text}" from ${from} to ${to}`);

      const result = await API.translateText(text, from, to);

      elements.outputText.value = result.translatedText;
      elements.outputCharCount.textContent = Utils.formatCharCount(
        result.translatedText.length
      );

      HistoryManager.addToHistory(
        text,
        result.translatedText,
        result.fromLanguage,
        to
      );

      const fromLangName =
        from === "auto"
          ? TranslatorApp.getLanguageName(result.fromLanguage)
          : TranslatorApp.getLanguageName(from);
      const toLangName = TranslatorApp.getLanguageName(to);

      elements.translationInfo.innerHTML = `
                <i class="fas fa-info-circle"></i>
                Translated from <strong>${fromLangName}</strong> to <strong>${toLangName}</strong>
                <br>
                <small>Time: ${new Date(
                  result.timestamp
                ).toLocaleTimeString()}</small>
            `;

      Utils.showStatus("Translation successful!", "success");
      console.log("Translation successful!");
    } catch (error) {
      console.error("Translation error:", error);
      Utils.showStatus(error.message || "Error translating text", "error");
      elements.outputText.value = "";
      elements.outputCharCount.textContent = Utils.formatCharCount(0);
    } finally {
      isTranslating = false;
      elements.translateBtn.disabled = false;
      elements.translateBtn.innerHTML =
        '<i class="fas fa-language"></i> Translate';
      Utils.showLoading(false);
    }
  }

  static handleSwapLanguages() {
    const fromValue = elements.fromLanguage.value;
    const toValue = elements.toLanguage.value;
    const inputText = elements.inputText.value;
    const outputText = elements.outputText.value;

    if (fromValue === "auto") {
      Utils.showStatus("Cannot swap when auto-detect is selected", "info");
      return;
    }

    elements.fromLanguage.value = toValue;
    elements.toLanguage.value = fromValue;

    elements.inputText.value = outputText;
    elements.outputText.value = inputText;

    elements.inputCharCount.textContent = Utils.formatCharCount(
      outputText.length
    );
    elements.outputCharCount.textContent = Utils.formatCharCount(
      inputText.length
    );

    Utils.showStatus("Languages swapped", "success");
  }

  static async handleDetectLanguage() {
    const text = elements.inputText.value.trim();

    const validation = Utils.validateInput(text);
    if (!validation.valid) {
      Utils.showStatus(validation.error, "error");
      return;
    }

    try {
      elements.detectLanguage.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Detecting...';
      elements.detectLanguage.disabled = true;

      console.log(`Detecting language: "${text}"`);
      const result = await API.detectLanguage(text);

      const langName = TranslatorApp.getLanguageName(result.language);
      const confidence = Math.round(result.confidence * 100);

      elements.fromLanguage.value = result.language;

      Utils.showStatus(
        `Detected: ${langName} (${confidence}% confidence)`,
        "success"
      );

      console.log(`Detection successful: ${langName} (${confidence}%)`);
    } catch (error) {
      console.error("Language detection error:", error);
      Utils.showStatus("Cannot detect language", "error");
    } finally {
      elements.detectLanguage.innerHTML =
        '<i class="fas fa-search"></i> Detect Language';
      elements.detectLanguage.disabled = false;
    }
  }

  static handleClearInput() {
    elements.inputText.value = "";
    elements.outputText.value = "";
    elements.inputCharCount.textContent = Utils.formatCharCount(0);
    elements.outputCharCount.textContent = Utils.formatCharCount(0);
    elements.translationInfo.innerHTML = "";
    Utils.showStatus("Content cleared", "info");
  }

  static handleCopyOutput() {
    const text = elements.outputText.value.trim();
    if (!text) {
      Utils.showStatus("No content to copy", "error");
      return;
    }
    Utils.copyToClipboard(text);
  }

  static handleSpeakOutput() {
    const text = elements.outputText.value.trim();
    if (!text) {
      Utils.showStatus("No content to speak", "error");
      return;
    }
    const lang = elements.toLanguage.value;
    Utils.speakText(text, lang);
  }

  static getLanguageName(code) {
    const lang = currentLanguages.find((l) => l.code === code);
    return lang ? lang.name : code.toUpperCase();
  }

  static showModal(type) {
    let content = "";

    if (type === "about") {
      content = `
                <h2>About</h2>
                <p>Multi-language text translation app using Google Cloud Translation API.</p>
                
                <h3>Features:</h3>
                <ul>
                    <li>Translate text between multiple languages</li>
                    <li>Automatic language detection</li>
                    <li>Text-to-speech output</li>
                    <li>Copy results</li>
                    <li>User-friendly interface</li>
                </ul>
                
                <h3>Technologies:</h3>
                <ul>
                    <li>Frontend: HTML, CSS, JavaScript</li>
                    <li>Backend: Node.js, Express</li>
                    <li>API: Google Cloud Translation</li>
                </ul>
            `;
    } else if (type === "help") {
      content = `
                <h2>How to Use</h2>
                
                <h3>Translation Steps:</h3>
                <ol>
                    <li>Enter text in the "Source Text" box</li>
                    <li>Select source language (or leave as "Auto-detect")</li>
                    <li>Select target language</li>
                    <li>Click "Translate" or press Ctrl+Enter</li>
                </ol>
                
                <h3>Keyboard Shortcuts:</h3>
                <ul>
                    <li><kbd>Ctrl + Enter</kbd>: Translate text</li>
                    <li><kbd>Esc</kbd>: Close modal</li>
                </ul>
                
                <h3>Additional Features:</h3>
                <ul>
                    <li><strong>Swap Languages:</strong> Click <i class="fas fa-exchange-alt"></i></li>
                    <li><strong>Language Detection:</strong> Auto-identify text language</li>
                    <li><strong>Text-to-Speech:</strong> Listen to translation</li>
                    <li><strong>Copy:</strong> Copy result to clipboard</li>
                </ul>
                
                <h3>Limitations:</h3>
                <ul>
                    <li>Maximum 5000 characters per translation</li>
                    <li>500,000 free characters/month for first 12 months</li>
                </ul>
            `;
    }

    elements.modalBody.innerHTML = content;
    elements.modal.classList.remove("hidden");
  }

  static closeModal() {
    elements.modal.classList.add("hidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing app...");
  TranslatorApp.init();
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    TranslatorApp.checkAPIStatus().catch(console.error);
  }
});

window.TranslatorApp = TranslatorApp;
window.HistoryManager = HistoryManager;
window.ThemeManager = ThemeManager;
window.VoiceManager = VoiceManager;
