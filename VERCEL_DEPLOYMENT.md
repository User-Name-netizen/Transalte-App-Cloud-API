# Hướng dẫn Deploy lên Vercel

## Chuẩn bị trước khi deploy

### 1. Cài đặt Vercel CLI

```bash
npm install -g vercel
```

### 2. Đăng nhập Vercel

```bash
vercel login
```

### 3. Kiểm tra Google Cloud API Key

Đảm bảo bạn có Google Cloud API Key hợp lệ trong file `.env`:

```
GOOGLE_CLOUD_API_KEY=your_actual_api_key_here
```

## Các bước deploy

### Bước 1: Khởi tạo dự án Vercel

**Tùy chọn A: Deploy từ Git (Khuyến nghị)**

1. Push code lên GitHub/GitLab/Bitbucket trước:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

2. Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New..." → "Project"
4. Import repository từ Git
5. Vercel sẽ tự động deploy mỗi khi có commit mới

**Tùy chọn B: Deploy trực tiếp từ local**

Từ thư mục root của project, chạy:
```bash
vercel
```

Khi được hỏi:
- "Set up and deploy"? → Y
- "Which scope"? → Chọn account của bạn
- "Link to existing project"? → N  
- "What's your project's name"? → google-translate-app
- "In which directory is your code located"? → ./

### Bước 2: Cấu hình Environment Variables

Sau khi deploy lần đầu, bạn cần thêm environment variables:

1. Truy cập Vercel Dashboard: https://vercel.com/dashboard
2. Chọn project "google-translate-app"
3. Vào tab "Settings" → "Environment Variables"
4. Thêm variable:
   - Name: `GOOGLE_CLOUD_API_KEY`
   - Value: API key thực của bạn
   - Environments: Production, Preview, Development

### Bước 3: Deploy lại với environment variables

```bash
vercel --prod
```

## Cấu trúc project cho Vercel

```
google-translate-app/
├── api/
│   └── index.js          # Entry point cho Vercel
├── public/               # Static files
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── src/
│   └── server.js         # Express server
├── vercel.json           # Vercel configuration
└── package.json
```

## File cấu hình quan trọng

### vercel.json

```json
{
  "version": 2,
  "name": "google-translate-app",
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
    },
    {
      "src": "/",
      "dest": "src/server.js"
    }
  ],
  "env": {
    "GOOGLE_CLOUD_API_KEY": "@google_cloud_api_key"
  },
  "functions": {
    "src/server.js": {
      "maxDuration": 30
    }
  }
}
```

### api/index.js

```javascript
// Vercel API entry point
const app = require("../src/server");
module.exports = app;
```

## Lệnh deploy nhanh

```bash
# Deploy development
vercel

# Deploy production
vercel --prod

# Xem logs
vercel logs

# Xem thông tin project
vercel ls
```

## Kiểm tra sau khi deploy

1. **Kiểm tra trang chủ**: Truy cập URL Vercel được cung cấp
2. **Test API endpoints**:
   - `GET /api/health` - Health check
   - `GET /api/languages` - Danh sách ngôn ngữ
   - `POST /api/translate` - Dịch text
   - `POST /api/detect` - Nhận diện ngôn ngữ

## Troubleshooting

### Lỗi thường gặp:

1. **API Key không hoạt động**:

   - Kiểm tra Environment Variables trong Vercel Dashboard
   - Đảm bảo API key chính xác và có quyền truy cập

2. **Function timeout**:

   - Đã cấu hình `maxDuration: 30` trong vercel.json

3. **Static files không load**:

   - Kiểm tra routing trong vercel.json
   - Đảm bảo files trong thư mục `public/`

4. **CORS errors**:
   - Server đã cấu hình CORS trong `src/server.js`

### Xem logs lỗi:

```bash
vercel logs --follow
```

## Production URL

Sau khi deploy thành công, bạn sẽ nhận được URL dạng:
`https://google-translate-app-xxx.vercel.app`

## Custom Domain (Optional)

Để sử dụng domain riêng:

1. Vào Vercel Dashboard → Settings → Domains
2. Thêm domain của bạn
3. Cấu hình DNS records theo hướng dẫn

## Monitoring

- Vercel cung cấp analytics tự động
- Xem metrics tại: Dashboard → Analytics
- Monitor function performance và errors
