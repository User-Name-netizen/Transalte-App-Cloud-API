# 🚀 Hướng dẫn Deploy Web App - Google Translate

## 📋 Tổng quan

Tài liệu này hướng dẫn cách triển khai ứng dụng Google Translate lên các nền tảng hosting khác nhau.

## 🏗️ Kiến trúc ứng dụng

```
google-translate-app/
├── package.json          # Dependencies và scripts
├── .env                  # Environment variables
├── src/
│   └── server.js        # Node.js Express server
└── public/
    ├── index.html       # Frontend
    ├── styles.css       # CSS styling  
    └── script.js        # Client-side JS
```

**Tech Stack:**
- Backend: Node.js + Express.js
- Frontend: HTML5 + CSS3 + JavaScript ES6+
- API: Google Cloud Translation API
- Database: Không cần (stateless)

## 🌐 Các tùy chọn Deploy

### 1. 🆓 Heroku (Miễn phí - Khuyến nghị cho học tập)

#### Bước 1: Chuẩn bị project

```bash
# Tạo Procfile
echo "web: node src/server.js" > Procfile

# Đảm bảo có engines trong package.json
```

```json
{
  "engines": {
    "node": "18.x",
    "npm": "9.x"
  }
}
```

#### Bước 2: Deploy lên Heroku

```bash
# 1. Cài Heroku CLI
# 2. Login Heroku
heroku login

# 3. Tạo app
heroku create google-translate-app-demo

# 4. Set environment variables
heroku config:set GOOGLE_CLOUD_API_KEY=your_api_key_here

# 5. Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# 6. Mở app
heroku open
```

**URL:** `https://google-translate-app-demo.herokuapp.com`

### 2. ▲ Vercel (Miễn phí - Khuyến nghị cho production)

#### Bước 1: Cài Vercel CLI

```bash
npm i -g vercel
```

#### Bước 2: Cấu hình Vercel

Tạo file `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "public/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "src/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "public/$1"
    }
  ],
  "env": {
    "GOOGLE_CLOUD_API_KEY": "@google-cloud-api-key"
  }
}
```

#### Bước 3: Deploy

```bash
# 1. Login
vercel login

# 2. Deploy
vercel

# 3. Set environment variables
vercel env add GOOGLE_CLOUD_API_KEY

# 4. Deploy production
vercel --prod
```

**URL:** `https://google-translate-app.vercel.app`

### 3. 🌊 Netlify (Miễn phí)

#### Bước 1: Cấu hình cho Netlify Functions

Tạo folder `netlify/functions/` và chuyển đổi API endpoints:

```javascript
// netlify/functions/translate.js
const { Translate } = require('@google-cloud/translate').v2;

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  try {
    const { text, from, to } = JSON.parse(event.body);
    
    const translate = new Translate({
      key: process.env.GOOGLE_CLOUD_API_KEY,
    });
    
    const [translation] = await translate.translate(text, { to });
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        translatedText: translation
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
```

#### Bước 2: Deploy

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Deploy
netlify deploy

# 4. Deploy production
netlify deploy --prod
```

### 4. ☁️ Railway (Miễn phí)

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Init project
railway init

# 4. Deploy
railway up

# 5. Set environment variables
railway variables set GOOGLE_CLOUD_API_KEY=your_key
```

### 5. 🌐 Render (Miễn phí)

1. Kết nối GitHub repository với Render
2. Chọn "Web Service"
3. Cấu hình:
   - **Build Command:** `npm install`
   - **Start Command:** `node src/server.js`
   - **Environment:** Node.js
4. Thêm environment variable `GOOGLE_CLOUD_API_KEY`

## 🔧 Cấu hình Environment Variables

### Cho tất cả platforms:

```bash
GOOGLE_CLOUD_API_KEY=AIzaSyD...your-api-key...xyz
PORT=3000  # Optional, platform sẽ tự set
NODE_ENV=production
```

### Lấy Google Cloud API Key:

