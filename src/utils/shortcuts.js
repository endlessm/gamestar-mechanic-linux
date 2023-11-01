const prompt = require('electron-prompt');

const registerShortcuts = (mainWindow) => {
  mainWindow.webContents.on('before-input-event', async (event, input) => {
    if (input.alt && (input.control || input.meta) && input.code === 'KeyG') {
      event.preventDefault();
      const url = await prompt({
        title: 'Dev mode',
        label: 'Env url:',
        alwaysOnTop: true,
        value: 'http://dev.gamestarmechanic.com/',
      });

      mainWindow.webContents.send('newTab', { url, readonlyUrl: false });
    }
  });
};

module.exports = {
  registerShortcuts,
};
