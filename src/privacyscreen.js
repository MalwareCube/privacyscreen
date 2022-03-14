//Global Variables
let xzlarrDomain = window.location.hostname
let domainIsDisabled


let allElements = document.querySelectorAll("input, select, textarea, span[data-text], span[data-text='true'], [contenteditable='true']");





////////////////////Set Default Values/////////////////////////////////////////
browser.storage.local.get(null, function(result) {
    if (result.activeBlur === undefined) {
        browser.storage.local.set({"activeBlur": false});
    }
    if (result.hotkeyBlur === undefined) {
        browser.storage.local.set({"hotkeyBlur": true});
    }
    if (result.hoverBlur === undefined) {
        browser.storage.local.set({"hoverBlur": true});
    }
    if (result.tabBlur === undefined) {
        browser.storage.local.set({"tabBlur": true});
    }

    if (result.disabledDomains === undefined) {
        browser.storage.local.set({"disabledDomains": []});
    }
});
////////////////////Default Values/////////////////////////////////////////








//Fetch disabled domains array and test if current hostname is included
let disabledDomains = browser.storage.local.get("disabledDomains");
disabledDomains.then((result) => {
    domainIsDisabled = result.disabledDomains.includes(xzlarrDomain)

//If the current domain is NOT disabled, perform the following
if(xzlarrDomain && !domainIsDisabled) {

    //[MAIN] - Blur all allElements//////////////////////////////
    for (let i=0; i < allElements.length; i++) {
        allElements[i].classList.add("xzlarrPrivacyScreenBlur");
    }
    //[MAIN]/////////////////////////////////////////////////////






    //1. Active Input Unblur Functionality///////////////////////
    ///////////////////////////////////////////////////////////////////////
    //Fetch activeBlur value
    let activeBlur = browser.storage.local.get("activeBlur");
    activeBlur.then((result) => {
    activeBlurEnabled = result.activeBlur

    if(!activeBlurEnabled) {

    //Un-blur Active Input Function
    function unBlurActive(element) {
            element.target.classList.remove("xzlarrPrivacyScreenBlur");
        }

        function blurActive(element) {
            element.target.classList.add("xzlarrPrivacyScreenBlur");
        }

        //Active Input Event Listeners
        for (let i = 0; i < allElements.length; i++) {
            allElements[i].addEventListener("focus", unBlurActive);
            allElements[i].addEventListener("blur", blurActive);
        }
    }
    }) // end of then()

    /////////////////////////////////////////////////////////////





    //2. Hover Unblur Functionality//////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    //Fetch hoverBlur value
    let hoverBlur = browser.storage.local.get("hoverBlur");
    hoverBlur.then((result) => {
    hoverBlurEnabled = result.hoverBlur

    if(hoverBlurEnabled) {

    function unBlurHover(element) {
            if (element.target.classList.contains("xzlarrPrivacyScreenBlur")) {
                element.target.classList.remove("xzlarrPrivacyScreenBlur");
            } else {
                element.target.classList.add("xzlarrPrivacyScreenBlur");
            }
        }
        
            //Hover Event Listeners
            for (let i = 0; i < allElements.length; i++) {
                allElements[i].addEventListener("mouseover", unBlurHover);
                allElements[i].addEventListener("mouseout", unBlurHover);
            }
        }

    }) // end of then()
    /////////////////////////////////////////////////////////////






    //3. Unfocused Tab Functionality///////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    //Fetch tabBlur value
    let tabBlur = browser.storage.local.get("tabBlur");
    tabBlur.then((result) => {
    tabBlurEnabled = result.tabBlur

    if(tabBlurEnabled) {
        window.onfocus = function() {
            document.querySelector("body").classList.remove("xzlarrDocumentBlur");
        };

        window.onblur = function() {
            document.querySelector("body").classList.add("xzlarrDocumentBlur");
        };
    }

    }) // end of then()


    ///////////////////////////////////////////////////////////////////






    //4. Hotkey Functionality///////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    //Fetch hotkeyBlur value
    let hotkeyBlur = browser.storage.local.get("hotkeyBlur");
    hotkeyBlur.then((result) => {
    hotkeyBlurEnabled = result.hotkeyBlur

    let key1 = false
    if(hotkeyBlurEnabled) {

        //First key => Alt (sets key1 to true)
        document.addEventListener("keydown", function(e) {
            if (e.key === "Alt") {
                key1 = true
                return key1
            };
        });

        //Key1 needs to be true, and THEN key 2 needs to be pressed (l or L)
        document.addEventListener("keydown", function(e) {
            if (key1 && (e.key === "l" || e.key === "L")) {
                document.querySelector("body").classList.toggle("xzlarrDocumentBlur");
            };
        });

        //If alt is let go, set key1 back to false
        document.addEventListener("keyup", function(e) {
            if (e.key === "Alt") {
                key1 = false
                return key1
            };
        });
}



    }) // end of then()

    ///////////////////////////////////////////////////////////////////


} else {
    //Remove base styles
    for (let i=0; i < allElements.length; i++) {
        allElements[i].classList.remove("xzlarrPrivacyScreenBlur");
    }

    //Send message to background.js to update icon
    browser.runtime.sendMessage({from:"disabled",message:"disabled"});
}

}) // end of .then()