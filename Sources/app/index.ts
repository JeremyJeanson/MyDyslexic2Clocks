import document from "document";
import * as utils from "./simple/utils";

// import clock from "clock";
import * as simpleMinutes from "./simple/clock-strings";

// Device form screen detection
import { me as device } from "device";
import { locale } from "user-settings";
// Settings
import { Settings } from "../common/settings";
// Fonts
import * as font from "./simple/font";
import * as simpleDisplay from "./simple/display";
import { ActivitySymbol } from "./simple/activity-symbol";

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
const _clockContainer1 = document.getElementById("clock-container1") as GraphicsElement;
const _clockContainer2 = document.getElementById("clock-container2") as GraphicsElement;
const _cloks1 = _clockContainer1.getElementsByTagName("image") as ImageElement[];
const _cloks2 = _clockContainer2.getElementsByTagName("image") as ImageElement[];
const _cloks1Hours = _cloks1.slice(0, 2);
const _cloks2Hours = _cloks2.slice(0, 2);
const _cloks1Minutes = _cloks1.slice(3, 5);
const _cloks2Minutes = _cloks2.slice(3, 5);

// AM or PM
const _ampmContainer1 = document.getElementById("ampm-container1") as GraphicsElement;
const _ampmContainer2 = document.getElementById("ampm-container2") as GraphicsElement;
const _ampm1 = _ampmContainer1.getElementsByTagName("image") as ImageElement[];
const _ampm2 = _ampmContainer2.getElementsByTagName("image") as ImageElement[];

// Battery
const _batteryBarContainer = document.getElementById("battery-bar-container") as GraphicsElement;
const _batteryValue = document.getElementById("battery-bar-value") as GradientRectElement;

// Heart rate management
const _hrmConteiner = document.getElementById("hrm-container") as GraphicsElement;
const _hrmIcon = document.getElementById("hrm-symbol") as GraphicsElement;
const _hrmlImage = document.getElementById("hrm-image") as ImageElement;
const _hrmTexts = document.getElementById("hrm-text-container").getElementsByTagName("image") as ImageElement[];

let _offsetNegative: boolean;
let _offsetValue: number;

// Stats
const _statsContainer = document.getElementById("stats-container") as GraphicsElement;
const _steps = new ActivitySymbol(document.getElementById("steps") as GraphicsElement,_background);
const _calories = new ActivitySymbol(document.getElementById("calories") as GraphicsElement,_background);
const _activesminutes = new ActivitySymbol(document.getElementById("activesminutes") as GraphicsElement,_background);
const _distance = new ActivitySymbol(document.getElementById("distance") as GraphicsElement,_background);
const _elevation = new ActivitySymbol(document.getElementById("elevation") as GraphicsElement,_background);

// Settings
const _settings = new Settings();

