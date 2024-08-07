export interface PrimaryButtonSettings {
    buttonColor: string;
    fontColor: string;
    borderRadius: number;
    borderColor: string;
    buttonText: string;
}

export interface SecondaryButtonSettings {
    fontColor: string;
    borderRadius: number;
    borderColor: string;
    buttonText: string;
}
export interface ButtonSettingsState {
    primary: PrimaryButtonSettings;
    secondary: SecondaryButtonSettings;
}