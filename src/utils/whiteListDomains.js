const { shell } = require('electron');
const url = require('url');

const whitelistRegex = /gamestarmechanic\.com|amazonaws\.com|cloudfront\.net/ig;

const isWhiteListed = (link) => {
  const parsedUrl = url.parse(link);
  whitelistRegex.lastIndex = 0;
  const isAllowed = (whitelistRegex.test(parsedUrl.hostname) || link.includes('sites.google.com/a/elinemedia.com') || link.startsWith('file://')) && !parsedUrl.pathname.endsWith('.pdf');
  if (!isAllowed) {
    shell.openExternal(link);
  }
  return isAllowed;
};

module.exports = { isWhiteListed };
