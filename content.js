let isLocked = false;
let originalTitle = '';
let originalHead = '';
let pin = '';
let attempts = 3;
let responseObj = {lockStatus: isLocked, pinPad: pin};

function lockTab(msgurl){
    isLocked = true;

    let newBody = document.createElement('body');
    let lockOverlay = document.createElement('div');
    let pInput = document.createElement('input');
    let titleOne = document.createElement('p');
    let titleTwo = document.createElement('p');


    newBody.style.cssText = 'width: 100vw; height: 100vh; overflow: hidden; margin: auto; padding: auto; background: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(35,35,35,1) 50%, rgba(0,0,0,1) 100%);'
    newBody.id = 'PrivacyBody';

    titleOne.textContent = 'Please Enter Pin Below';
    titleOne.style.cssText = 'font-family: Roboto, Arial, sans-serif; color: rgba(255,255,255,0.8); padding-top: 10%; padding-bottom: 0; background-color: rgba(100,100,100,0); font-size: 2vw; width: 35%; margin: auto; margin-top: 5%; text-align: center; font-weight: bolder; border-width: 0px 0px 0px 0px; border-style: solid; border-color: rgba(255,255,255,0.4); border-top-left-radius: 200px; border-top-right-radius: 200px;';
    titleOne.id = 'titleOne';

    titleTwo.textContent = 'Secured by PrivacyTab';
    titleTwo.style.cssText = 'font-family: Roboto, Arial, sans-serif; color: rgba(255,255,255,0.8); font-size: 2vw; width: 35%; margin: auto; text-align: center; font-weight: bolder;';

    lockOverlay.style.cssText = `display: flex; flex-wrap: wrap; width: 35%; height: 15%; background: linear-gradient(0deg, rgba(0,180,48,1) 0%, rgba(0,255,52,1) 50%, rgba(0,180,48,1) 100%); border-style: solid; border-width: 2px; border-color: rgba(155,155,155,1); margin: auto; margin-top: 15px; margin-bottom: 15px; box-shadow: inset 0px 0px 10px 5px black;`

    pInput.style.cssText = 'caret-color: rgba(55,55,55,0.4); color: white; font-family: Roboto, Arial, sans-serif; background: radial-gradient(circle, rgba(204,204,204,0.3) 0%, rgba(71,71,71,0.3) 87%, rgba(0,0,0,0.3) 100%); width: 100%; height: 100%; box-sizing:border-box; font-weight: bold; text-align: center; font-size: 3vw; border-style: none; border-color: rgba(155,155,155,1);';
    pInput.addEventListener("focus", function () {
        this.style.outline = "none";  
    });

    pInput.addEventListener("input", (e)=>{pin = pInput.value});
    pInput.type = 'password';
    pInput.id = 'pInput';
    pInput.placeholder = '';
    pInput.maxLength = 6;

    document.getElementsByTagName('body')[0].style.display = 'none';
    originalTitle = document.getElementsByTagName('head')[0].getElementsByTagName('title')[0].innerHTML;
    originalHead = document.getElementsByTagName('head')[0].innerHTML;
    document.getElementsByTagName('head')[0].innerHTML = `<title>Locked - PrivacyTab</title><link rel="icon" href="${msgurl}" type="image/x-icon">`;
    document.getElementsByTagName('html')[0].append(newBody);
    newBody.appendChild(titleOne);
    newBody.appendChild(lockOverlay);
    newBody.appendChild(titleTwo);
    lockOverlay.appendChild(pInput);
}

function unlockTab(unlockPin){
    if(pin == unlockPin && pin.length > 0){
        isLocked = false;
        document.getElementsByTagName('body')[0].style.display = 'initial';
        document.getElementById('PrivacyBody').remove();
        document.getElementsByTagName('head')[0].innerHTML = originalHead;
    }else if(pin.length == 0){
        alert(`Invalid Pin! Pin Empty.`);
    }else{
        attempts--;
        if(attempts > 0){
            alert(`Invalid Pin! ${attempts} Attempt(s) Left.`);
        }else{
            let title = document.getElementById('titleOne');
            let input = document.getElementById('pInput');
            title.textContent = 'Too Many Attempts';
            input.maxLength = 0;
            input.value = '';
            input.placeholder = 'LOCKED';
            input.style.cssText = 'caret-color: rgba(55,55,55,0); color: white; font-family: Roboto, Arial, sans-serif; background: linear-gradient(0deg, rgba(180,0,85,1) 0%, rgba(255,0,91,1) 50%, rgba(180,0,82,1) 100%); width: 100%; height: 100%; box-sizing:border-box; font-weight: bold; text-align: center; font-size: 3vw; border-style: none; border-color: rgba(155,155,155,1);'
        }
    }
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.action == 'Update' && !isLocked) {
        lockTab(msg.url);
        sendResponse(responseObj);
    }else if(msg.action == 'Update' && isLocked){
        unlockTab(msg.pin);
        //Send pinpad and wait for verification from background before unlockTab
        sendResponse(responseObj);
    }
});