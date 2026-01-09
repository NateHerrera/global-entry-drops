export const handleNotification = (activeAppointments) => {
    if (activeAppointments.length > 0) {
        createNotification(activeAppointments[0])
    }
}

const createNotification = (activeAppointments) => {
    chrome.notifications.create({
        title: "Global Entry Drops",
        message: `Found an open interview at ${activeAppointments.timestamp}`,
        iconUrl: "./images/icon-128.png",
        type: "basic"
    })
}