"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateUtils = void 0;
const date_fns_1 = require("date-fns");
class DateUtils {
}
exports.DateUtils = DateUtils;
DateUtils.unixToDate = (unix) => {
    return date_fns_1.fromUnixTime(unix);
};
DateUtils.dateToUnix = (date) => {
    return date_fns_1.getUnixTime(date);
};
//# sourceMappingURL=DateUtils.js.map