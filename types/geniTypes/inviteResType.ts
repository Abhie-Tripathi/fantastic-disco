interface Invite {
  email: string;
}

export interface SuggestionsResponse {
  totalCount: number;
  invite: Invite[];
}
