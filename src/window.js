const { BrowserWindow, session } = require('electron');
const storage = require('electron-json-storage');
const { isWhiteListed } = require('./utils/whiteListDomains');

const createWindow = (initialUrl) => {
  initialUrl = initialUrl || 'https://gamestarmechanic.com';

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: 1200,
    height: 675,
    show: false,
    title: "Gamestar Mechanic",
    webPreferences: {
      plugins: true,
      enableRemoteModule: true,
      nodeIntegration: true,
      webviewTag: true,
    },
  });

  mainWindow.loadURL('about:blank');

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

    mainWindow.loadURL(initialUrl);

    mainWindow.show();
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
  
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    showURL(url, true);
  });

  mainWindow.webContents.once('did-attach-webview', () => {
    webContents.getAllWebContents().forEach((webcontents) => {
      webcontents.on('did-navigate', saveCookies);
    });
  });
};

const showURL = (url, newWindow = false) => {
  const allWindows = BrowserWindow.getAllWindows();
  const lastWindow = allWindows[allWindows.length-1];

  if (url && url.startsWith("gsm://"))
    url = url.replace('gsm://', 'https://');
  
  if (url && !isWhiteListed(url))
    return;

  if (newWindow || !lastWindow) {
    createWindow(url);
  } else {
    if (url)
      lastWindow.loadURL(url);
    if (lastWindow.isMinimized())
      lastWindow.restore();
    lastWindow.focus();
  }
}

module.exports = { showURL };

