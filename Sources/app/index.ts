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
const _clockContainer1 = document.getElementById("clock-container1") as GraphicsElement;
const _clockContainer2 = document.getElementById("clock-container2") as GraphicsElement;
const _cloks1 = _clockContainer1.getElementsByTagName("image") as ImageElement[];
const _cloks2 = _clockContainer2.getElementsByTagName("image") as ImageElement[];

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
const _stats = _statsContainer.getElementsByTagName("svg") as GraphicsElement[];

import { Settings } from "../common/settings";
const _settings = new Settings();

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

  // AM or PM
  if (clock1.AmOrPm) {
    util.display(clock1.AmOrPm, _ampm1);
  }
  if (clock2.AmOrPm) {
    util.display(clock2.AmOrPm, _ampm2);
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
      _background.style.fill = settingsNew.colorBackground;
      _batteryBackground.gradient.colors.c1 = settingsNew.colorBackground;
      updateActivities(); // For achivement color
    }

    if (settingsNew.colorForeground !== undefined) {
      _container.style.fill = settingsNew.colorForeground;
    }

    if (settingsNew.showBatteryBar !== undefined) {
      _batteryBarContainer.style.display = settingsNew.showBatteryBar
        ? "inline"
        : "none";
    }

    if (settingsNew.showActivities !== undefined) {
      _statsContainer.style.display = _settings.showActivities
        ? "inline"
        : "none";
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
    _hrmIcon.animate("highlight");
  }

  // BPM value display
  if (bpm !== lastBpm) {
    if (bpm > 0) {
      //_hrmContainer.style.display = "inline";
      let bpmString = bpm.toString();
      _hrmTexts[0].href = util.getImageFromLeft(bpmString, 0);
      _hrmTexts[1].href = util.getImageFromLeft(bpmString, 1);
      _hrmTexts[2].href = util.getImageFromLeft(bpmString, 2);
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
  _stats[1].style.display = "none";
  // move stats 
  _statsContainer.x = 30;
}

// Update activites
function updateActivities(): void {
  // Get activities
  const activities = simpleActivities.getNewValues();

  updateActivityArc(_stats[0], activities.steps, _background.style.fill);
  updateActivityArc(_stats[1], activities.elevationGain, _background.style.fill);
  updateActivityArc(_stats[2], activities.calories, _background.style.fill);
  updateActivityArc(_stats[3], activities.activeMinutes, _background.style.fill);
  updateActivityArc(_stats[4], activities.distance, _background.style.fill);
}

// Render an activity to an arc control (with goal render and colors update)
function updateActivityArc(container: GraphicsElement, activity: simpleActivities.Activity, appBackgroundColor: string): void {
  if (activity === undefined) return;
  let arc = container.getElementsByTagName("arc")[1] as ArcElement; // First Arc is used for background
  let circle = container.getElementsByTagName("circle")[0] as CircleElement;
  let image = container.getElementsByTagName("image")[0] as ImageElement;

  // Goals ok
  if (activity.actual >= activity.goal) {
    circle.style.display = "inline";
    arc.style.display = "none";
    image.style.fill = appBackgroundColor;
  }
  else {
    circle.style.display = "none";
    arc.style.display = "inline";
    arc.sweepAngle = activity.as360Arc(); //util.activityToAngle(activity.goal, activity.actual);
    if (container.style.fill)
      image.style.fill = container.style.fill;
  }
}
// --------------------------------------------------------------------------------
// Allway On Display
// --------------------------------------------------------------------------------
import { me } from "appbit";
import { display } from "display";
import clock from "clock"

// does the device support AOD, and can I use it?
if (display.aodAvailable && me.permissions.granted("access_aod")) {
  // tell the system we support AOD
  display.aodAllowed = true;

  // respond to display change events
  display.addEventListener("change", () => {

    // console.info(`${display.aodAvailable} ${display.aodEnabled} ${me.permissions.granted("access_aod")} ${display.aodAllowed} ${display.aodActive}`);

    // Is AOD inactive and the display is on?
    if (!display.aodActive && display.on) {
      clock.granularity = "seconds";

      // Resize
      _clockContainer1.x = 0;
      _clockContainer1.y = 0;
      _clockContainer1.height = 84;
      _clockContainer1.width = 252;
      _clockContainer2.x = 0;
      _clockContainer2.y = 0;
      _clockContainer2.height = 84;
      _clockContainer2.width = 252;

      // Show elements & start sensors
      _background.style.display = "inline";
      _dates1Part1Container.style.display = "inline";
      _dates1Part2Container.style.display = "inline";
      _dates2Part1Container.style.display = "inline";
      _dates2Part2Container.style.display = "inline";
      // _ampmContainer1.style.display = "inline";
      // _ampmContainer2.style.display = "inline";

      if (_settings.showActivities) {
        _statsContainer.style.display = "inline";
      }
      _hrmConteiner.style.display = "inline";
      if (_settings.showBatteryBar) {
        _batteryBarContainer.style.display = "inline";
      }

      // Start sensors
      simpleHRM.start();
    } else {
      clock.granularity = "minutes";

      // Stop sensors
      simpleHRM.stop();

      // Resize 
      _clockContainer1.x = (252 - 126) / 2;
      _clockContainer1.y = 70;
      _clockContainer1.height = 42;
      _clockContainer1.width = 126;
      _clockContainer2.x = (252 - 126) / 2;
      _clockContainer2.y = 70;
      _clockContainer2.height = 42;
      _clockContainer2.width = 126;

      // Hide elements
      _dates1Part1Container.style.display = "none";
      _dates1Part2Container.style.display = "none";
      _dates2Part1Container.style.display = "none";
      _dates2Part2Container.style.display = "none";
      // _ampmContainer1.style.display = "none";
      // _ampmContainer2.style.display = "none";
      _background.style.display = "none";
      _statsContainer.style.display = "none";
      _hrmConteiner.style.display = "none";
      _batteryBarContainer.style.display = "none";
    }
  });
}