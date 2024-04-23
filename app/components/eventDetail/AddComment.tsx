"use client";
import React, { SetStateAction } from "react";
import styles from "./addcomment.style.module.css";
import { Comment as IComment } from "../../../types/comment";
import { useAuthContext } from "@/context";
import { MouseEvent } from "react";
import Send from '@/public/send.svg';
import Attach from '@/public/attach.svg';
import Link from '@/public/link.svg'
import Emoji from '@/public/emoji.svg'
import Pic from '@/public/image.svg'
import Pen from '@/public/pen.svg'
import Drive from '@/public/drive.svg'
import Lock from '@/public/lock.svg'
import Image from "next/image";
// import { useProduct } from "@/hooks/useProduct";
import { revalidateComment } from "@/utils/commentAction";

interface Props {
    productId: string;
    replyOptions?: replyOptions;
    focus?: boolean;
    isEditComment?: boolean;
    isEditReply?: boolean;
    editCommentText?: string;
    className?: string;
    repliesLength?: number
  }
  interface replyOptions {
    commentId: string;
  }
  export const AddComment = ({
    productId,
    replyOptions,
    focus,
    isEditComment,
    isEditReply,
    className,
    repliesLength,
  }: Props) => {
    const commentId = replyOptions?.commentId;
    const isReply = isEditComment || isEditReply ? false : !!commentId;
    const [comment, setComment] = React.useState<string>("");
    // const { commentOnProduct, replyToComment } = useProduct();
    // const { openModal, user } = useAuthContext();
    function handleComment(e: MouseEvent<HTMLButtonElement>) {
      const el = e.currentTarget.previousSibling as HTMLInputElement;
    //   if (!user) {
    //     openModal("SignIn");
    //   }
      if (el.value === "") {
        el.placeholder = `${isReply ? "Reply" : "Comment"} cannot be empty`;
        el.classList.add(`${styles.activePlaceholder}`);
        setTimeout(() => {
          el.placeholder = isReply ? "Leave a reply" : "Leave a comment";
          el.classList.remove(`${styles.activePlaceholder}`);
        }, 2000);
        return;
      }
      if (isEditComment) {
        /*
         * Found duplicate functionality in Edit Comment Section.
         * Either implement the API here or in Edit Comments Component 
         */
        return;
      }
      if (isEditReply) {
        /*
         * Found duplicate functionality in Edit Comment Section.
         * Either implement the API here or in Edit Comments Component 
         */
        return;
      }
      if (isReply) {
        // console.log(e.currentTarget.parentElement?.parentElement);
        // const addCommentContainer: HTMLElement | null | undefined = e.currentTarget.parentElement?.parentElement;
        const addMoreCommentSection: Element | null | undefined = e.currentTarget.parentElement?.parentElement;
        const viewMoreReplies: Element | null | undefined = addMoreCommentSection?.nextElementSibling;
        const repliesList: Element | null | undefined = viewMoreReplies?.nextElementSibling;
        const replyBtn = addMoreCommentSection?.previousElementSibling?.childNodes[1] as HTMLButtonElement;
        // replyToComment(productId, commentId!, comment).then((data: IComment) => {
        //   if (data) {
        //     setComment("");
        //     revalidateComment(productId);
        //   }
        // });
        replyBtn.innerHTML = "Reply";
        addMoreCommentSection?.classList.remove(className!);
        viewMoreReplies!.innerHTML = `Hide ${repliesLength} Replies`;
        repliesList?.classList.add(className!);
  
        return;
      }
    //   commentOnProduct(productId, comment).then((data) => {
    //     if (data) {
    //       setComment("");
    //       revalidateComment(productId);
    //     }
    //   });
    }
    return (
   
      <div className={styles.container}>
        {/* <div className={styles.userAccount}>
          <svg fill="#21293c" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M7,16 L17,16 C19.7614237,16 22,18.2385763 22,21 C22,21.5522847 21.5522847,22 21,22 C20.4871642,22 20.0644928,21.6139598 20.0067277,21.1166211 L19.9949073,20.8237272 C19.9070404,19.3072462 18.6927538,18.0929596 17.1762728,18.0050927 L17,18 L7,18 C5.34314575,18 4,19.3431458 4,21 C4,21.5522847 3.55228475,22 3,22 C2.44771525,22 2,21.5522847 2,21 C2,18.3112453 4.12230671,16.1181819 6.78311038,16.0046195 L7,16 L17,16 L7,16 Z M12,2 C15.3137085,2 18,4.6862915 18,8 C18,11.3137085 15.3137085,14 12,14 C8.6862915,14 6,11.3137085 6,8 C6,4.6862915 8.6862915,2 12,2 Z M12,4 C9.790861,4 8,5.790861 8,8 C8,10.209139 9.790861,12 12,12 C14.209139,12 16,10.209139 16,8 C16,5.790861 14.209139,4 12,4 Z" />
          </svg>
        </div> */}
        {/* <input
          autoFocus={focus}
          className={`${styles.commentInput}`}
          onChange={(e) => setComment(e.target.value)}
          type="text"
          value={comment}
          placeholder={isReply ? "Leave a reply" : "Leave a comment"}
        /> */}
        <div className={styles.addNotes}>
        <input type="text" placeholder="Take a note, @name"/>
        <div style={{display:"flex"}}><Image src={Send} alt="send"/></div>
        </div>

        <button onClick={(e) => handleComment(e)} className={styles.commentBtn}>
          {isReply ? isEditComment ? "Edit Comment" : "Reply" : "Comment"}
        </button>
        <div className={styles.attachmentOption}>
          <Image className={styles.attachIcon} src={Attach} alt="attach"/>
          <Image className={styles.attachIcon} src={Link} alt="link"/>
          <Image className={styles.attachIcon} src={Emoji} alt="emoji"/>
          <Image className={styles.attachIcon} src={Drive} alt="drive"/>
          <Image className={styles.attachIcon} src={Pic} alt="image"/>
          <Image className={styles.attachIcon} src={Lock} alt="lock"/>
          <Image className={styles.attachIcon} src={Pen} alt="pen"/>
        </div>
      </div>
    );
  };