// elements
const locationIDElement = document.getElementById("locationID")
const startDateElement = document.getElementById("startDate")
const endDateElement = document.getElementById("endDate")

// button elements
const startBtn = document.getElementById("startBtn")
const stopBtn = document.getElementById("stopBtn")

// start and stop span elements
const runningSpan = document.getElementById("runningSpan")
const stopSpan = document.getElementById("stopSpan")

// error message
const locationIDError = document.getElementById("locationIDError")
const startDateError = document.getElementById("startDateError")
const endDateError = document.getElementById("endDateError")

const hideElement = (elem) => {
    elem.style.display = "none"
}

const showElement = (elem) => {
    elem.style.display = ""
}

const disableElement = (elem) => {
    elem.disabled = true
}

const enableElement = (elem) => {
    elem.disabled = false
}

const handleOnStartState = () => {
    // spans
    showElement(runningSpan)
    hideElement(stopSpan)
    // buttons
    disableElement(startBtn)
    enableElement(stopBtn)
    // inputs
    disableElement(locationIDElement)
    disableElement(startDateElement)
    disableElement(endDateElement)
}

const handleOnStopState = () => {
    // spans
    showElement(stopSpan)
    hideElement(runningSpan)
    // buttons
    disableElement(stopBtn)
    enableElement(startBtn)
    // inputs
    enableElement(locationIDElement)
    enableElement(startDateElement)
    enableElement(endDateElement)
}

const performOnStartValidations = () => {
    if (!locationIDElement.value) {
        showElement(locationIDError);
    }
    else {
        hideElement(locationIDError);
    }

    if (!startDateElement.value) {
        showElement(startDateError);
    }
    else {
        hideElement(startDateError);
    }

    if (!endDateElement.value) {
        showElement(endDateError);
    }
    else {
        hideElement(endDateError);
    }

    return locationIDElement.value && startDateElement.value && endDateElement.value
}

startBtn.onclick = () => {
    const allFieldsValid = performOnStartValidations();

    if (allFieldsValid) {
        handleOnStartState();
        const prefs = {
            locationID: locationIDElement.value,
            startDate: startDateElement.value,
            endDate: endDateElement.value,
            tzData: locationIDElement.options[locationIDElement.selectedIndex].getAttribute('data-tz')
        }
        chrome.runtime.sendMessage({ event: 'onStart', prefs })
    }
}

stopBtn.onclick = () => {
    handleOnStopState();
    chrome.runtime.sendMessage({ event: 'onStop' })
}

chrome.storage.local.get(["locationID", "startDate", "endDate", "locations", "isRunning"], (result) => {
    const { locationID, startDate, endDate, locations, isRunning } = result;

    setLocations(locations);

    if (locationID != null) locationIDElement.value = locationID;
    if (startDate != null) startDateElement.value = startDate;
    if (endDate != null) endDateElement.value = endDate;

    if (isRunning) {
        handleOnStartState();
    }
    else {
        handleOnStopState();
    }
});

const setLocations = (locations) => {
    locations.forEach(location => {
        let optionElement = document.createElement("option");
        optionElement.value = location.id
        optionElement.innerHTML = location.name
        optionElement.setAttribute('data-tz', location.tzData)
        locationIDElement.appendChild(optionElement);
    })
}