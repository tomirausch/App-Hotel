@echo off
:: Le ponemos un título a la ventana para identificarla fácil
title CrudApp - FullStack Environment

echo ==========================================
echo    INICIANDO JAVA SPRING BOOT + NEXTJS
echo ==========================================
echo.

:: 1. Entramos a la carpeta donde está el package.json con el script
cd Front-TP-Deso

:: 2. Ejecutamos el script de concurrently
call npm run dev:full

:: 3. Pausa por si hay un error al inicio, para que la ventana no se cierre sola
if errorlevel 1 pause