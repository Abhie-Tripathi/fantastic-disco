export interface PredictedEventsResponse {
  predictedNumberOfEvents: PredictedEvents;
}

export interface PredictedEvents {
  total: number;
  groupingByDate: { [date: string]: number };
}
