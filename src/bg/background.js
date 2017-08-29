/**
 * Taken from https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Match_patterns
 * 
 * Transforms a valid match pattern into a regular expression
 * which matches all URLs included by that pattern.
 *
 * @param  {string}  pattern  The pattern to transform.
 * @return {RegExp}           The pattern's equivalent as a RegExp.
 * @throws {TypeError}        If the pattern is not a valid MatchPattern
 */

// matches all valid match patterns (except '<all_urls>')
// and extracts [ , scheme, host, path, ]
const matchPattern = (/^(?:(\*|http|https|file|ftp|app):\/\/([^\/]+|)\/?(.*))$/i);

function matchPatternToRegExp(pattern) {
  if (pattern === '<all_urls>') {
    return (/^(?:https?|file|ftp|app):\/\//);
  }
  const match = matchPattern.exec(pattern);
  if (!match) {
    throw new TypeError(`"${ pattern }" is not a valid MatchPattern`);
  }
  const [ , scheme, host, path, ] = match;
  return new RegExp('^(?:'
    + (scheme === '*' ? 'https?' : escape(scheme)) + ':\\/\\/'
    + (host === '*' ? "[^\\/]*" : escape(host).replace(/^\*\./g, '(?:[^\\/]+)?'))
    + (path ? (path == '*' ? '(?:\\/.*)?' : ('\\/' + escape(path).replace(/\*/g, '.*'))) : '\\/?')
    + ')$');
}

/** End Mozilla code */

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type == 'request') {
      chrome.permissions.request({
        origins: request.gain_access
      });
      sendResponse();
    } else if (request.type == 'end') {
      chrome.permissions.getAll(
        function (permissions) {
          for (var i = 0; i < permissions.origins.length; i++) {
            if (response.origins[i] != 'https://*.herokuapp.com/*') {
              chrome.permissions.remove({
                origins: [response.origins[i]]
              });
            }
          }
        }
      );
      sendResponse();
    } else if (request.type == 'list') {
      chrome.permissions.getAll(
        function (permissions) {
          sendResponse(permissions);
        }
      );
    };
    return true;
  }
);

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {
    chrome.permissions.getAll(
      function (permissions) {
        for (var i = 0; i < permissions.origins.length; i++) {
          if (tab.url.match(matchPatternToRegExp(permissions.origins[i]))) {
            if (permissions.origins[i] == 'https://*.herokuapp.com/*') {
              // The herokuapp origin is the only one where dallinger experiments
              // can live
              if (tab.url.indexOf('https://dlgr-')) {
                // Only inject the dallinger admin script if using https and on
                // a dlgr-*.herokuapp.com domain
                chrome.tabs.executeScript(null, {file: "src/inject/inject-dlgr.js"});                
              }
            } else {
              // Otherwise, inject the watcher script
              chrome.pageAction.show(tabId);
              chrome.tabs.executeScript(null, {file: "src/inject/inject-mitm.js"});
            }
          }
        }
      }
    );
  }
})