// Settings 
export class Settings {
    offset: Option[];
    clockDisplay24: boolean = true;
    showBatteryBar: boolean = true;
    showActivities: boolean = true;
    colorBackground: string = "black";
    colorForeground: string = "white";
}

export class Option{
    name:string;
    value:string;
}