#!/bin/bash

# Deploy script cho Vercel
# Chạy script này để deploy lên Vercel

echo "🚀 Bắt đầu deploy Google Translate App lên Vercel..."

# Kiểm tra xem Vercel CLI đã được cài đặt chưa
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI chưa được cài đặt!"
    echo "Vui lòng chạy: npm install -g vercel"
    exit 1
fi

# Kiểm tra file .env
if [ ! -f .env ]; then
    echo "⚠️  Không tìm thấy file .env"
    echo "Vui lòng tạo file .env với GOOGLE_CLOUD_API_KEY"
    exit 1
fi

# Kiểm tra GOOGLE_CLOUD_API_KEY trong .env
if ! grep -q "GOOGLE_CLOUD_API_KEY" .env; then
    echo "⚠️  Không tìm thấy GOOGLE_CLOUD_API_KEY trong file .env"
    echo "Vui lòng thêm GOOGLE_CLOUD_API_KEY vào file .env"
    exit 1
fi

echo "✅ Kiểm tra môi trường hoàn tất"

# Install dependencies
echo "📦 Cài đặt dependencies..."
npm install

# Chạy tests (nếu có)
echo "🧪 Chạy tests..."
npm test

# Deploy lên Vercel
echo "🌐 Deploy lên Vercel..."
vercel --prod

echo ""
echo "🎉 Deploy hoàn tất!"
echo ""
echo "📋 Checklist sau deploy:"
echo "  1. Kiểm tra trang web hoạt động"
echo "  2. Test các API endpoints"
echo "  3. Kiểm tra Environment Variables trong Vercel Dashboard"
echo "  4. Monitor logs với: vercel logs"
echo ""
echo "🔗 Truy cập Vercel Dashboard: https://vercel.com/dashboard"