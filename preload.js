// PMĐ Chat — preload bridge
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  resizeWindow: (size) => ipcRenderer.invoke('resize-window', size),
  hideWindow: () => ipcRenderer.invoke('hide-window'),
  startScreenshot: () => ipcRenderer.invoke('start-screenshot'),
  screenshotResult: (dataUrl) => ipcRenderer.invoke('screenshot-result', dataUrl),
  cancelScreenshot: () => ipcRenderer.invoke('cancel-screenshot'),
  moveWindowBy: (dx, dy) => ipcRenderer.invoke('move-window-by', { dx, dy }),
  readClipboard: () => ipcRenderer.invoke('read-clipboard'),
  onScreenshotData: (cb) => {
    ipcRenderer.on('screenshot-data', (_e, data) => cb(data));
  },
  onAddAttachment: (cb) => {
    ipcRenderer.on('add-attachment', (_e, data) => cb(data));
  },
});
