// Salt Desktop — Electron main process. Boots the bundled local server, then
// opens the DJ app in a native window. Fully offline; guests on the same wifi
// can reach the request page at the laptop's LAN IP (shown in the app).
const { app, BrowserWindow, Menu, shell, dialog } = require("electron");
const server = require("./server");

let win = null;
let info = null;

async function createWindow() {
  info = await server.start(4599).catch(async () => server.start(0)); // fixed port, fall back to random

  win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 680,
    backgroundColor: "#060B11",
    title: "Salt",
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  });

  win.loadURL(`http://127.0.0.1:${info.port}/demo/salt.html`);

  // open external links (help, etc.) in the system browser, not the app window
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http://127.0.0.1")) return { action: "allow" };
    shell.openExternal(url);
    return { action: "deny" };
  });

  const template = [
    { label: app.name, submenu: [
      { label: "About Salt", click: () => dialog.showMessageBox(win, {
        type: "info", title: "Salt",
        message: "Salt — DJ Set Intelligence",
        detail: `Running locally — no internet required.\n\nGuests can request songs at:\nhttp://${info.lan}:${info.port}/demo/request.html\n\n(Make sure guests are on the same wifi.)`,
      }) },
      { type: "separator" }, { role: "hide" }, { role: "quit" },
    ]},
    { label: "Edit", submenu: [ { role: "undo" }, { role: "redo" }, { type: "separator" }, { role: "cut" }, { role: "copy" }, { role: "paste" }, { role: "selectAll" } ] },
    { label: "View", submenu: [ { role: "reload" }, { role: "togglefullscreen" }, { role: "toggleDevTools" }, { type: "separator" }, { role: "resetZoom" }, { role: "zoomIn" }, { role: "zoomOut" } ] },
    { label: "Requests", submenu: [
      { label: "Show guest request address", click: () => dialog.showMessageBox(win, {
        type: "info", title: "Guest requests",
        message: "Guests request from their phones here:",
        detail: `http://${info.lan}:${info.port}/demo/request.html\n\nThey must be on the same wifi as this computer. The Requests tab in Salt shows a QR code for this address.`,
      }) },
    ]},
    { role: "windowMenu" },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  win.on("closed", () => { win = null; });
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
