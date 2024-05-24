import { UserResponse } from "./user";

export interface Comment {
  CommentFiles?:[
    Attachment:[]
  ];
  created:Date;
  id: string;
  text: string;
  content:string;
  type:string;
  createdAt: string;
  pdfs?:[];
  userLiked:boolean;
  _count:{
    Commentlikes:number;
  }
  parentCommentId?:any,
  upvote:number;
  isLiked?:boolean;
  likes:number;
  replyText?:string;
  replyName?:string;
  images:[any];
  parent:any;
  replyId?:string;
  user: Omit<UserResponse, "email">|any;
  replies?: Comment[];
}