// --------------------------------------------------------------------------------
// Clock
// --------------------------------------------------------------------------------
// Update the clock every minute
simpleMinutes.initialize(_offsetNegative, _offsetValue, "seconds", (clock1, clock2, mins) => {
  const folder: font.folder = simpleDisplay.isInAodMode()
    ? "chars-aod"
    : "chars";

  // Hours
  if (clock1.Hours) {
    font.print(clock1.Hours, _cloks1Hours, folder);
  }
  if (clock2.Hours) {
    font.print(clock2.Hours, _cloks2Hours, folder);
  }

  // Minutes
  if (mins) {
    font.print(mins, _cloks1Minutes, folder);
    font.print(mins, _cloks2Minutes, folder);
  }

  // AM or PM
  if (clock1.AmOrPm) {
    font.print(clock1.AmOrPm.toLocaleLowerCase(), _ampm1);
  }
  if (clock2.AmOrPm) {
    font.print(clock2.AmOrPm.toLowerCase(), _ampm2);
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

function setHoursMinutes(folder: font.folder) {
  // Hours
  font.print(simpleMinutes.lastClock1.Hours + ":" + simpleMinutes.lastMinutes, _cloks1, folder);
  font.print(simpleMinutes.lastClock2.Hours + ":" + simpleMinutes.lastMinutes, _cloks2, folder);
}

// Display clocks on Ionic
function displayClocskIonic(clock1: simpleMinutes.FormatedDate, clock2: simpleMinutes.FormatedDate): void {
  if (locale.language === "fr-fr") {
    _dates1Part2Container.class = "day-container md-up"
    _dates2Part2Container.class = "day-container md-up"
    _dates1Part1Container.class = "month-container md-down";
    _dates2Part1Container.class = "month-container md-down";
  }
  else {
    _dates1Part1Container.class = "month-container md-up";
    _dates2Part1Container.class = "month-container md-up";
    _dates1Part2Container.class = "day-container md-down"
    _dates2Part2Container.class = "day-container md-down"
  }

  // Date 1
  if (clock1.Month) {
    font.print(clock1.Month, _dates1Part1);
  }
  if (clock1.Day) {
    font.print(clock1.Day, _dates1Part2);
  }
  // Date 2
  if (clock2.Month) {
    font.print(clock2.Month, _dates2Part1);
  }
  if (clock2.Day) {
    font.print(clock2.Day, _dates2Part2);
  }
}

function displayClocskVersa(clock1: simpleMinutes.FormatedDate, clock2: simpleMinutes.FormatedDate): void {
  if (clock1.Date) {
    // Position
    _dates1Part1Container.x = (device.screen.width / 2) - (clock1.Date.length * 12);

    // Values
    font.print(clock1.Date, _dates1Part1);
  }

  if (clock2.Date) {
    // Position
    _dates2Part1Container.x = (device.screen.width / 2) - (clock2.Date.length * 12);

    // Values
    font.print(clock2.Date, _dates2Part1);
  }
}

// --------------------------------------------------------------------------------
// Power
// --------------------------------------------------------------------------------
import * as batterySimple from "./simple/power-battery";

// Method to update battery level informations
batterySimple.initialize((battery) => {
  // Battery bar
  _batteryValue.width = Math.floor(battery) * device.screen.width / 100;
});
// --------------------------------------------------------------------------------
// Settings
// --------------------------------------------------------------------------------
import * as simpleSettings from "simple-fitbit-settings/app"

simpleSettings.initialize(
  _settings,
  (settingsNew: Settings) => {
    if (!settingsNew) {
      return;
    }

    if (settingsNew.colorBackground !== undefined) {
      utils.fill(_background, settingsNew.colorBackground);
      _batteryBackground.gradient.colors.c1 = settingsNew.colorBackground;
      refreshActivitiesColors();
    }

    if (settingsNew.colorForeground !== undefined) {
      utils.fill(_container, settingsNew.colorForeground);
    }

    if (settingsNew.showBatteryBar !== undefined) {
      utils.setVisibility(_batteryBarContainer, settingsNew.showBatteryBar);
    }

    if (settingsNew.showActivities !== undefined) {
      utils.setVisibility(_statsContainer, _settings.showActivities);
      updateActivities();
    }

    if (settingsNew.offset !== undefined) {
      try {
        let value: string = settingsNew.offset.values[0].value.toString();
        // Get offset informations
        _offsetNegative = value[0] === "-";
        _offsetValue = value.substring(1) as unknown as number;
      }
      catch {
        _offsetNegative = false;
        _offsetValue = 0;
      }

      // update the clock
      simpleMinutes.UpdateOffset(_offsetNegative, _offsetValue);
    }

    // Display based on 12H or 24H format
    if (settingsNew.clockDisplay24 !== undefined) {
      simpleMinutes.updateClockDisplay24(settingsNew.clockDisplay24);
    }
  });
// --------------------------------------------------------------------------------
// Heart rate manager
// --------------------------------------------------------------------------------
import * as simpleHRM from "./simple/hrm";
let lastBpm: number;

simpleHRM.initialize((newValue, bpm, zone, restingHeartRate) => {
  if (zone === "out-of-range") {
    _hrmlImage.href = "images/stat_hr_open_48px.png";
  } else {
    _hrmlImage.href = "images/stat_hr_solid_48px.png";
  }
  // Animation
  if (newValue) {
    utils.highlight(_hrmIcon);
  }

  // BPM value display
  if (bpm !== lastBpm) {
    if (bpm > 0) {
      //_hrmContainer.style.display = "inline";
      font.print(bpm.toString(), _hrmTexts);
    } else {
      //_hrmContainer.style.display = "none";
    }
  }
});

// --------------------------------------------------------------------------------
// Activity
// --------------------------------------------------------------------------------
import * as simpleActivities from "simple-fitbit-activities"

// Initi
simpleActivities.initialize(updateActivities);

// Update design when elevation gain is not available
if (!simpleActivities.elevationIsAvailable()) {
  // hide elevation
  _elevation.hide();
  // move stats 
  _statsContainer.x = 30;
}

// Update activites
function updateActivities(): void {
  // Get activities
  const activities = simpleActivities.getNewValues();

  _steps.set(activities.steps);
  _calories.set(activities.calories);
  _activesminutes.set(activities.activeZoneMinutes);
  _distance.set(activities.distance);
  _elevation.set(activities.elevationGain);

  // _steps.set(new simpleActivities.Activity(0,100));
  // _calories.set(new simpleActivities.Activity(25,100));
  // _activesminutes.set(new simpleActivities.Activity(50,100));
  // _distance.set(new simpleActivities.Activity(75,100));
  // _elevation.set(new simpleActivities.Activity(100,100));
}

function refreshActivitiesColors() {
  _steps.refresh();
  _calories.refresh();
  _activesminutes.refresh();
  _distance.refresh();
  _elevation.refresh();
}

// --------------------------------------------------------------------------------
// Allway On Display
// --------------------------------------------------------------------------------
simpleDisplay.initialize(onEnterdAOD, onLeavedAOD, onDisplayGoON);

function onEnterdAOD() {
  // Stop sensors
  simpleHRM.stop();

  // // Resize 
  // _clockContainer1.x = (252 - 126) / 2;
  // _clockContainer1.y = 70;
  // _clockContainer1.height = 42;
  // _clockContainer1.width = 126;
  // _clockContainer2.x = (252 - 126) / 2;
  // _clockContainer2.y = 70;
  // _clockContainer2.height = 42;
  // _clockContainer2.width = 126;
  setHoursMinutes("chars-aod");

  // Hide elements
  utils.hide(_dates1Part1Container);
  utils.hide(_dates1Part2Container);
  utils.hide(_dates2Part1Container);
  utils.hide(_dates2Part2Container);
  utils.hide(_background);
  utils.hide(_hrmConteiner);
  utils.hide(_statsContainer);
  utils.hide(_batteryBarContainer);
}

function onLeavedAOD() {
  // // Resize
  // _clockContainer1.x = 0;
  // _clockContainer1.y = 0;
  // _clockContainer1.height = 84;
  // _clockContainer1.width = 252;
  // _clockContainer2.x = 0;
  // _clockContainer2.y = 0;
  // _clockContainer2.height = 84;
  // _clockContainer2.width = 252;
  setHoursMinutes("chars");

  // Show elements & start sensors
  utils.show(_background);
  utils.show(_dates1Part1Container);
  utils.show(_dates1Part2Container);
  utils.show(_dates2Part1Container);
  utils.show(_dates2Part2Container);
  utils.show(_hrmConteiner);
  if (_settings.showActivities) utils.show(_statsContainer);
  if (_settings.showBatteryBar) utils.show(_batteryBarContainer);

  // Start sensors
  simpleHRM.start();
}

/**
 * Display is on
 */
function onDisplayGoON(){
  _steps.onDiplayGoOn();
  _calories.onDiplayGoOn();
  _activesminutes.onDiplayGoOn();
  _distance.onDiplayGoOn();
  _elevation.onDiplayGoOn();
}