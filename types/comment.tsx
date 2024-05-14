import { UserResponse } from "./user";

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  pdfs?:[];
  isLiked?:boolean;
  likes:number;
  replyText?:string;
  replyName?:string;
  images:[any];
  replyId?:string;
  user: Omit<UserResponse, "email">|any;
  replies?: Comment[];
}