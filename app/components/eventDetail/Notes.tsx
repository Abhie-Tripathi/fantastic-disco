import React from 'react'
import styles from './notes.module.css';
import { AddComment } from "./AddComment";
import { Comment as IComment } from "../../../types/comment";
import Image from "next/image";
import person1 from '@/public/person2.svg'
// import profileImage from "@/public/profile_Image.jpg";
// import CommentProfileImage from "@/public/profile_Image.jpg";
// import { EditComment } from "./EditComment";
// import { text } from "stream/consumers";
import CommentsData from "@/public/data/commentsData.json";
import ButtonView from '../ButtonView';

interface Props {
  productId?: string | undefined,
  comments?: IComment[];
}

export const Notes = ({ comments, productId }: Props) => {
  productId = "017bb854-12d5-4350-aa29-feb4790d06cc";
  comments = [...CommentsData];
  return (
    <div className={styles.container}>
      {
        comments ? (
          <div className={styles.commentDiv}>
            <ul className={styles.comments}>
              {comments.map((comment) => (
                <li
                  className={comment.replies?.length! > 0 ? styles.thread : ""}
                  data-id={comment.id}
                  key={comment.id}
                  id="commentList"
                >
                  <Comment
                    productId={productId!}
                    comment={comment}
                    superCommentId={comment.id}
                  />
                </li>
              ))}
            </ul>
          </div>
        )
          : null
      }
      <div className={styles.notesAdd}>
        <AddComment productId={productId} />
      </div>
    </div>
  );
};


interface CommentProps {
  comment: IComment;
  productId: string;
  superCommentId: string;
  userName?: string;
  setComments?: React.Dispatch<React.SetStateAction<IComment[]>>;
}
const Comment = ({ comment, productId, setComments, superCommentId, userName }: CommentProps) => {
  return (
    <>
      <div className={styles.comment__user}>
        <header>
          <span className={styles.imgContainer}>
            <Image
              width={50}
              height={50}
              className={styles.userImage}
              src={person1}
              alt=""
            />
          </span>
          <div className={styles.comment_name}>
            <span>
              {comment.user?.firstname} {comment.user?.lastname}
              <span> @{`${comment.user.firstname}${comment.user.lastname.charAt(0).toLowerCase()}${comment.user.lastname.slice(1)}`}</span>
            </span>

            <p className={styles.designationText}>Founder and leadership at Nityo Infotech</p>
          </div>
        </header>

      </div>
      <ButtonView view={"cancelBtn"} productId={productId} commentId={comment.id} commentText={comment.text} />
      <div className={styles.text}>
        <p className={styles.commentText}><span>{userName}</span> {comment.text}</p>
      </div>
      <div className={styles.options}>
        <ButtonView view={"upvoteBtn"} />
        <ButtonView view={"replyBtn"} />
        <p>Mar 20,2024</p>
        <ButtonView view={"editDeleteButton"} commentUserId={comment.user.id} />
      </div>
      <div className={styles.addMoreCommentSection}>
        <AddComment
          focus
          replyOptions={{ commentId: superCommentId }}
          productId={productId!}
          className={`${styles.active}`}
          repliesLength={comment.replies?.length}
        />
      </div>
      <ButtonView view={"viewMoreReplies"} repliesLength={comment.replies?.length}></ButtonView>
      <ul className={styles.replies} id="replyContainer">
        {comment.replies?.map((reply) => {
          return (
            <li
              className={reply.replies?.length! > 0 ? styles.thread : ""}
              key={reply.id}
            >
              <Comment
                comment={reply}
                setComments={setComments!}
                productId={productId}
                superCommentId={superCommentId}
                userName={"@Roxette"} />
            </li>
          );
        })}
      </ul>
    </>
  );
};
