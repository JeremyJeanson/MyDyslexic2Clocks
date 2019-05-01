import document from "document";
import * as util from "./simple/utils";

// import clock from "clock";
import * as simpleMinutes from "./simple/clock-strings";

// Device form screen detection
import { me as device } from "device";
import { locale } from "user-settings";

// Elements for style
const _container = document.getElementById("container") as GraphicsElement;
const _background = document.getElementById("background") as RectElement;
const _batteryBackground = document.getElementById("battery-bar-background") as GradientArcElement;

// Date
const _dates1Part1Container = document.getElementById("month-container1") as GraphicsElement;
const _dates1Part2Container = document.getElementById("day-container1") as GraphicsElement;
const _dates1Part1 = _dates1Part1Container.getElementsByTagName("image") as ImageElement[];
const _dates1Part2 = _dates1Part2Container.getElementsByTagName("image") as ImageElement[];
const _dates2Part1Container = document.getElementById("month-container2") as GraphicsElement;
const _dates2Part2Container = document.getElementById("day-container2") as GraphicsElement;
const _dates2Part1 = _dates2Part1Container.getElementsByTagName("image") as ImageElement[];
const _dates2Part2 = _dates2Part2Container.getElementsByTagName("image") as ImageElement[];

// Hours
const _cloks1 = document.getElementById("clock-container1").getElementsByTagName("image") as ImageElement[];
const _cloks2 = document.getElementById("clock-container2").getElementsByTagName("image") as ImageElement[];

// Battery
const _batteryBarContainer = document.getElementById("battery-bar-container") as GraphicsElement;
const _batteryValue = document.getElementById("battery-bar-value") as GradientRectElement;

// Heart rate management
const _hrmIcon = document.getElementById("hrm-symbol") as GraphicsElement;
const _hrmlImage = document.getElementById("hrm-image") as ImageElement;
const _hrmTexts = document.getElementById("hrm-text-container").getElementsByTagName("image") as ImageElement[];

let _offsetNegative: boolean;
let _offsetValue: number;

// Stats
const _statsContainer = document.getElementById("stats-container") as GraphicsElement;
const _stats = _statsContainer.getElementsByTagName("svg") as GraphicsElement[];
let _showActities: boolean;

// --------------------------------------------------------------------------------
// Clock
// --------------------------------------------------------------------------------
// Update the clock every minute
simpleMinutes.initialize(_offsetNegative, _offsetValue, "seconds", (clock1, clock2, mins) => {
  // hours="88";
  // mins="88";
  // date = "january 20";
  // Hours
  if (clock1.Hours) {
    _cloks1[0].href = util.getImageFromLeft(clock1.Hours, 0);
    _cloks1[1].href = util.getImageFromLeft(clock1.Hours, 1);
  }
  if (clock2.Hours) {
    _cloks2[0].href = util.getImageFromLeft(clock2.Hours, 0);
    _cloks2[1].href = util.getImageFromLeft(clock2.Hours, 1);
  }

  // Minutes
  if (mins) {
    let mins0 = util.getImageFromLeft(mins, 0);
    let mins1 = util.getImageFromLeft(mins, 1);
    _cloks1[3].href = mins0;
    _cloks1[4].href = mins1;
    _cloks2[3].href = mins0;
    _cloks2[4].href = mins1;
  }

  // Design for Ionic
  if (device.screen.width > 300) {
    displayClocskIonic(clock1, clock2);
  }
  else {
    displayClocskVersa(clock1, clock2);
  }

  // update activities
  updateActivities();
});

// Display clocks on Ionic
function displayClocskIonic(clock1: simpleMinutes.FormatedDate, clock2: simpleMinutes.FormatedDate): void {
  if (locale.language === "fr-fr") {
    _dates1Part1Container.y = 30;
    _dates1Part2Container.y = 0;
    _dates2Part1Container.y = 30;
    _dates2Part2Container.y = 0;
  }
  else {
    _dates1Part1Container.y = 0;
    _dates1Part2Container.y = 30;
    _dates2Part1Container.y = 0;
    _dates2Part2Container.y = 30;
  }

  // Date 1
  if (clock1.Month) {
    util.display(clock1.Month, _dates1Part1);
  }
  if (clock1.Day) {
    util.display(clock1.Day, _dates1Part2);
  }
  // Date 2
  if (clock2.Month) {
    util.display(clock2.Month, _dates2Part1);
  }
  if (clock2.Day) {
    util.display(clock2.Day, _dates2Part2);
  }
}

