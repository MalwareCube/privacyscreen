//Listen for changes to the localstorage options and reload the extension if so
browser.storage.onChanged.addListener(() => {
    browser.runtime.reload()
});


//Receive message, update icon
browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.from == "disabled") {
    //Icon Update for specific tab
     browser.tabs.query({active: true, currentWindow: true}, ([tab]) => {
        browser.browserAction.setIcon({tabId: tab.id, path: "/src/icons/icon19-grey.png"});
      });
    }

    if (message.from == "enabled") {
      //Icon Update for specific tab
       browser.tabs.query({active: true, currentWindow: true}, ([tab]) => {
          browser.browserAction.setIcon({tabId: tab.id, path: "/src/icons/icon19.png"});
        });
      }
});