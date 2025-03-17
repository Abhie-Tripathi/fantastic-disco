export interface TrackerData {
  id: string;
  location: string[];
  name: string;
  newCount: number;
  expiredCount: number;
  activeCount: number;
  type: string;
  eventsCount: {
    type: string;
    totalCount: number;
    newCount: number;
  }[];
}