1. Truy cập [Google Cloud Console](https://console.cloud.google.com)
2. Tạo project mới hoặc chọn project existing
3. Enable Cloud Translation API
4. Tạo credentials (API Key)
5. Copy API key để sử dụng

## 📦 Tối ưu hóa cho Production

### 1. Caching Strategy

```javascript
// Thêm vào server.js
const cache = new Map();

app.post('/api/translate', async (req, res) => {
  const cacheKey = `${req.body.text}-${req.body.from}-${req.body.to}`;
  
  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }
  
  // ... translation logic
  
  cache.set(cacheKey, result);
  res.json(result);
});
```

### 2. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 3. Error Monitoring

```javascript
// Sử dụng Sentry cho error tracking
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

app.use(Sentry.Handlers.errorHandler());
```

### 4. Security Headers

```javascript
const helmet = require('helmet');
app.use(helmet());
```

## 🔍 Monitoring và Analytics

### 1. Health Check Endpoint

```javascript
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});
```

### 2. Logging

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ],
});
```

## 📊 Performance Benchmarks

### Expected Performance:

```
Response Time: < 500ms
Uptime: > 99.9%
Throughput: 100+ requests/second
Memory Usage: < 100MB
```

### Monitoring Tools:

- **Uptime:** UptimeRobot, Pingdom
- **Performance:** New Relic, DataDog
- **Errors:** Sentry, Bugsnag
- **Analytics:** Google Analytics, Mixpanel

## 🚨 Troubleshooting

### Common Issues:

#### 1. API Key Issues
```
Error: API key invalid
Solution: Kiểm tra GOOGLE_CLOUD_API_KEY trong environment variables
```

#### 2. CORS Issues
```
Error: Access blocked by CORS
Solution: Thêm correct origin vào CORS config
```

#### 3. Memory Issues
```
Error: JavaScript heap out of memory
Solution: Optimize caching, add memory limits
```

#### 4. Rate Limiting
```
Error: Too many requests
Solution: Implement client-side throttling
```

## 📱 Mobile Optimization

### Progressive Web App (PWA):

Tạo `public/manifest.json`:

```json
{
  "name": "Google Translate App",
  "short_name": "Translator",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4285f4",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

Thêm Service Worker cho offline support.

## 🔐 Security Best Practices

### 1. Environment Variables
- Không commit API keys vào git
- Sử dụng .env files
- Rotate API keys định kỳ

### 2. API Security
- Implement rate limiting
- Validate input data
- Sanitize output

### 3. HTTPS
- Enforce HTTPS trong production
- Sử dụng security headers

## 💰 Cost Management

### Google Cloud Translation API:

```
Free Tier: 500,000 characters/month
Paid: $20 per 1M characters

Ước tính:
- 1 request = ~50 characters average
- 10,000 requests/month = ~500,000 characters = FREE
- 100,000 requests/month = ~5M characters = $100/month
```

### Optimization:
- Cache common translations
- Implement request deduplication
- Monitor usage dengan alerts

## 📈 Scaling Strategy

### Stage 1: Single Instance (Current)
```
Traffic: < 1000 users/day
Cost: $0-$20/month
Platform: Heroku/Vercel free tier
```

### Stage 2: Load Balancer
```
Traffic: 1000-10000 users/day  
Cost: $50-200/month
Platform: Multiple instances + CDN
```

### Stage 3: Microservices
```
Traffic: 10000+ users/day
Cost: $200+/month
Platform: Kubernetes + Database + Cache
```

## 🎯 Next Steps

### Immediate (Week 1):
1. ✅ Deploy lên 1 platform (Vercel recommended)
2. ✅ Configure environment variables
3. ✅ Test basic functionality
4. ✅ Setup monitoring

### Short-term (Month 1):
1. Implement caching
2. Add rate limiting  
3. Setup error monitoring
4. Optimize performance

### Long-term (Month 3+):
1. Add user authentication
2. Implement usage analytics
3. Add premium features
4. Scale infrastructure

---

## 🔗 Useful Links

- [Google Cloud Translation API Docs](https://cloud.google.com/translate/docs)
- [Heroku Deployment Guide](https://devcenter.heroku.com/articles/deploying-nodejs)
- [Vercel Node.js Guide](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**🎉 Happy Deploying!** 

Chọn platform phù hợp với nhu cầu và budget của bạn. Vercel được khuyến nghị cho beginners vì setup đơn giản và performance tốt.