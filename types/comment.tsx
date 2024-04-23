import { UserResponse } from "./user";

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  user: Omit<UserResponse, "email">;
  replies?: Comment[];
}