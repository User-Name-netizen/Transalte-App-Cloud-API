# Hướng dẫn cấu hình Google Cloud Translation API

## 📝 Tổng quan về Google Cloud Translation API

Google Cloud Translation API là dịch vụ machine learning của Google cho phép dịch văn bản giữa hơn 100 ngôn ngữ. API này sử dụng công nghệ Neural Machine Translation để cung cấp kết quả dịch chất lượng cao.

## 🎯 Các bước cấu hình chi tiết

### Bước 1: Tạo Google Cloud Account

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Đăng nhập bằng tài khoản Google
3. Nếu lần đầu sử dụng, bạn sẽ được tặng $300 credit miễn phí

### Bước 2: Tạo Project mới

1. Trong Google Cloud Console, nhấn vào dropdown project ở góc trên
2. Chọn "New Project"
3. Nhập tên project: "translate-app" (hoặc tên bạn muốn)
4. Chọn Organization (nếu có)
5. Nhấn "Create"

### Bước 3: Enable Cloud Translation API

1. Vào menu "APIs & Services" > "Library"
2. Tìm kiếm "Cloud Translation API"
3. Nhấn vào kết quả "Cloud Translation API"
4. Nhấn nút "Enable"
5. Đợi vài giây để API được kích hoạt

### Bước 4: Tạo API Key

1. Vào "APIs & Services" > "Credentials"
2. Nhấn "Create Credentials" > "API Key"
3. API key sẽ được tạo và hiển thị
4. **QUAN TRỌNG**: Copy và lưu API key này

### Bước 5: Restrict API Key (Khuyến nghị)

1. Sau khi tạo API key, nhấn vào icon "Edit" (cây bút)
2. Trong tab "API restrictions":
   - Chọn "Restrict key"
   - Tích chọn "Cloud Translation API"
3. Trong tab "Application restrictions" (tùy chọn):
   - Chọn "HTTP referrers" nếu deploy lên web
   - Thêm domain của bạn: `*.yourdomain.com/*`
4. Nhấn "Save"

## 🔐 Phương pháp xác thực

### Phương pháp 1: API Key (Đơn giản - dành cho demo)

```javascript
const { Translate } = require("@google-cloud/translate").v2;

const translate = new Translate({
  key: "YOUR_API_KEY_HERE",
});
```

### Phương pháp 2: Service Account (Khuyến nghị cho production)

1. Vào "IAM & Admin" > "Service Accounts"
2. Nhấn "Create Service Account"
3. Nhập tên: "translate-service"
4. Nhấn "Create and Continue"
5. Trong "Grant this service account access to project":
   - Thêm role: "Cloud Translation API User"
6. Nhấn "Done"
7. Nhấn vào service account vừa tạo
8. Vào tab "Keys" > "Add Key" > "Create new key"
9. Chọn "JSON" và nhấn "Create"
10. File JSON sẽ được download

```javascript
// Sử dụng Service Account
const { Translate } = require("@google-cloud/translate").v2;

const translate = new Translate({
  keyFilename: "path/to/service-account-key.json",
  projectId: "your-project-id",
});
```

## 💰 Pricing và Quota

### Free Tier (12 tháng đầu)

- **500,000 ký tự miễn phí mỗi tháng**
- Áp dụng cho tài khoản mới
- Sau 12 tháng chuyển sang paid tier

### Paid Pricing

- **$20 USD / 1 triệu ký tự**
- Tính theo từng ký tự được dịch
- Khoảng trắng và ký tự đặc biệt cũng được tính

### Quota Limits

- **Default quota**: 1,000,000 ký tự/ngày
- **Max request size**: 30,000 bytes (≈ 30KB)
- **Rate limit**: 1,000 requests/100 giây

## 🔧 Cấu hình trong ứng dụng

### File .env

```bash
# Google Cloud API Key
GOOGLE_CLOUD_API_KEY=AIzaSyD...your-actual-api-key...xyz

# Hoặc Service Account (khuyến nghị)
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
GOOGLE_CLOUD_PROJECT_ID=your-project-id

# Server config
PORT=3000
NODE_ENV=development
```

### Kiểm tra cấu hình

```javascript
// Test API connection
const { Translate } = require("@google-cloud/translate").v2;

async function testConnection() {
  try {
    const translate = new Translate({
      key: process.env.GOOGLE_CLOUD_API_KEY,
    });

    const [languages] = await translate.getLanguages();
    console.log("✅ API connected successfully!");
    console.log(`Supported languages: ${languages.length}`);
  } catch (error) {
    console.error("❌ API connection failed:", error);
  }
}

testConnection();
```

## 🚀 Chức năng API chính

### 1. Translate Text

```javascript
const [translation] = await translate.translate(text, {
  from: "vi", // Ngôn ngữ nguồn
  to: "en", // Ngôn ngữ đích
  format: "text", // hoặc 'html'
});
```

