const {
  app, BrowserWindow, session, webContents, dialog
} = require('electron');
const prompt = require('electron-prompt');
const path = require('path');
const storage = require('electron-json-storage');
const log = require('electron-log');
const { isWhiteListed } = require('./utils/whiteListDomains');
const { registerShortcuts } = require('./utils/shortcuts');
let deepLink = null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

let pluginName;

switch (process.platform) {
  case 'win32':
    pluginName = 'plugins/pepflashplayer.dll';
    break;
  case 'darwin':
    pluginName = 'plugins/PepperFlashPlayer.plugin';
    break;
  case 'linux':
    pluginName = 'plugins/libflashplayer.so';
    break;
}

app.commandLine.appendSwitch(
  'ppapi-flash-path',
  path.join(__dirname, pluginName),
);
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('disable-site-isolation-trials');
app.commandLine.appendSwitch('auto-detect', 'false');
app.commandLine.appendSwitch('no-proxy-server');

if (!app.isDefaultProtocolClient('gsm')) {
  app.setAsDefaultProtocolClient('gsm');
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    show: false,
    webPreferences: {
      plugins: true,
      enableRemoteModule: true,
      nodeIntegration: true,
      webviewTag: true,
    },
  });

  mainWindow.loadURL(`file:///${__dirname}/app/index.html`);

  const loadCookies = async (error, cookie) => {
    if (error) { console.error(error); }

    if (Object.keys(cookie).length) {
      cookie.url = 'https://gamestarmechanic.com';
      cookie.path = '/';

      try {
        await session.defaultSession.cookies.set(cookie);
      } catch (e) {
        console.error(e);
      }
    }

    if (deepLink) {
      mainWindow.webContents.send('newTab', { url: deepLink });
    } else {
      mainWindow.webContents.send('newTab', { url: 'https://gamestarmechanic.com' });
    }

    mainWindow.show();
    registerShortcuts(mainWindow);
  };

  const saveCookies = async () => {
    try {
      const [cookies] = await mainWindow.webContents.session.cookies.get({ name: 'gsm_gamestarmechanic_com_session' });
      if (cookies) {
        storage.set('session_cookie', cookies);
      } else {
        storage.remove('session_cookie');
      }
    } catch (e) {
      console.error(e);
    }
  };

  mainWindow.once('ready-to-show', () => {
    storage.get('session_cookie', loadCookies);

    session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
      if (details.resourceType === 'mainFrame' && !isWhiteListed(details.url) && !details.url.startsWith('devtools')) {
        callback({ cancel: true });
      } else {
        callback({});
      }
    });
  });

  mainWindow.webContents.once('did-attach-webview', () => {
    webContents.getAllWebContents().forEach((webcontents) => {
      webcontents.on('did-navigate', saveCookies);
    });
  });

  app.on('open-url', (event, url) => {
    event.preventDefault();
    if (mainWindow.isDestroyed()) {
      createWindow();
    } else {

      mainWindow.webContents.send('newTab', { url: url.replace('gsm://', 'https://') });
    }
  });
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
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

app.on('will-finish-launching', () => {
  app.on('open-url', (event, url) => {
    event.preventDefault();
    deepLink = url.replace('gsm://', 'https://');
  });
});
