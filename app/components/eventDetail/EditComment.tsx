import React from 'react'
import styles from './editcomment.style.module.css'
import { useAuthContext } from "@/context";
import { MouseEvent } from "react";
interface Props {
    productId: string;
    replyOptions?: replyOptions;
    focus?: boolean;
    isEditComment?: boolean;
    isEditReply?: boolean;
    editText?: string;
    className?: string;
    setShowReplies?: React.Dispatch<React.SetStateAction<boolean>>;
    setShowReplyInput?: React.Dispatch<React.SetStateAction<boolean>>;
}
interface replyOptions {
    commentId: string;
}
export const EditComment = ({
    replyOptions,
    focus,
    isEditComment,
    editText,
    className,
    isEditReply
}: Props) => {
    const commentId = replyOptions?.commentId;
    const [comment, setComment] = React.useState<string>(String(editText));
    // const { openModal, user } = useAuthContext();
    function handleComment(e: MouseEvent<HTMLButtonElement>) {
        const editCommentContainer = e.currentTarget.parentElement?.parentElement;
        const cancelBtn = editCommentContainer?.previousElementSibling;
        const commentText = editCommentContainer?.nextElementSibling as HTMLParagraphElement;
        const inputElement = e.currentTarget.previousSibling as HTMLInputElement;
        // if (!user) {
        //     openModal("SignIn");
        // }
        if (inputElement.value === "") {
            inputElement.placeholder = `${isEditReply ? "Reply" : "Comment"} cannot be empty`;
            setTimeout(() => {
                inputElement.placeholder = isEditReply ? "Leave a reply" : "Leave a comment";
            }, 2000);
            return;
        }
        if (isEditComment && className) {
            /***************  Implement the API for Editing Comments here **************/
            commentText.innerText = comment;
            editCommentContainer?.classList.remove(className);
            cancelBtn?.classList.remove(className);
            commentText?.classList.remove(className);
            return;
        }
        if (isEditReply && className) {
            /***************  Implement the API for Editing Replies here  **************/
            editCommentContainer?.classList.remove(className);
            return;
        }
    }
    return (
        <div className={styles.container}>
            <div className={styles.userAccount}>
                <svg fill="#21293c" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M7,16 L17,16 C19.7614237,16 22,18.2385763 22,21 C22,21.5522847 21.5522847,22 21,22 C20.4871642,22 20.0644928,21.6139598 20.0067277,21.1166211 L19.9949073,20.8237272 C19.9070404,19.3072462 18.6927538,18.0929596 17.1762728,18.0050927 L17,18 L7,18 C5.34314575,18 4,19.3431458 4,21 C4,21.5522847 3.55228475,22 3,22 C2.44771525,22 2,21.5522847 2,21 C2,18.3112453 4.12230671,16.1181819 6.78311038,16.0046195 L7,16 L17,16 L7,16 Z M12,2 C15.3137085,2 18,4.6862915 18,8 C18,11.3137085 15.3137085,14 12,14 C8.6862915,14 6,11.3137085 6,8 C6,4.6862915 8.6862915,2 12,2 Z M12,4 C9.790861,4 8,5.790861 8,8 C8,10.209139 9.790861,12 12,12 C14.209139,12 16,10.209139 16,8 C16,5.790861 14.209139,4 12,4 Z" />
                </svg>
            </div>
            <input
                autoFocus={focus}
                className={`${styles.commentInput}`}
                onChange={(e) => setComment(e.target.value)}
                type="text"
                defaultValue={editText}
            />
            <button onClick={(e) => handleComment(e)} className={styles.commentBtn}>
                {isEditReply ? "Edit Reply" : "Edit Comment"}
            </button>
        </div>
    );
};