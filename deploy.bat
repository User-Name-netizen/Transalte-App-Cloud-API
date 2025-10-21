@echo off
REM Deploy script cho Vercel trên Windows
REM Chạy script này để deploy lên Vercel

echo 🚀 Bắt đầu deploy Google Translate App lên Vercel...

REM Kiểm tra xem Vercel CLI đã được cài đặt chưa
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI chưa được cài đặt!
    echo Vui lòng chạy: npm install -g vercel
    pause
    exit /b 1
)

REM Kiểm tra file .env
if not exist .env (
    echo ⚠️  Không tìm thấy file .env
    echo Vui lòng tạo file .env với GOOGLE_CLOUD_API_KEY
    pause
    exit /b 1
)

REM Kiểm tra GOOGLE_CLOUD_API_KEY trong .env
findstr /c:"GOOGLE_CLOUD_API_KEY" .env >nul
if %errorlevel% neq 0 (
    echo ⚠️  Không tìm thấy GOOGLE_CLOUD_API_KEY trong file .env
    echo Vui lòng thêm GOOGLE_CLOUD_API_KEY vào file .env
    pause
    exit /b 1
)

echo ✅ Kiểm tra môi trường hoàn tất

REM Install dependencies
echo 📦 Cài đặt dependencies...
npm install

REM Deploy lên Vercel
echo 🌐 Deploy lên Vercel...
vercel --prod

echo.
echo 🎉 Deploy hoàn tất!
echo.
echo 📋 Checklist sau deploy:
echo   1. Kiểm tra trang web hoạt động
echo   2. Test các API endpoints
echo   3. Kiểm tra Environment Variables trong Vercel Dashboard
echo   4. Monitor logs với: vercel logs
echo.
echo 🔗 Truy cập Vercel Dashboard: https://vercel.com/dashboard

pause