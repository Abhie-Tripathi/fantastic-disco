import React,{useState, useEffect} from 'react'
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
import { useAuthContext } from "@/context";

interface UserDetail {
  firstname: string;
  email: string;
  lastname: string;
}
interface Props {
  productId?: string | undefined,
  comments?: IComment[];
}

export const Notes = ({ comments, productId }: Props) => {
  const { user, signOut } = useAuthContext();
  const [userDetail, setUserDetail] = useState<UserDetail | null>(user ? user : null);
  const [username,setUserName]=useState([]);

  useEffect(() => {
    setUserDetail(user);
  }, [user]);
  productId = "017bb854-12d5-4350-aa29-feb4790d06cc";
 
  const [note, setNote] = useState<string>("");
  const [notes,setNotes]=useState<any>(CommentsData);
  
  comments = [...notes];
  console.log(comments);
  const addNote=()=>{
    // console.log(notes);
    // const { user } = useAuthContext();
    const len=CommentsData?.length;
    const id = Date.now().toString();
    const updatedNotes = [...notes, { id: Date.now().toString(), text: note, user:{id: user?.id, firstname:user?.firstname, lastname:user?.lastname, email:user?.email, createdAt:new Date()}
    }];
    setNotes(updatedNotes);
    setNote("");
  }
  comments=[...notes];
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
                    notes={notes} setNote={setNote} 
                  />
                </li>
              ))}
            </ul>
          </div>
        )
          : null
      }
      <div className={styles.notesAdd}>
        <AddComment productId={productId} notes={addNote} setNote={setNote} note={note} comments={comments}/>
      </div>
    </div>
  );
};


interface CommentProps {
  comment: IComment;
  productId: string;
  superCommentId: string;
  userName?: string;
  notes:(()=>void);
  setNote:React.Dispatch<React.SetStateAction<string>>;
  setComments?: React.Dispatch<React.SetStateAction<IComment[]>>;
}
const Comment = ({ comment, productId, setComments, superCommentId, userName, notes, setNote }: CommentProps) => {
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
          notes={notes} setNote={setNote} 
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
                notes={notes} setNote={setNote} 
                userName={"@Roxette"} />
            </li>
          );
        })}
      </ul>
    </>
  );
};
