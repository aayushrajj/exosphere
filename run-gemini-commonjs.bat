@echo off
set GEMINI_API_KEY=AIzaSyDOdhAovqHzeo-T-ss8bK1CarZoomlG4Lw
npx ts-node -P tsconfig.test.json test-gemini-commonjs.ts
pause
