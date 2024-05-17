import { UserResponse } from "./user";

export interface Comment {
  id: string;
  text: string;
  content:string;
  type:string;
  createdAt: string;
  pdfs?:[];
  upvote:number;
  isLiked?:boolean;
  likes:number;
  replyText?:string;
  replyName?:string;
  images:[any];
  replyId?:string;
  user: Omit<UserResponse, "email">|any;
  replies?: Comment[];
}