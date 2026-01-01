chrome.runtime.onInstalled.addListener(details => {
    console.log("onInstalled reason:", details.reason)
})


chrome.runtime.onMessage.addListener(data => {
    const { event, prefs } = data
    switch (event) {
        case 'onStop':
            handleOnStop();
            break;
        case 'onStart':
            handleOnStart(prefs);
            break;
        default:
            break;
    }
})



const handleOnStop = () => {
    console.log("On stop in bacground")
}

const handleOnStart = (prefs) => {
    console.log("On start in background")
    console.log("prefs recieved: ", prefs)
    chrome.storage.local.set(prefs)
}