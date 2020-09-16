import clock from "clock"
import { locale } from "user-settings";

// Localisation
import { gettext } from "i18n";
const months = [
    gettext("month01"),
    gettext("month02"),
    gettext("month03"),
    gettext("month04"),
    gettext("month05"),
    gettext("month06"),
    gettext("month07"),
    gettext("month08"),
    gettext("month09"),
    gettext("month10"),
    gettext("month11"),
    gettext("month12")
];

type Granularity = 'off' | 'seconds' | 'minutes' | 'hours';
type AmOrPm = "AM" | "PM" | "  ";

export class FormatedDate {
    Hours: string;
    Month: string;
    Day: string;
    Date: string;
    AmOrPm: AmOrPm;
}

// Callback
let _callback: (clock1: FormatedDate, clock2: FormatedDate, mins: string) => void

// H24 setting
let _clockDisplay24: boolean;

// Offset
let _offsetNegative: boolean;
let _offsetValue: number;

// Last values
let _lastDate: Date;

// Ouputs
export let lastClock1: FormatedDate;
export let lastClock2: FormatedDate;
export let lastMinutes: string;

// Initialize the call back
export function initialize(offsetNegative: boolean, offsetValue: number, granularity: Granularity, callback: (clock1: FormatedDate, clock2: FormatedDate, mins: string) => void): void {
    // Init values
    _offsetNegative = offsetNegative;
    _offsetValue = offsetValue;
    _callback = callback;

    // Tick every minutes
    clock.granularity = granularity;

    // Tick
    clock.ontick = (evt) => {
        // update the display
        Update(evt.date);
    };
}

// Update the user setting
export function updateClockDisplay24(value: boolean): void {
    _clockDisplay24 = value;
    Update(_lastDate);
}

// Update the offset
export function UpdateOffset(offsetNegative: boolean, offsetValue: number): void {
    _offsetNegative = offsetNegative;
    _offsetValue = offsetValue;
    /// Update the interface with the last values
    Update(_lastDate);
}

// Update the values to display
function Update(date: Date) {
    if (date === undefined) return;
    // last date
    _lastDate = date;

    // Declare ouputs
    const clock1 = new FormatedDate();
    const clock2 = new FormatedDate();

    let hours: number = date.getHours();
    // Set delta offset
    let delta: number = _offsetValue === undefined || _offsetValue === 0
        ? 0
        : _offsetNegative
            ? - Number(_offsetValue)
            : Number(_offsetValue);

    // Calcul date2
    let date2 = new Date(date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours() + delta,
        date.getUTCMinutes(),
        date.getUTCSeconds(),
        date.getUTCMilliseconds());

    // Update date 2
    const hours2 = date2.getHours();

    // Format the hour
    clock1.Hours = FormatHours(hours);
    clock2.Hours = FormatHours(hours2);

    // Format AM or PM
    clock1.AmOrPm = getAmorPm(hours);
    clock2.AmOrPm = getAmorPm(hours2);

    // Format the minutes
    let minutesOut = zeroPad(date.getMinutes());

    // Foramat the date
    FormatDate(date, clock1);
    FormatDate(date2, clock2);

    // Test undifined values
    if (lastClock1 === undefined) lastClock1 = new FormatedDate();
    if (lastClock2 === undefined) lastClock2 = new FormatedDate();

    // Save or updage values
    // Hours
    if (lastClock1.Hours != clock1.Hours) {
        lastClock1.Hours = clock1.Hours;
    }
    else {
        clock1.Hours = null;
    }
    if (lastClock2.Hours != clock2.Hours) {
        lastClock2.Hours = clock2.Hours;
    }
    else {
        clock2.Hours = null;
    }
    // AM or PM
    if (lastClock1.AmOrPm != clock1.AmOrPm) {
        lastClock1.AmOrPm = clock1.AmOrPm;
    }
    else {
        clock1.AmOrPm = null;
    }
    if (lastClock2.AmOrPm != clock2.AmOrPm) {
        lastClock2.AmOrPm = clock2.AmOrPm;
    }
    else {
        clock2.AmOrPm = null;
    }
    // Minutes
    if (lastMinutes != minutesOut) {
        lastMinutes = minutesOut;
    }
    else {
        minutesOut = null;
    }

    if (lastClock1.Month != clock1.Month
        || lastClock1.Day != clock1.Day
        || lastClock1.Date != clock1.Date) {
        lastClock1.Month = clock1.Month;
        lastClock1.Day = clock1.Day;
        lastClock1.Date = clock1.Date;
    }
    else {
        clock1.Month = null;
        clock1.Day = null;
        clock1.Date = null;
    }
    if (lastClock2.Month != clock2.Month
        || lastClock2.Day != clock2.Day
        || lastClock2.Date != clock2.Date) {
        lastClock2.Month = clock2.Month;
        lastClock2.Day = clock2.Day;
        lastClock2.Date = clock2.Date;
    }
    else {
        clock2.Month = null;
        clock2.Day = null;
        clock2.Date = null;
    }

    // Call the callback
    _callback(clock1, clock2, minutesOut);
}

// Format the hours, based on user preferences
function FormatHours(hours: number): string {
    if (hours === undefined) return "";
    let result = _clockDisplay24 === undefined || _clockDisplay24 === true
        ? zeroPad(hours)
        : (hours % 12 || 12).toString();
    if (result.length === 1) result = " " + result;
    return result;
}

// Format the date, based on user language
function FormatDate(date: Date, clock: FormatedDate): void {
    let month = months[date.getMonth()];
    let day = date.getDate();

    if (locale.language === "fr-fr") {
        clock.Date = `${day} ${month}`;
    } else {
        clock.Date = `${month} ${day}`;
    }
    clock.Month = month;
    clock.Day = day === undefined ? "" : day.toString();
}

// Add zero in front of numbers < 10
function zeroPad(i: number): string {
    return i < 10
        ? "0" + i.toString()
        : i.toString();
}
// Format AM or PM base on hours
function getAmorPm(hours: number): AmOrPm {
    // Format AM / PM if requested
    if (_clockDisplay24 === undefined || _clockDisplay24 === true) {
        // No AM or PM
        return "  ";
    }
    else {
        // AM / PM are available
        return hours < 12 ? "AM" : "PM";
    }
}