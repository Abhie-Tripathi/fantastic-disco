export interface Weather {
  lat: number;
  lon: number;
  tz: string;
  date: string;
  units: string;
  cloud_cover: Cloudcover;
  humidity: Cloudcover;
  precipitation: Precipitation;
  temperature: Temperature;
  pressure: Cloudcover;
  wind: Wind;
}
interface Wind {
  max: Max;
}
interface Max {
  speed: number;
  direction: number;
}
interface Temperature {
  min: number;
  max: number;
  afternoon: number;
  night: number;
  evening: number;
  morning: number;
}
interface Precipitation {
  total: number;
}
interface Cloudcover {
  afternoon: number;
}

export interface OpenMeteoWeatherResponse {
  daily: DailyTemperatureAndTime;
  daily_units: DailyUnits;
}

export interface DailyTemperatureAndTime {
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  time: string[];
}

export interface DailyUnits {
  elevation: number;
  generationtime_ms: number;
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  utc_offset_seconds: number;
}
