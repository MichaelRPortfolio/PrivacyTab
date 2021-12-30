let unlockPin = '';

function updateTab(){
    chrome.storage.local.get()
        try{
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, {action: "Update", pin: unlockPin, url: chrome.runtime.getURL('icon.png')}, function(response){
                    if(typeof response !== 'undefined' && response.lockStatus == true){
                        console.log(`End Recieved! {lockStatus: ${response.lockStatus}, pinPad: '${response.pinPad}'}`);
                        chrome.tabs.update(tabs[0].id, {"muted": true});
                    }else if(typeof response !== 'undefined' && response.lockStatus == false){
                        console.log(`End Recieved! {lockStatus: ${response.lockStatus}, pinPad: '${response.pinPad}'}`);
                        chrome.tabs.update(tabs[0].id, {"muted": false});
                    }
                }); 
            })
        }catch(err){console.log('End not Recieved! ' + err)};
}


chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        title: "Lock Page with PrivacyTab",
        contexts:["page"],  // ContextType
        visible: true,
        id: 'Lock Page'
    });


    chrome.tabs.create({ url: './onboarding.html' });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if(!tab.url.includes('chrome://')){
        updateTab();
    }else{
        console.log('ERROR: Unable to access chrome:// address tab >>> ' + tab.url);
    }
})

chrome.action.onClicked.addListener((tab) => {
    if(!tab.url.includes('chrome://')){
        updateTab();
    }else{
        console.log('ERROR: Unable to access chrome:// address tab >>> ' + tab.url);
    }
})