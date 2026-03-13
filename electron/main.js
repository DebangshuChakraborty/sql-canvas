const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('../backend/db');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false, // Don't show until maximized
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();
  });

  mainWindow.setMenu(null); // Removes the File, View, Window menu completely

  if (!app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
    // DevTools disabled per user request
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// IPC Handlers
ipcMain.handle('db:connect', async (event, config) => {
  try {
    await db.connect(config);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db:disconnect', async () => {
  try {
    await db.disconnect();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db:runQuery', async (event, query) => {
  try {
    const result = await db.runQuery(query);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db:getSchemaInfo', async () => {
  try {
    const result = await db.getSchemaInfo();
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db:startLocal', async () => {
  try {
    await db.startLocalDatabase();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

app.whenReady().then(createWindow);

let isQuitting = false;

app.on('before-quit', async (event) => {
  if (!isQuitting) {
    event.preventDefault(); // Prevent immediate quit
    isQuitting = true;
    try {
      // Disconnect automatically performs a COMMIT
      await db.disconnect();
    } catch (err) {
      console.error('Error during cleanup on quit:', err);
    }
    app.quit(); // Quit for real this time
  }
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
