const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  connectDB: (config) => ipcRenderer.invoke('db:connect', config),
  disconnectDB: () => ipcRenderer.invoke('db:disconnect'),
  runQuery: (query) => ipcRenderer.invoke('db:runQuery', query),
  getSchemaInfo: () => ipcRenderer.invoke('db:getSchemaInfo'),
  startLocalDB: () => ipcRenderer.invoke('db:startLocal'),
});