function displayClocskVersa(clock1: simpleMinutes.FormatedDate, clock2: simpleMinutes.FormatedDate): void {
  if (clock1.Date) {
    // Position
    _dates1Part1Container.x = (device.screen.width / 2) - (clock1.Date.length * 12);

    // Values
    util.display(clock1.Date, _dates1Part1);
  }

  if (clock2.Date) {
    // Position
    _dates2Part1Container.x = (device.screen.width / 2) - (clock2.Date.length * 12);

    // Values
    util.display(clock2.Date, _dates2Part1);
  }
}

// --------------------------------------------------------------------------------
// Power
// --------------------------------------------------------------------------------
import * as batterySimple from "./simple/power-battery";

// Method to update battery level informations
batterySimple.initialize((battery) => {
  let batteryString = battery.toString() + "%";
  // Battery bar
  _batteryValue.width = Math.floor(battery) * device.screen.width / 100;
});
// --------------------------------------------------------------------------------
// Settings
// --------------------------------------------------------------------------------
import * as simpleSettings from "./simple/device-settings";

simpleSettings.initialize((settings: any) => {
  if (!settings) {
    return;
  }

  if (settings.colorBackground) {
    _background.style.fill = settings.colorBackground;
    _batteryBackground.gradient.colors.c1 = settings.colorBackground;
    updateActivities(); // For achivement color
  }

  if (settings.colorForeground) {
    _container.style.fill = settings.colorForeground;
  }

  if (settings.showBatteryBar !== undefined) {
    _batteryBarContainer.style.display = settings.showBatteryBar === true
      ? "inline"
      : "none";
  }

  if (settings.showActivities !== undefined) {
    _showActities = settings.showActivities === true;
    _statsContainer.style.display = _showActities
      ? "inline"
      : "none";
      updateActivities();
  }

  if (settings.offset) {
    try {
      let value: string = settings.offset.values[0].value.toString();
      // Get offset informations
      _offsetNegative = value[0] === "-";
      _offsetValue = value.substring(1) as unknown as number;
    }
    catch{
      _offsetNegative = false;
      _offsetValue = 0;
    }

    // update the clock
    simpleMinutes.UpdateOffset(_offsetNegative, _offsetValue);
  }
});
// --------------------------------------------------------------------------------
// Heart rate manager
// --------------------------------------------------------------------------------
import * as simpleHRM from "./simple/hrm";

simpleHRM.initialize((bpm, zone, restingHeartRate) => {
  if (zone === "out-of-range") {
    _hrmlImage.href = "images/stat_hr_open_48px.png";
  } else {
    _hrmlImage.href = "images/stat_hr_solid_48px.png";
  }
  if (bpm !== "--") {
    _hrmIcon.animate("highlight");
    let bpmString = `${bpm}`;
    _hrmTexts[0].href = util.getImageFromLeft(bpmString, 0);
    _hrmTexts[1].href = util.getImageFromLeft(bpmString, 1);
    _hrmTexts[2].href = util.getImageFromLeft(bpmString, 2);
  }
});
// --------------------------------------------------------------------------------
// Activity
// --------------------------------------------------------------------------------
import * as simpleActivities from "./simple/activities"

// Initi
simpleActivities.initialize(updateActivities);

// Update design when elevation gain is not available
if(!simpleActivities.elevationIsAvailable()){
  // hide elevation
  _stats[1].style.display = "none";
  // move stats 
  _statsContainer.x = 30;
}

// Update activites
function updateActivities(): void {
  // Get activities
  const activities = simpleActivities.getNewValues();

  if (activities.steps !== undefined) {
    simpleActivities.updateActivityArc(_stats[0], activities.steps, _background.style.fill);
  }
  if (activities.elevationGain !== undefined) {
    simpleActivities.updateActivityArc(_stats[1], activities.elevationGain, _background.style.fill);
  }
  if (activities.calories !== undefined) {
    simpleActivities.updateActivityArc(_stats[2], activities.calories, _background.style.fill);
  }
  if (activities.activeMinutes !== undefined) {
    simpleActivities.updateActivityArc(_stats[3], activities.activeMinutes, _background.style.fill);
  }
  if (activities.distance !== undefined) {
    simpleActivities.updateActivityArc(_stats[4], activities.distance, _background.style.fill);
  }
}