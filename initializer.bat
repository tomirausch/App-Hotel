@echo off
:: --- CONFIGURACION ---
set URL=http://localhost:3000
set CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"
set SIGNAL_FILE="%TEMP%\senal_apagar.txt"
set PS_FILE="%TEMP%\loading.ps1"

:: 1. LIMPIEZA PREVIA (Importante para evitar errores)
if exist %SIGNAL_FILE% del %SIGNAL_FILE%
if exist %PS_FILE% del %PS_FILE%

:: --- 2. GENERAR EL CARTEL DE CARGA ---
echo Add-Type -AssemblyName System.Windows.Forms > %PS_FILE%
echo Add-Type -AssemblyName System.Drawing >> %PS_FILE%
echo $f = New-Object System.Windows.Forms.Form >> %PS_FILE%
echo $f.Text = "Cargando..." >> %PS_FILE%
echo $f.Size = New-Object System.Drawing.Size(350, 120) >> %PS_FILE%
echo $f.StartPosition = "CenterScreen" >> %PS_FILE%
echo $f.FormBorderStyle = "FixedDialog" >> %PS_FILE%
echo $f.ControlBox = $false >> %PS_FILE%
echo $f.TopMost = $true >> %PS_FILE%
echo $l = New-Object System.Windows.Forms.Label >> %PS_FILE%
echo $l.Text = "Iniciando Sistema... Por favor espere." >> %PS_FILE%
echo $l.Font = New-Object System.Drawing.Font("Segoe UI", 10) >> %PS_FILE%
echo $l.AutoSize = $false >> %PS_FILE%
echo $l.Size = New-Object System.Drawing.Size(300, 50) >> %PS_FILE%
echo $l.Location = New-Object System.Drawing.Point(25, 30) >> %PS_FILE%
echo $f.Controls.Add($l) >> %PS_FILE%
echo $t = New-Object System.Windows.Forms.Timer >> %PS_FILE%
echo $t.Interval = 500 >> %PS_FILE%
echo $t.Add_Tick({ if (Test-Path %SIGNAL_FILE%) { $f.Close() } }) >> %PS_FILE%
echo $t.Start() >> %PS_FILE%
echo $f.ShowDialog() ^| Out-Null >> %PS_FILE%

:: --- 3. LANZAR EL CARTEL (SILENCIOSO) ---
:: start /MIN hace que la ventana arranque minimizada.
:: -WindowStyle Hidden hace que PowerShell se oculte de la barra de tareas.
start "" /MIN powershell -WindowStyle Hidden -ExecutionPolicy Bypass -File %PS_FILE%

:: --- 4. INICIAR SERVIDORES (BACKEND) ---
cd Back-TP-Deso
start "" /B cmd /c "mvnw.cmd spring-boot:run > ../log_backend.txt 2>&1"
cd ..

:: --- 5. INICIAR SERVIDORES (FRONTEND) ---
cd Front-TP-Deso
if not exist "node_modules" call npm install
start "" /B cmd /c "npm.cmd run dev > ../log_frontend.txt 2>&1"
cd ..

:: --- 6. ESPERA INTELIGENTE ---
:wait_back
timeout /t 2 /nobreak >nul
curl -s --head http://localhost:8080 >nul 2>&1
if %errorlevel% neq 0 goto wait_back

:wait_front
timeout /t 1 /nobreak >nul
curl -s --head http://localhost:3000 >nul 2>&1
if %errorlevel% neq 0 goto wait_front

:: --- 7. LANZAMIENTO ---
:: Matamos el cartel visualmente
echo YA > %SIGNAL_FILE%
timeout /t 1 /nobreak >nul

:: Abrimos la App en Pantalla Completa
%CHROME_PATH% --app=%URL% --user-data-dir="%TEMP%\HotelAppProfile" --start-maximized

:: --- 8. CIERRE FINAL ---
:: Esto ocurre cuando cierras la ventana de la App
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM java.exe >nul 2>&1
if exist %SIGNAL_FILE% del %SIGNAL_FILE%
if exist %PS_FILE% del %PS_FILE%

exit