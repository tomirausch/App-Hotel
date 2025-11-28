@echo off
:: --- CONFIGURACION ---
set URL=http://localhost:3000
set CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"

:: --- 1. INICIAR BACKEND (SPRING) ---
cd Back-TP-Deso
:: CAMBIO: Agregamos "" vacio y llamamos a mvnw.cmd explicitamente
start "" /B cmd /c "mvnw.cmd spring-boot:run > ../log_backend.txt 2>&1"

:: Volver a raiz
cd ..

:: --- 2. INICIAR FRONTEND (NEXT.JS) ---
cd Front-TP-Deso
if not exist "node_modules" call npm install
:: CAMBIO: Agregamos "" vacio y llamamos a npm.cmd explicitamente
start "" /B cmd /c "npm.cmd run dev > ../log_frontend.txt 2>&1"

:: Volver a raiz
cd ..

:: --- 3. ESPERAR ARRANQUE ---
timeout /t 15 /nobreak >nul

:: --- 4. LANZAR APLICACION ---
%CHROME_PATH% --app=%URL% --user-data-dir="%TEMP%\HotelAppProfile"

:: --- 5. APAGADO AUTOMATICO AL CERRAR ---
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM java.exe >nul 2>&1

exit