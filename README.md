# Zuxell Technologies Website

A responsive, static marketing website for Zuxell Technologies. The project uses plain HTML, CSS, and JavaScript with a small dependency-free Node development server.

## Run in VS Code

Open **Run and Debug** (`Ctrl+Shift+D`), choose **Run website in Chrome** or **Run website in Edge**, and press `F5`. VS Code starts the local server, waits for its final URL, and attaches the browser debugger automatically.

## Run from a terminal

```powershell
npm start
```

The server prefers `http://127.0.0.1:8080`. If that port is occupied, it tries the next available nearby port and prints the final URL.

To request a specific port in PowerShell:

```powershell
$env:PORT=8090
npm start
```

## Validate

```powershell
npm test
```

The test command checks JavaScript syntax and HTTP behavior, starts an isolated server on an available port, launches a local headless Chrome or Edge browser, and tests navigation, responsive layouts, form validation, accessibility state, resource failures, and console errors.
