import { fromUnixTime, getUnixTime } from "date-fns";

export abstract class DateUtils {
	public static unixToDate = (unix: number) => {
		return fromUnixTime(unix);
	};

	public static dateToUnix = (date: Date) => {
		return getUnixTime(date);
	};
}
