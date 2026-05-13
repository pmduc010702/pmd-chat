// PMĐ Chat — Electron main process
// by Phan Minh Đức
const { app, BrowserWindow, ipcMain, globalShortcut, Tray, Menu, screen, nativeImage, desktopCapturer, clipboard } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;
let screenshotWindow = null;
let isQuitting = false;

const BUBBLE = { width: 96, height: 96 };
const PANEL = { width: 420, height: 640 };
const MARGIN = 20;

function createWindow() {
  const display = screen.getPrimaryDisplay();
  const { width: sw, height: sh } = display.workAreaSize;

  mainWindow = new BrowserWindow({
    width: BUBBLE.width,
    height: BUBBLE.height,
    x: sw - BUBBLE.width - MARGIN,
    y: sh - BUBBLE.height - MARGIN,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: false,
    show: true,
    hasShadow: false,
    backgroundColor: '#00000000',
    title: 'PMĐ Chat',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  mainWindow.setAlwaysOnTop(true, 'screen-saver');

  mainWindow.on('close', (e) => {
    if (!isQuitting) { e.preventDefault(); mainWindow.hide(); }
  });
}

function createTray() {
  const iconPath = path.join(__dirname, 'assets', 'icon.png');
  let icon = nativeImage.createFromPath(iconPath);
  icon = icon.isEmpty() ? nativeImage.createEmpty() : icon.resize({ width: 16, height: 16 });

  tray = new Tray(icon);
  tray.setToolTip('PMĐ Chat — by Phan Minh Đức');

  const menu = Menu.buildFromTemplate([
    { label: 'Hiện cửa sổ', click: () => { mainWindow.show(); mainWindow.focus(); } },
    { label: 'Ẩn cửa sổ', click: () => mainWindow.hide() },
    {
      label: 'Chụp vùng màn hình', accelerator: 'CommandOrControl+Shift+S',
      click: () => startScreenshot(),
    },
    { type: 'separator' },
    {
      label: 'Always-on-top', type: 'checkbox', checked: true,
      click: (item) => mainWindow.setAlwaysOnTop(item.checked, 'screen-saver'),
    },
    { type: 'separator' },
    { label: 'PMĐ Chat — by Phan Minh Đức', enabled: false },
    { label: 'Thoát', click: () => { isQuitting = true; app.quit(); } },
  ]);
  tray.setContextMenu(menu);

  tray.on('click', () => {
    if (mainWindow.isVisible()) mainWindow.hide();
    else { mainWindow.show(); mainWindow.focus(); }
  });
}

async function startScreenshot() {
  if (screenshotWindow) return;

  const wasVisible = mainWindow.isVisible();
  if (wasVisible) mainWindow.hide();
  await new Promise(r => setTimeout(r, 200));

  try {
    const display = screen.getPrimaryDisplay();
    const { width, height } = display.size;
    const scale = display.scaleFactor || 1;

    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: Math.round(width * scale), height: Math.round(height * scale) },
    });

    if (sources.length === 0) {
      if (wasVisible) mainWindow.show();
      return;
    }

    const dataUrl = sources[0].thumbnail.toDataURL();

    screenshotWindow = new BrowserWindow({
      x: display.bounds.x, y: display.bounds.y,
      width, height,
      frame: false, transparent: false,
      alwaysOnTop: true, skipTaskbar: true,
      resizable: false, movable: false, hasShadow: false,
      backgroundColor: '#000000',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
      },
    });
    screenshotWindow.setAlwaysOnTop(true, 'screen-saver');
    screenshotWindow.setBounds({ x: display.bounds.x, y: display.bounds.y, width, height });
    screenshotWindow.loadFile(path.join(__dirname, 'renderer', 'screenshot.html'));

    screenshotWindow.webContents.once('did-finish-load', () => {
      screenshotWindow.webContents.send('screenshot-data', { dataUrl, width, height });
      screenshotWindow.focus();
    });

    screenshotWindow.on('closed', () => {
      screenshotWindow = null;
    });
  } catch (e) {
    console.error('Screenshot error:', e);
    if (wasVisible) mainWindow.show();
  }
}

function closeScreenshot(croppedDataUrl) {
  if (screenshotWindow) {
    screenshotWindow.close();
    screenshotWindow = null;
  }
  mainWindow.show();
  mainWindow.focus();
  if (croppedDataUrl) {
    mainWindow.webContents.send('add-attachment', {
      dataUrl: croppedDataUrl,
      mimeType: 'image/png',
      name: `screenshot-${Date.now()}.png`,
    });
  }
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  globalShortcut.register('CommandOrControl+Shift+Space', () => {
    if (mainWindow.isVisible() && mainWindow.isFocused()) mainWindow.hide();
    else { mainWindow.show(); mainWindow.focus(); }
  });
  globalShortcut.register('CommandOrControl+Shift+S', () => startScreenshot());
});

ipcMain.handle('resize-window', async (_e, { width, height }) => {
  if (!mainWindow) return;
  const [curX, curY] = mainWindow.getPosition();
  const [curW, curH] = mainWindow.getSize();
  const display = screen.getDisplayMatching({ x: curX, y: curY, width: curW, height: curH });
  const work = display.workArea;
  // Anchor by center so position user dragged to is preserved
  const cx = curX + curW / 2;
  const cy = curY + curH / 2;
  let newX = Math.round(cx - width / 2);
  let newY = Math.round(cy - height / 2);
  newX = Math.max(work.x + 4, Math.min(newX, work.x + work.width - width - 4));
  newY = Math.max(work.y + 4, Math.min(newY, work.y + work.height - height - 4));
  mainWindow.setBounds({ x: newX, y: newY, width, height }, false);
});

ipcMain.handle('hide-window', () => mainWindow?.hide());
ipcMain.handle('start-screenshot', () => startScreenshot());
ipcMain.handle('screenshot-result', (_e, dataUrl) => closeScreenshot(dataUrl));
ipcMain.handle('cancel-screenshot', () => closeScreenshot(null));

ipcMain.handle('move-window-by', (_e, { dx, dy }) => {
  if (!mainWindow) return;
  const [x, y] = mainWindow.getPosition();
  const [w, h] = mainWindow.getSize();
  const display = screen.getDisplayMatching({ x, y, width: w, height: h });
  const work = display.workArea;
  let nx = Math.round(x + dx);
  let ny = Math.round(y + dy);
  // Clamp to screen
  nx = Math.max(work.x, Math.min(nx, work.x + work.width - w));
  ny = Math.max(work.y, Math.min(ny, work.y + work.height - h));
  mainWindow.setPosition(nx, ny);
});

ipcMain.handle('read-clipboard', () => {
  try { return clipboard.readText(); } catch { return ''; }
});

app.on('window-all-closed', () => {
  if (process.platform === 'darwin') return;
});
app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('before-quit', () => { isQuitting = true; });
