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

registerSettingsPage(({ settings, settingsStorage }) => {
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
        <Toggle
          settingsKey="clockDisplay24" 
          label={gettext("clockDisplay24")}/>
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