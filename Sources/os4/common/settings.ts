import * as simpleSettings from "simple-fitbit-settings/common";
// Settings 
export class Settings {
    offset: simpleSettings.Selection = { selected: [12], values: [{ name: "UTC", value: "+0" }] };
    clockFormat: simpleSettings.Selection = { selected: [0], values: [{ name: "user", value: "user" }] };
    showBatteryBar = true;
    showActivities = true;
    colorBackground = "black";
    colorForeground = "white";
}