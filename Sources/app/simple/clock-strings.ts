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
import * as util from "./utils";
type Granularity = 'off' | 'seconds' | 'minutes' | 'hours';

export class FormatedDate {
    Hours: string;
    Month: string;
    Day: string;
    Date: string;
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
let _lastClock1: FormatedDate;
let _lastClock2: FormatedDate;
let _lastMinutes: string;

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
    let clock1 = new FormatedDate();
    let clock2 = new FormatedDate();

    let hours: number = date.getHours();
    // Set hours2 offset
    let hours2: number = _offsetValue === undefined || _offsetValue === 0
        ? date.getUTCHours()
        : _offsetNegative
            ? date.getUTCHours() - Number(_offsetValue)
            : date.getUTCHours() + Number(_offsetValue);

    // Calcul date2
    let date2 = new Date(date.valueOf());
    date2.setUTCHours(hours2);
    // Update date 2
    hours2 = date2.getUTCHours();

    // Format the hour 1
    clock1.Hours = FormatHours(hours);

    // Format the hour 2
    clock2.Hours = FormatHours(hours2);

    // Format the minutes
    let minutesOut = util.zeroPad(date.getMinutes());

    // Foramat the date
    FormatDate(date, clock1);
    FormatDate(date2, clock2);

    // Test undifined values
    if (_lastClock1 === undefined) _lastClock1 = new FormatedDate();
    if (_lastClock2 === undefined) _lastClock2 = new FormatedDate();

    // Save or updage states
    if (_lastClock1.Hours != clock1.Hours) {
        _lastClock1.Hours = clock1.Hours;
    }
    else {
        clock1.Hours = null;
    }
    if (_lastClock2.Hours != clock2.Hours) {
        _lastClock2.Hours = clock2.Hours;
    }
    else {
        clock2.Hours = null;
    }
    if (_lastMinutes != minutesOut) {
        _lastMinutes = minutesOut;
    }
    else {
        minutesOut = null;
    }

    if (_lastClock1.Month != clock1.Month
        || _lastClock1.Day != clock1.Day
        || _lastClock1.Date != clock1.Date) {
        _lastClock1.Month = clock1.Month;
        _lastClock1.Day = clock1.Day;
        _lastClock1.Date = clock1.Date;
    }
    else {
        clock1.Month = null;
        clock1.Day = null;
        clock1.Date = null;
    }
    if (_lastClock2.Month != clock2.Month
        || _lastClock2.Day != clock2.Day
        || _lastClock2.Date != clock2.Date) {
        _lastClock2.Month = clock2.Month;
        _lastClock2.Day = clock2.Day;
        _lastClock2.Date = clock2.Date;
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
        ? util.zeroPad(hours)
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