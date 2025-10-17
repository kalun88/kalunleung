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
	date: string | number | Date,
	options?: Intl.DateTimeFormatOptions,
) {
	const parsedDate = new Date(date);
	if (!date || isNaN(parsedDate.getTime())) {
		return "Invalid Date";
	}
	if (typeof options !== "undefined") {
		return parsedDate.toLocaleDateString(dateOptions.date.locale, {
			...(dateOptions.date.options as Intl.DateTimeFormatOptions),
			...options,
		});
	}
	return dateFormat.format(parsedDate);
}

export function getFormattedDateWithTime(date: string | number | Date) {
	const ObjDate = new Date(date);

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
