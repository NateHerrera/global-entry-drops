export const createNotification = (openSlot, numberOfSlots, prefs) => {
    const { tzData } = prefs;

    let message = ""
    if (numberOfSlots > 1) {
        message = `Found an open interview at ${openSlot.timestamp} (${tzData} timezone) and ${numberOfSlots - 1} additional open interviews`
    }
    else {
        message = `Found an open interview at ${openSlot.timestamp} (${tzData} timezone)`
    }

    chrome.notifications.create({
        title: "Global Entry Drops",
        message,
        iconUrl: "./images/icon-128.png",
        type: "basic"
    })
}

chrome.notifications.onClicked.addListener(() => {
    chrome.tabs.create({ url: "https://ttp.cbp.dhs.gov/schedulerui/schedule-interview/location?lang=en&vo=true&returnUrl=ttp-external&service=up" })
})