import { fromUnixTime, getUnixTime, format } from "date-fns";

export abstract class DateUtils {
	public static unixToDate = (unix: number): Date => {
		return fromUnixTime(unix);
	};

	public static dateToUnix = (date: Date): number => {
		return getUnixTime(date);
	};

	public static getBirthdayDateString = (date: Date) => {
		return format(date, "yyyy-MM-dd");
	};
}
