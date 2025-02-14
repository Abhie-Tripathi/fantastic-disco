export interface PredictedAttendanceResponse {
  predictedAttendance: PredictedAttendance;
}

export interface PredictedAttendance {
  total: number;
  groupingByDate: { [date: string]: number };
}
