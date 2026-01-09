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

const showDateError = (dateErrorElem, errorMessage) => {
    dateErrorElem.innerHTML = errorMessage;
    showElement(dateErrorElem);
}

const validateStartDate = (today, startDate) => {
    const isAfterToday = !startDate.isBefore(today, 'date');

    if (!startDateElement.value) {
        showDateError(startDateError, 'Please enter a valid start date.');
    }
    else if (!isAfterToday) {
        showDateError(startDateError, 'Start date must not be before today.');
    }
    else {
        hideElement(startDateError);
    }

    return startDateElement.value && isAfterToday
}

const validateEndDate = (today, startDate, endDate) => {
    const isAfterStartDate = endDate.isAfter(startDate, 'date');
    const isAfterToday = endDate.isAfter(today, 'date');

    if (!endDateElement.value) {
        showDateError(endDateError, 'Please enter a valid end date.')
    }
    else if (!isAfterStartDate) {
        showDateError(endDateError, 'End date must be after the start date.')
    }
    else if (!isAfterToday) {
        showDateError(endDateError, 'End date must be after today.')
    }
    else {
        hideElement(endDateError);
    }

    return endDateElement.value && isAfterToday && isAfterStartDate;
}

const validateDates = () => {
    // today <= start date < end date
    const today = spacetime.now().startOf('day');
    const startDate = spacetime(startDateElement.value).startOf('day');
    const endDate = spacetime(endDateElement.value).startOf('day');

    const isStartDateValid = validateStartDate(today, startDate);
    const isEndDateValid = validateEndDate(today, startDate, endDate);

    return isStartDateValid && isEndDateValid;
}

const performOnStartValidations = () => {
    const isDateValid = validateDates();

    if (!locationIDElement.value) {
        showElement(locationIDError);
    }
    else {
        hideElement(locationIDError);
    }

    return locationIDElement.value && isDateValid;
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

const today = spacetime.now().startOf('day').format();
startDateElement.setAttribute('min', today);
endDateElement.setAttribute('min', today);