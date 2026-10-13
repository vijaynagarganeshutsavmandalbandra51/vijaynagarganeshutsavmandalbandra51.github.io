#!/usr/bin/env bash
# Builds the Angular site (if needed) and starts the ASP.NET Core server.
# Then open http://localhost:5000 in your browser.
set -e
cd "$(dirname "$0")/client"
[ -d node_modules ] || npm install
npm run build:server
cd ../server
echo
echo " Ganpati Bappa Morya!  Website running at http://localhost:5000  (Ctrl+C to stop)"
echo
dotnet run --launch-profile http
