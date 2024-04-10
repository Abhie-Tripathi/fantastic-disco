"use client";
import { MouseEvent, useState } from "react";
import styles from "./eventDetail/notes.module.css";
import { EditComment } from "./eventDetail/EditComment";
// import { AddComment } from "./eventDetail/AddComment";
import Image from "next/image";
import swap_icon from "/public/swap.svg";
import expand_more from "/public/expand_more.svg";
import Pin from "/public/pin.svg";
import Arrow_Up from "/public/arrow_up.svg";
import dots from "/public/dots.svg";
type Props = {
    view: string;
    commentUserId?: string;
    productId?: string;
    commentId?: string;
    commentText?: string;
    repliesLength?: number;
}
const ButtonView = ({ view, commentUserId, productId, commentId, commentText, repliesLength }: Props) => {
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [showReplyInput, setShowReplyInput] = useState<boolean>(false);
    // const { user } = useAuthContext();
    const userData = typeof window !== 'undefined' ? window.localStorage.getItem('user') : null;
    const user = userData ? JSON.parse(userData) : null;
    const handleShowReplies = (e: MouseEvent<HTMLParagraphElement>): void => {
        const el: DOMTokenList | undefined = e.currentTarget.nextElementSibling?.classList;
        if (el) {
            if (el.contains(`${styles.active}`)) {
                el.remove(`${styles.active}`);
                e.currentTarget.innerText = `View ${repliesLength} replies`;
            }
            else {
                el.add(`${styles.active}`);
                e.currentTarget.innerText = `Hide ${repliesLength} replies`;
            }
        }
    }
    const handleShowReplyInput = (e: MouseEvent): void => {
        const addMoreCommentSection: Element | null | undefined = e.currentTarget.parentElement?.nextElementSibling;
        if (addMoreCommentSection) {
            if (addMoreCommentSection.classList.contains(`${styles.active}`)) {
                addMoreCommentSection.classList.remove(`${styles.active}`);
                e.currentTarget.innerHTML = "Reply";
            } else {
                addMoreCommentSection.classList.add(`${styles.active}`);
                e.currentTarget.innerHTML = "Cancel";
            }
        }
    }
    const handleShowEdit = (e: MouseEvent<HTMLButtonElement>): void => {
        const editComment = e.currentTarget.nextElementSibling;
        const commentText = editComment?.nextElementSibling;
        if (commentText && editComment) {
            editComment.classList.remove(`${styles.active}`);
            commentText.classList.remove(`${styles.active}`);
            e.currentTarget.classList.remove(`${styles.active}`);
        }
    }
    const handleClick = (): void => {
        setShowDropdown(showDropdown => !showDropdown);
    }
    const handleEdit = (e: MouseEvent<HTMLButtonElement>): void => {
        setShowDropdown(showDropdown => !showDropdown);
        const commentText: Element | null | undefined = e.currentTarget.parentElement?.parentElement?.previousElementSibling;
        const editCommentContainer = commentText!.previousElementSibling;
        const cancelBtn = editCommentContainer?.previousElementSibling;

        if (editCommentContainer && cancelBtn) {
            commentText?.classList.add(`${styles.active}`);
            editCommentContainer.classList.add(`${styles.active}`);
            cancelBtn.classList.add(`${styles.active}`);
        }
    }
    const handleDelete = (): void => {
        setShowDropdown(showDropdown => !showDropdown);
    }
    return (
        <>
            {
                view === "editDeleteButton" ?
                    <>
                        <Image src={dots} alt={"Dots"} className={`${styles.dots} ${styles.active}`} onClick={handleClick} />
                        {
                            showDropdown ? (
                                <div className={styles.dropdown}>
                                    {
                                        user?.id === commentUserId ? (
                                            <>
                                                <button type="button" className={styles.edit} onClick={handleEdit}>Edit Comment</button>
                                                <button type="button" className={styles.delete} onClick={handleDelete}>Delete Comment</button>
                                            </>
                                        )
                                            :
                                            (
                                                <button type="button" className={styles.delete}>Report User</button>
                                            )
                                    }
                                </div>
                            ) : null
                        }
                    </> :
                    view === "cancelBtn" ?
                        <>
                            <button type="button" className={styles.cancelBtn} onClick={handleShowEdit}>Cancel</button>
                            <div className={styles.editCommentContainer}>
                                <EditComment
                                    productId={productId!}
                                    replyOptions={{ commentId: commentId! }}
                                    editText={commentText}
                                    isEditComment={true}
                                    className={`${styles.active}`}
                                />
                            </div >
                        </>
                        :
                        view === "replyBtn" ?
                            <>
                                <button type="button" onClick={handleShowReplyInput} className={styles.replyBtn}>Reply</button>
                                {/* {
                                    showReplyInput && (
                                        <AddComment
                                            focus
                                            replyOptions={{ commentId: commentId! }}
                                            productId={productId!}
                                            className={`${styles.active}`}
                                            setShowReplyInput={setShowReplyInput}
                                        />
                                    )
                                } */}
                            </>
                            :
                            view === "sortByButton" ?

                                <button type="button" className={styles.sortByButton}>
                                    <Image alt="Swap" src={swap_icon}></Image>
                                    Sort By
                                    <Image alt="Expand" src={expand_more}></Image>
                                </button>
                                :
                                view === "pinButton" ?
                                    <button type="button" className={styles.pinButton}>
                                        <Image src={Pin} alt="Pin"></Image>
                                        Pin
                                    </button>
                                    :
                                    view === "upvoteBtn" ?
                                        <>
                                            <button type="button" className={styles.upvoteBtn}>
                                                <Image src={Arrow_Up} alt={"Arrow Up"} width={30} height={30}></Image>
                                                Upvote
                                            </button>
                                        </> :
                                        view === "viewMoreReplies" ?
                                            <>
                                                <p onClick={handleShowReplies} className={styles.viewMoreReplies}>{repliesLength && repliesLength > 0 ? `View ${repliesLength} replies` : ""}</p>
                                            </>

                                            : null
            }
        </>
    )
}
export default ButtonView;