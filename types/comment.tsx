import { UserResponse } from "./user";

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  pdfs?:[];
  images:[any];
  user: Omit<UserResponse, "email">|any;
  replies?: Comment[];
}