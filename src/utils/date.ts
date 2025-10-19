const dateOptions = {
	date: {
		locale: "en",
		   options: {
			   day: "numeric" as const,
			   month: "short" as const,
			   year: "numeric" as const,
		   },
	},
};

const dateFormat = new Intl.DateTimeFormat(dateOptions.date.locale, dateOptions.date.options);

export function getFormattedDate(
	date: string | number | Date | null | undefined,
	options?: Intl.DateTimeFormatOptions,
): string {
	// Return empty string for invalid/missing dates instead of "Invalid Date"
	if (
		date === undefined ||
		date === null ||
		date === "" ||
		(typeof date === "number" && isNaN(date)) ||
		(typeof date === "string" && date.trim().toLowerCase() === "invalid date")
	) {
		return "";
	}

	// Parse the date
	const parsedDate = date instanceof Date ? date : new Date(date);

	// Check if parsing was successful
	if (isNaN(parsedDate.getTime())) {
		console.warn("getFormattedDate received unparsable date:", date);
		return "";
	}

	// Format the date
	if (typeof options !== "undefined") {
		return parsedDate.toLocaleDateString(dateOptions.date.locale, {
			...(dateOptions.date.options as Intl.DateTimeFormatOptions),
			...options,
		});
	}
	return dateFormat.format(parsedDate);
}

export function getFormattedDateWithTime(
	date: string | number | Date | null | undefined
): string {
	// Return empty string for invalid/missing dates
	if (date === undefined || date === null || date === "") {
		return "";
	}

	const ObjDate = new Date(date);

	// Check if parsing was successful
	if (isNaN(ObjDate.getTime())) {
		console.warn("getFormattedDateWithTime received unparsable date:", date);
		return "";
	}

	// Check if the date string contains a 'T' or if it's a number or Date object
	let showTime = false;
	if (typeof date === "string") {
		showTime = date.includes("T");
	} else {
		// For number or Date types, we assume time might be relevant
		showTime = true;
	}

	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "short",
		day: "numeric",
		...(showTime && { hour: "2-digit", minute: "2-digit", hour12: true }),
	};

	const formattedDate = ObjDate.toLocaleString("en-US", options);
	return formattedDate;
}

export function areDifferentDates(date1: string | number | Date, date2: string | number | Date) {
	const d1 = new Date(date1);
	const d2 = new Date(date2);

	// Compare only the date parts (year, month, and day)
	return (
		d1.getFullYear() !== d2.getFullYear() ||
		d1.getMonth() !== d2.getMonth() ||
		d1.getDate() !== d2.getDate()
	);
}
