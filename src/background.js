//Listen for changes to the localstorage options and reload the extension if so
browser.storage.onChanged.addListener(() => {
    browser.runtime.reload()
});


//Receive message, update icon
browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.from == "disabled") {
        browser.browserAction.setIcon({path: "/src/icons/icon19-grey.png"});
    }
});