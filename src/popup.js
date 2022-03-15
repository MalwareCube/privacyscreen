//Variables/////////////////////////////////////////////////////////////

//Close Icon
const aclose = document.querySelector("#actionNavClose");

//Option Icons
const optionIcons = document.querySelectorAll(".actionOptionsOption");






//Functions////////////////////////////////////////////////////////////


//INIT: Get Current Domain Name, Apply Rendering
function fetchTab() {
    browser.tabs.query({currentWindow: true, active: true})
    .then((tab) => {
      let url = new URL(tab[0].url)
      let domain = url.hostname

      //If it returns an empty string, set it to Invalid Domain
      if(!domain) {
        domain = "Invalid URL"
    }

    //Fill in UI
    //If Invalid Domain, render different content
    if(domain === "Invalid URL") {
        actionDomainCom.textContent = domain;
        document.querySelector("#domainStatusIndicator").textContent = "PrivacyScreen requires a valid URL."
        actionDomainToggle.checked = false;
        actionDomainToggle.disabled = true;
    } else {
        //If it IS a valid domain
        //First, check storage array to see if there's an entry config that matches it
            //Apply styles accordingly

        //Else, if it doesn't have a config, render enabled by default:
        actionDomainCom.textContent = domain;
        domainDesc.textContent = domain;
    }

  })
}

//Handle Enable/Disable Domain Checkbox Switch
//Get current domain name
//Update or create storage value array for domain



//INIT: Get Options Values from Local Storage, else enable it
function fetchOptions() {
    optionIcons.forEach(option => {
        const optionData = option.dataset.option
        
            //First, get the previous storage state
            let prevState = browser.storage.local.get([optionData]);
            prevState.then((prevResult) => {

            //If NOT undefined
            if(prevResult[optionData] === true || prevResult[optionData] === false) {

                if(prevResult[optionData] === true) {
                    //remove selected classlist (it's backwards I know)
                    option.classList.remove("actionOptionsOptionSelected");
                } else {
                    //add selected classlist (it's backwards I know)
                    option.classList.add("actionOptionsOptionSelected");
                }
            } else {
                //If it is undefined / not set, set to true
                browser.storage.local.set({[optionData]: true});
                //remove selected classlist (it's backwards I know)
                option.classList.remove("actionOptionsOptionSelected");
            }
            })
    })
}









//INIT: Fetch the current domain's disabledDomains status and render checkbox accordingly
function fetchDomainStatus() {
    //When init, fetch the value for disabledDomains
    let disabledDomains = browser.storage.local.get("disabledDomains");
    disabledDomains.then((result) => {

        //If it exists, fill it in
        disabledDomainsRes = result.disabledDomains
        
        if(disabledDomainsRes) {

            //Grab Current Domain
        browser.tabs.query({currentWindow: true, active: true})
        .then((tab) => {
        let url = new URL(tab[0].url)
        let domain = url.hostname

        //If domain is valid / not empty string
        if(domain) {
            //If the array contains current domain
            if(disabledDomainsRes.includes(domain)) {
            actionEnabledID.classList.add("actionDisabled");
            actionEnabledID.classList.remove("actionEnabled");
            actionEnabledID.textContent = "disabled";
            actionDomainToggle.checked = false;
            } else {
            //Else, set to enabled
            actionEnabledID.classList.remove("actionDisabled");
            actionEnabledID.classList.add("actionEnabled");
            actionEnabledID.textContent = "enabled";
            actionDomainToggle.checked = true;
                }
            }
        })
        } else {
        //Else, set to enabled
        actionEnabledID.classList.remove("actionDisabled");
        actionEnabledID.classList.add("actionEnabled");
        actionEnabledID.textContent = "enabled";
        actionDomainToggle.checked = true;        
        }
        })
}







//Event Listeners/////////////////////////////////////////////////////

//Close Icon - Click - Close the Action Panel
aclose.addEventListener('click', event => {
    window.close();
})

//Option Icons - Click - Toggle options in the Action Panel (For Each)
optionIcons.forEach(option => {
    option.addEventListener('click', event => {
        const optionData = option.dataset.option

        
        //First, get the previous storage state
            let prevState = browser.storage.local.get([optionData]);
            prevState.then((prevResult) => {

            //If NOT undefined
            if(prevResult[optionData] === true || prevResult[optionData] === false) {
            //If previous state is true, then now set false
            if(prevResult[optionData] === true) {
                browser.storage.local.set({[optionData]: false});
                
                //Add selected classlist (it's backwards I know)
                option.classList.add("actionOptionsOptionSelected");
            } else {
                browser.storage.local.set({[optionData]: true});
                
                //remove selected classlist (it's backwards I know)
                option.classList.remove("actionOptionsOptionSelected");
            }
            } else {
                //if it IS undefined, set it to false (since everything's enabled by default)
                browser.storage.local.set({[optionData]: false});

                //Add selected classlist (it's backwards I know)
                option.classList.add("actionOptionsOptionSelected");
            }
            })
    })
})







//Toggle Domain Check
document.querySelector("#actionDomainToggle").addEventListener('click', event => {
    let actionEnabledID = document.querySelector("#actionEnabledID");
    
    if(event.target.checked) {
        //Front End Changes
       actionEnabledID.classList.remove("actionDisabled");
       actionEnabledID.classList.add("actionEnabled");
       actionEnabledID.textContent = "enabled";
       actionDomainToggle.checked = true;

       //Storage Changes
       //Run through the async process of getting the current domain again
       browser.tabs.query({currentWindow: true, active: true})
       .then((tab) => {
         let url = new URL(tab[0].url)
         let domain = url.hostname
    
         //If it's not an empty string, filter/remove it from the disabledList array
         if(domain) {
            //Get disabledDomains array, test if it exists
            let disabledDomains = browser.storage.local.get("disabledDomains");
            disabledDomains.then((result) => {
            let disabledDomainsRes = result.disabledDomains
            if(disabledDomainsRes) {
                //Remove it from array
                let ddcopy = disabledDomainsRes.filter((item) => item !== domain);
                browser.storage.local.set({"disabledDomains": ddcopy});
            }
            })
        }
    })
       
    //If UNchecked (disabled)
    } else  {
        //Front End
        actionEnabledID.classList.add("actionDisabled");
        actionEnabledID.classList.remove("actionEnabled");
        actionEnabledID.textContent = "disabled";
        actionDomainToggle.checked = false;

        //Storage Changes
        //Run through the async process of getting the current domain again
        browser.tabs.query({currentWindow: true, active: true})
        .then((tab) => {
          let url = new URL(tab[0].url)
          let domain = url.hostname
     
        //If it's not an empty string, add it to or create disabledList array
          if(domain) {
             //Get disabledDomains array, test if it exists
             let disabledDomains = browser.storage.local.get("disabledDomains");
             disabledDomains.then((result) => {
             let disabledDomainsRes = result.disabledDomains
            
             //if exists, add domain to it
             if(disabledDomainsRes) {
                let ddcopy = disabledDomainsRes;
                ddcopy.push(domain)
                browser.storage.local.set({"disabledDomains": ddcopy});
                } else {
                 //if doesn't exist, create an array with domain as first index
                 browser.storage.local.set({"disabledDomains": [domain]});
             }
             })
         }
     })



    }

})




//Init
fetchTab();
fetchOptions();
fetchDomainStatus();
