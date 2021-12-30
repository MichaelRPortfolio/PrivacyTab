let hotkeyInput = document.getElementById('inputhotkey');
let saveButton = document.getElementById('savebutton');
let resetButton = document.getElementById('resetbutton');


let newHotkey = ['Shift', 'L'];

chrome.storage.local.get(['lockkey'], result=>{if(typeof result.lockkey !== 'undefined'){newHotkey = result.lockkey; hotkeyInput.value = `${newHotkey[0]} + ${newHotkey[1]}`}});


hotkeyInput.addEventListener('keypress', e=>{
        e.preventDefault();

        newHotkey = [];
        newHotkey.push('Shift')
        newHotkey.push(e.code[3]);

        hotkeyInput.value = `${newHotkey[0]} + ${newHotkey[1]}`
})

saveButton.onclick = saveHotKey;
resetButton.onclick = ()=>{
        newHotkey = ['Shift', 'L'];
        hotkeyInput.value = `${newHotkey[0]} + ${newHotkey[1]}`;
        chrome.storage.local.set({'lockkey':newHotkey});
};


function saveHotKey(){
        chrome.storage.local.set({'lockkey':newHotkey});
}

