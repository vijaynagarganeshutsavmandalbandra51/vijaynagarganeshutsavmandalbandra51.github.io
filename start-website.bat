@echo off
REM Builds the Angular site (if needed) and starts the ASP.NET Core server.
REM Then open http://localhost:5000 in your browser.
cd /d "%~dp0client"
if not exist node_modules (
  echo Installing Angular packages - first time only...
  call npm install || goto :error
)
echo Building website...
call npm run build:server || goto :error
cd /d "%~dp0server"
echo.
echo  Ganpati Bappa Morya!  Website running at http://localhost:5000
echo  Press Ctrl+C to stop.
echo.
dotnet run --launch-profile http
goto :eof
:error
echo Something went wrong. See the messages above.
pause
