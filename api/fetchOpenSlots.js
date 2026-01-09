import { createNotification } from "../lib/createNotifications.js";

// Fetch the list of open interviews at a location in a given date period
export const fetchOpenSlots = (results) => {
	return new Promise((resolve, reject) => {
		//https://ttp.cbp.dhs.gov/schedulerapi/locations/9240/slots?startTimestamp=2023-02-11T00%3A00%3A00&endTimestamp=2023-03-22T00%3A00%3A00
		const { locationID, startDate, endDate } = results;
		const appointmentUrl = `https://ttp.cbp.dhs.gov/schedulerapi/locations/${locationID}/slots?startTimestamp=${startDate}T00%3A00%3A00&endTimestamp=${endDate}T00%3A00%3A00`;
		fetch(appointmentUrl)
			.then((response) => response.json())
			.then((data) => data.filter((slot) => slot.active > 0))
			.then((data) => resolve(data))
			.catch((error) => {
				console.log(error);
				reject();
			});
	});
};
