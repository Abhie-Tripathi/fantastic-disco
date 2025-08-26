export interface CancelSubscriptionFormData {
  feedback: string;
  qna?: {
    [question: string]: string;
  };
}

export interface CancelSubscriptionResponse {
  message: string;
  cancelled: boolean;
}
