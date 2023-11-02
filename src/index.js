const { app } = require('electron');
const prompt = require('electron-prompt');
const path = require('path');
const { showURL } = require('./window');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

let pluginsDir;
pluginsDir = process.env.GAMESTAR_PLUGINS_PATH || path.join(__dirname, 'plugins');

let flashPluginName;
switch (process.platform) {
  case 'win32':
    flashPluginName = 'pepflashplayer.dll';
    break;
  case 'darwin':
    flashPluginName = 'PepperFlashPlayer.plugin';
    break;
  case 'linux':
    flashPluginName = 'libpepflashplayer.so';
    break;
}

app.commandLine.appendSwitch(
  'ppapi-flash-path',
  path.join(pluginsDir, flashPluginName),
);
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('disable-site-isolation-trials');
app.commandLine.appendSwitch('auto-detect', 'false');
app.commandLine.appendSwitch('no-proxy-server');

if (!app.isDefaultProtocolClient('gsm')) {
  app.setAsDefaultProtocolClient('gsm');
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory, additionalData) => {
    const urlArg = commandLine[1];
    showURL(urlArg);
  });
  
  app.whenReady().then(() => {
    const urlArg = process.argv[1];
    showURL(urlArg);
  });
}

app.on('open-url', (event, url) => {
  showURL(url);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  app.quit();
});

app.on('login', async (event, webContents, request, authInfo, callback) => {
  event.preventDefault();
  const username = await prompt({
    title: 'Basic Auth',
    label: 'username:',
    alwaysOnTop: true,
  });
  const password = await prompt({
    title: 'Basic Auth',
    label: 'password:',
    alwaysOnTop: true,
  });

  callback(username, password);
});
