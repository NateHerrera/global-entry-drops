// elements
const locationIDElement = document.getElementById("locationID")
const startDateElement = document.getElementById("startDate")
const endDateElement = document.getElementById("endDate")

// button elements
const startBtn = document.getElementById("startBtn")
const stopBtn = document.getElementById("stopBtn")

startBtn.onclick = () => {
    const prefs = {
        locationID: locationIDElement.value,
        startDate: startDateElement.value,
        endDate: endDateElement.value
    }
    chrome.runtime.sendMessage({ event: 'onStart', prefs })
}
stopBtn.onclick = () => {
    chrome.runtime.sendMessage({ event: 'onStop' })
}

chrome.storage.local.get(["locationID", "startDate", "endDate"], (result) => {
    const { locationID, startDate, endDate } = result;

    if (result != null) {
        locationIDElement.value = locationID
        startDateElement.value = startDate
        endDateElement.value = endDate
    }
})