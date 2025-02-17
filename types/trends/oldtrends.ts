export interface ITrends {
  type: string;
  endpoints: string;
}
export type Ttrends =
  | "Predicted Attendance"
  | "Predicted Spend"
  | "Event Count";

export type Ttabs = "Time Trends" | "Category Trends" | "Location Trends";
export type TEventType = "All Events" | "Social Events" | "Business Events";