### 2. Detect Language

```javascript
const [detection] = await translate.detect(text);
console.log("Language:", detection.language);
console.log("Confidence:", detection.confidence);
```

### 3. Get Supported Languages

```javascript
const [languages] = await translate.getLanguages("vi"); // Tên ngôn ngữ bằng tiếng Việt
```

### 4. Batch Translation

```javascript
const texts = ["Hello", "World", "How are you?"];
const [translations] = await translate.translate(texts, "vi");
```

## 📊 Monitoring và Debugging

### Kiểm tra Usage

1. Vào Google Cloud Console
2. "APIs & Services" > "Cloud Translation API"
3. Tab "Metrics" để xem usage statistics

### Enable Logging

```javascript
// Enable debug logging
process.env.DEBUG = "google-cloud-translate";

// Hoặc trong code
const translate = new Translate({
  key: process.env.GOOGLE_CLOUD_API_KEY,
  projectId: "your-project-id",
});
```

### Common Error Codes

- **400**: Bad Request - Input không hợp lệ
- **403**: Forbidden - API key sai hoặc hết quota
- **429**: Too Many Requests - Vượt quá rate limit
- **500**: Internal Server Error - Lỗi server Google

## 🔧 Best Practices

### 1. Caching

Implement caching để giảm API calls:

```javascript
const cache = new Map();

async function translateWithCache(text, from, to) {
  const key = `${text}-${from}-${to}`;

  if (cache.has(key)) {
    return cache.get(key);
  }

  const result = await translate.translate(text, { from, to });
  cache.set(key, result);

  return result;
}
```

### 2. Rate Limiting

```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per windowMs
  message: "Too many translation requests",
});

app.use("/api/translate", limiter);
```

### 3. Input Validation

```javascript
function validateTranslateInput(text, from, to) {
  if (!text || text.length === 0) {
    throw new Error("Text is required");
  }

  if (text.length > 30000) {
    throw new Error("Text too long (max 30KB)");
  }

  const supportedLangs = ["vi", "en", "fr", "es", "de", "ja", "ko", "zh"];
  if (to && !supportedLangs.includes(to)) {
    throw new Error("Unsupported target language");
  }
}
```

## 🌍 Ngôn ngữ được hỗ trợ

### Ngôn ngữ phổ biến

| Code | Ngôn ngữ          | Tên tiếng Anh |
| ---- | ----------------- | ------------- |
| `vi` | Tiếng Việt        | Vietnamese    |
| `en` | Tiếng Anh         | English       |
| `fr` | Tiếng Pháp        | French        |
| `es` | Tiếng Tây Ban Nha | Spanish       |
| `de` | Tiếng Đức         | German        |
| `ja` | Tiếng Nhật        | Japanese      |
| `ko` | Tiếng Hàn         | Korean        |
| `zh` | Tiếng Trung       | Chinese       |
| `th` | Tiếng Thái        | Thai          |
| `id` | Tiếng Indonesia   | Indonesian    |

### Lấy danh sách đầy đủ

```javascript
const [languages] = await translate.getLanguages();
languages.forEach((lang) => {
  console.log(`${lang.code}: ${lang.name}`);
});
```

## 🔒 Bảo mật

### 1. Bảo vệ API Key

- **KHÔNG BAO GIỜ** commit API key vào Git
- Sử dụng environment variables
- Rotate API key định kỳ

### 2. Restrict API Key

- Limit theo HTTP referrers
- Limit theo IP address
- Chỉ enable APIs cần thiết

### 3. Monitor Usage

- Set up billing alerts
- Monitor unusual usage patterns
- Regular security audit

## 🚀 Deploy lên Production

### Environment Variables

```bash
# Production .env
GOOGLE_CLOUD_API_KEY=your_production_api_key
NODE_ENV=production
PORT=80
REDIS_URL=redis://localhost:6379
```

### Docker Configuration

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Health Check Endpoint

```javascript
app.get("/health", async (req, res) => {
  try {
    // Test API connection
    await translate.getLanguages();
    res.json({ status: "healthy", timestamp: new Date() });
  } catch (error) {
    res.status(500).json({ status: "unhealthy", error: error.message });
  }
});
```

## 📞 Support và Troubleshooting

### Liên hệ hỗ trợ

- [Google Cloud Support](https://cloud.google.com/support)
- [Community Forums](https://cloud.google.com/translate/docs/support)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/google-cloud-translate)

### Debug checklist

1. ✅ API key chính xác?
2. ✅ API đã được enable?
3. ✅ Quota còn available?
4. ✅ Input format đúng?
5. ✅ Network connectivity OK?

---

**🎉 Chúc bạn thành công với dự án Google Translate App!**
