import { gettext } from "i18n";

const colorSet = [
  { color: "black" },
  { color: "darkslategrey" },
  { color: "dimgrey" },
  { color: "grey" },
  { color: "lightgrey" },
  { color: "beige" },
  { color: "white" },
  { color: "maroon" },
  { color: "saddlebrown" },
  { color: "darkgoldenrod" },
  { color: "goldenrod" },
  { color: "rosybrown" },
  { color: "wheat" },
  { color: "navy" },
  { color: "blue" },
  { color: "dodgerblue" },
  { color: "deepskyblue" },
  { color: "aquamarine" },
  { color: "cyan" },
  { color: "olive" },
  { color: "darkgreen" },
  { color: "green" },
  { color: "springgreen" },
  { color: "limegreen" },
  { color: "palegreen" },
  { color: "lime" },
  { color: "greenyellow" },
  { color: "darkslateblue" },
  { color: "slateblue" },
  { color: "purple" },
  { color: "fuchsia" },
  { color: "plum" },
  { color: "orchid" },
  { color: "lavender" },
  { color: "darkkhaki" },
  { color: "khaki" },
  { color: "lemonchiffon" },
  { color: "yellow" },
  { color: "gold" },
  { color: "orangered" },
  { color: "orange" },
  { color: "coral" },
  { color: "lightpink" },
  { color: "palevioletred" },
  { color: "deeppink" },
  { color: "darkred" },
  { color: "crimson" },
  { color: "red" }
];


let _upgraded: boolean;
/**
 * Upgrade old settings format
 * @param settingsStorage 
 */
function upgrade(settingsStorage: LiveStorage): void {
  if (_upgraded) return;
  _upgraded = true;
  // Get the value set with the old clock format
  const oldValue = settingsStorage.getItem("clockDisplay24");
  // Test if this setting was defined
  if (oldValue === undefined || oldValue === null) return;
  // console.info("Upgrade");
  // Create the new selection
  const selection = oldValue === "true"
    ? { selected: [2], values: [{ value: "24h", name: gettext("clockFormat24h") }] }
    : { selected: [1], values: [{ value: "12h", name: gettext("clockFormat12h") }] };
  // Add new value
  settingsStorage.setItem("clockFormat", JSON.stringify(selection));
  // Remove the old one
  settingsStorage.removeItem("clockDisplay24");
}

registerSettingsPage(({ settings, settingsStorage }) => {
  // Upgrade old settings
  upgrade(settingsStorage);
  // Return the page
  return (
    <Page>
      <Section
        title={gettext("secondSlock")}>
        <Select
          settingsKey="offset"
          label={gettext("setSecondSlock")}
          options={[
            { name: "UTC -12", value: "-12" },
            { name: "UTC -11", value: "-11" },
            { name: "UTC -10", value: "-10" },
            { name: "UTC -9", value: "-9" },
            { name: "UTC -8", value: "-8" },
            { name: "UTC -7", value: "-7" },
            { name: "UTC -6", value: "-6" },
            { name: "UTC -5", value: "-5" },
            { name: "UTC -4", value: "-4" },
            { name: "UTC -3", value: "-3" },
            { name: "UTC -2", value: "-2" },
            { name: "UTC -1", value: "-1" },
            { name: "UTC", value: "+0" },
            { name: "UTC +1", value: "+1" },
            { name: "UTC +2", value: "+2" },
            { name: "UTC +3", value: "+3" },
            { name: "UTC +4", value: "+4" },
            { name: "UTC +5", value: "+5" },
            { name: "UTC +6", value: "+6" },
            { name: "UTC +7", value: "+7" },
            { name: "UTC +8", value: "+8" },
            { name: "UTC +9", value: "+9" },
            { name: "UTC +10", value: "+10" },
            { name: "UTC +11", value: "+11" },
            { name: "UTC +12", value: "+12" }
          ]} />
      </Section>
      <Section
        title="Options">
        <Select
          settingsKey="clockFormat"
          label={gettext("clockFormat")}
          options={[
            { name: gettext("clockFormatUser"), value: "user" },
            { name: gettext("clockFormat12h"), value: "12h" },
            { name: gettext("clockFormat24h"), value: "24h" }
          ]} />
        <Toggle
          settingsKey="showBatteryBar"
          label={gettext("showBatteryBar")} />
        <Toggle
          settingsKey="showActivities"
          label={gettext("showActivities")} />
      </Section>
      <Section
        title={gettext("backgroundColor")}>
        <ColorSelect
          settingsKey="colorBackground"
          colors={colorSet} />
      </Section>
      <Section
        title={gettext("textColor")}>
        <ColorSelect
          settingsKey="colorForeground"
          colors={colorSet} />
      </Section>
    </Page>
  );
});