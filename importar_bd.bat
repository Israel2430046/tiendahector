@echo off
echo ========================================
echo   Importando Base de Datos MariaDB
echo ========================================
echo.

cd /d "%~dp0"

echo Importando tienda_abarrotes.sql...
mysql -u root -pe2gk8ann86 < database\tienda_abarrotes.sql

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   Base de datos importada exitosamente!
    echo ========================================
    echo.
    echo Puedes iniciar el frontend con:
    echo   cd tienda-frontend
    echo   npm install
    echo   npm run dev
    echo.
) else (
    echo.
    echo ========================================
    echo   Error al importar la base de datos
    echo ========================================
    echo.
    echo Verifica que:
    echo 1. MariaDB este corriendo
    echo 2. Las credenciales sean correctas
    echo 3. El archivo SQL exista
    echo.
)

pause
