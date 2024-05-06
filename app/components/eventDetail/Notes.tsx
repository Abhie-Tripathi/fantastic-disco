import React, { useState, useEffect,useRef } from 'react'
import styles from './notes.module.css';
import { AddComment } from "./AddComment";
import { Comment as IComment } from "../../../types/comment";
import Image from "next/image";
import person1 from '@/public/person2.svg'
import Pdf from '/public/pdf.svg';
// import profileImage from "@/public/profile_Image.jpg";
// import CommentProfileImage from "@/public/profile_Image.jpg";
// import { EditComment } from "./EditComment";
// import { text } from "stream/consumers";
import CommentsData from "@/public/data/commentsData.json";
import ButtonView from '../ButtonView';
import { useTheme } from '@/context';
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
  const { theme } = useTheme()
  const { user, signOut } = useAuthContext();
  const [userDetail, setUserDetail] = useState<UserDetail | null>(user ? user : null);
  const [username, setUserName] = useState([]);
  // const [filePreview, setFilePreview] = useState<string | null>(null);
  const [filePreviews, setFilePreviews] = useState<any>(null);
  const [selectedPdfs, setSelectedPdfs] = useState<string[]>([]);
  useEffect(() => {
    setUserDetail(user);
  }, [user]);
  productId = "017bb854-12d5-4350-aa29-feb4790d06cc";
  const containerRef = useRef(null);
  const [note, setNote] = useState<string>("");
  const [notes, setNotes] = useState<any>(CommentsData);
  const scrollToBottom = () => {
    if (containerRef.current) {
      (containerRef.current as HTMLElement).scrollTop = (containerRef.current as HTMLElement).scrollHeight;
    }
    
  };
  
  useEffect(() => {
    // if(note!==null)
    scrollToBottom();
  },[notes]);
  comments = [...notes];
  console.log(comments);
  const addNote = (event: any) => {

    event.preventDefault();
    // console.log(notes);
    // const { user } = useAuthContext();
    const len = CommentsData?.length;
    const id = Date.now().toString();
    // setNote(note.replace(/\n/g, "<br>"))
    if (note !== "") {

      const updatedNotes = [...notes, {
        id: Date.now().toString(), images: filePreviews, pdfs: selectedPdfs, text: note, user: { id: user?.id, firstname: user?.firstname, lastname: user?.lastname, email: user?.email, createdAt: new Date() }
      }];
      scrollToBottom();
      setNotes(updatedNotes);
      console.log(note);
      // scrollToBottom();
    }
    setNote("");
    setFilePreviews(null);
    setSelectedPdfs([]);
   
  }
  console.log(filePreviews);

  comments = [...notes];
  let arr = Array.from(new Set(comments?.map(comment => "@" + comment?.user?.firstname + comment?.user?.lastname.toLowerCase())));
  return (
    <div className={styles.container}>
      {
        comments ? (
          <div className={styles.commentDiv} ref={containerRef} >
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
                    filePreviews={filePreviews} setFilePreviews={setFilePreviews} selectedPdfs={selectedPdfs} setSelectedPdfs={setSelectedPdfs}
                    arr={arr}
                  />
                </li>
              ))}
            </ul>
          </div>
        )
          : null
      }
      <div className={`${styles.notesAdd} ${theme === 'light' ? styles.notesAdd_light : ""}`}>
        <AddComment productId={productId} notes={addNote} setNote={setNote} note={note} comments={comments} filePreviews={filePreviews} setFilePreviews={setFilePreviews} selectedPdfs={selectedPdfs} setSelectedPdfs={setSelectedPdfs} />
      </div>
    </div>
  );
};


interface CommentProps {
  comment: IComment;
  productId: string;
  superCommentId: string;
  userName?: string;
  notes: (() => void);
  setNote: React.Dispatch<React.SetStateAction<string>>;
  arr?: string[];
  setFilePreviews: any;
  filePreviews: any;
  selectedPdfs: any;
  setSelectedPdfs: any;
  setComments?: React.Dispatch<React.SetStateAction<IComment[]>>;
}
const Comment = ({ comment, productId, setComments, superCommentId, userName, notes, setNote, arr, setFilePreviews,
  filePreviews,
  selectedPdfs,
  setSelectedPdfs, }: CommentProps) => {
    let a = comment.text.split('\n');
    console.log(a);
    let newArr: string[] = [];
    a.map((item, ind) => {
        if (item.length === 0 && (a[ind - 1]?.length === 0 && a[ind + 1]?.length === 0)) {
            newArr.push("space");
        } else if (item.length !== 0) {
            newArr.push(item);
        }
    });
    console.log(newArr);
    

 
    const {theme} = useTheme();
  return (
    <>
      {!arr?.some(ele => comment.text.includes(ele)) ? (
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
              <div className={`${styles.comment_name} ${theme === 'light' && styles.comment_name_light}`}>
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
            <div className={styles.commentText} style={{ color: "grey" }}>
              <span>{userName}</span> {comment.text.split('\n').map((item, index) => {
                if (item.includes('@')) {
                  const words = item.split(' ');
                  return (
                    <React.Fragment key={index}>
                      {words.map((word, idx) => {
                        if (word.startsWith('@')) {
                          const username = word.substring(1);
                          if (arr?.includes("@" + username)) {
                            return (
                              <a key={idx} href={`#${username}`} style={{ color: "white", fontWeight: "800" }}>{word}{" "}</a>
                            );
                          }

                          else {
                            return <React.Fragment key={idx}>{word} </React.Fragment>;
                          }
                        }
                        else if (word.startsWith('#')) {
                          return <React.Fragment key={idx} ><span style={{ backgroundColor: "#2B233D", color: "white", padding: "0px 4px", borderRadius: "10px" }}>{word}</span></React.Fragment>
                        }
                        else {
                          return <React.Fragment key={idx}>{word} </React.Fragment>;
                        }
                      })}
                      <br />
                    </React.Fragment>
                  );
                } else {
                  if (item.length === 0 && item) {
                    // If line is empty, return an empty <p> tag with a unique key
                    return <p key={index} style={{ margin: 0 }}>&nbsp;</p>;
                } else {
                    // If line is not empty, return the line wrapped in a <p> tag
                    return <p key={index} style={{ margin: 0 }}>{item}</p>;
                }
                }
              })}
            </div>
            <div className={styles.images}>
              {comment?.images?.map((image, index) => (
                <div key={index}>
                  <Image src={URL.createObjectURL(image)} alt={image.name} width={200} height={150} />
                </div>
              ))}
            </div>
            {/* <div style={{ display: "flex", gap: "10px"}}>

            {comment?.pdfs?.map((item: any, ind: number) => (
  <div className={styles.pdf} key={ind} style={{ width: "200px", height:"150px",overflow: 'hidden' }}>
    <iframe src={URL.createObjectURL(item)} className={styles.pdf} style={{ border: "none", outline: "none", width: "90%", height: "100%", overflow: "hidden",scrollbarWidth: "thin" }} title="PDF Preview" scrolling="no" />
  </div>
))}

            </div> */}
            <div style={{display:"flex",gap:"10px"}}>
        {comment?.pdfs?.map((item:any, ind:number) => (
          
          <div key={ind} className={styles.pdf}>
           
          <Image src={Pdf} width={50} height={50} alt="pdf"/>
          <p key={ind} style={{display:"flex"}}>{item.name}</p>
          </div>
        ))}
        </div>
          </div>
          <div className={styles.options}>
            <ButtonView view={"upvoteBtn"} />
            <ButtonView view={"replyBtn"} />
            {comment?.user?.createdAt ? (<p>
              {new Date(comment.user.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
              })}
            </p>) : (<p>Mar 20,2024</p>)}
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
              filePreviews={filePreviews} setFilePreviews={setFilePreviews} selectedPdfs={selectedPdfs} setSelectedPdfs={setSelectedPdfs}
            />Unassigned
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
                    filePreviews={filePreviews} 
                    setFilePreviews={setFilePreviews} 
                    selectedPdfs={selectedPdfs} 
                    setSelectedPdfs={setSelectedPdfs}
                    userName={"@Roxette"} />
                </li>
              );
            })}
          </ul>
        </>) : (
        <>
          <div className={styles.comment__user}>
          </div>
          <ButtonView view={"cancelBtn"} productId={productId} commentId={comment.id} commentText={comment.text} />
          <div className={styles.text1}>
            <span className={styles.imgContainer}>
              <Image
                width={30}
                height={30}

                src={person1}
                alt=""
              />
            </span>
            <div className={styles.commentText1} >
              <span>{userName}</span> {comment.text.split('\n').map((item, index) => {
                if (item.includes('@')) {
                  const words = item.split(' ');
                  return (
                    <React.Fragment key={index}>
                      {words.map((word, idx) => {
                        if (word.startsWith('@')) {
                          const username = word.substring(1);
                          <header>

                            <div className={styles.comment_name} style={{ color: "grey" }}>
                              <span>
                                {comment.user?.firstname} {comment.user?.lastname}
                                <span> @{`${comment.user.firstname}${comment.user.lastname.charAt(0).toLowerCase()}${comment.user.lastname.slice(1)}`}</span>
                              </span>

                              <p className={styles.designationText}>Founder and leadership at Nityo Infotech</p>
                            </div>
                          </header>
                          if (arr?.includes("@" + username)) {
                            return (
                              <a key={idx} href={`#${username}`} style={{ color: "white", fontWeight: "800" }}>{word}{" "}</a>
                            );
                          } else {
                            return <React.Fragment key={idx}>{word} </React.Fragment>;
                          }
                        }
                        else if (word.startsWith('#')) {
                          return <React.Fragment key={idx} ><span style={{ backgroundColor: "#2B233D", color: "white", padding: "4px", borderRadius: "10px" }}>{word}</span></React.Fragment>
                        }
                        else {
                          return <React.Fragment key={idx}>{word} </React.Fragment>;
                        }
                      })}
                      {comment?.user?.createdAt && (
                        <span style={{ paddingLeft: "5px" }}>
                          on{" "}
                          {new Date(comment.user.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric'
                          })}
                        </span>
                      )}

                      <br />
                    </React.Fragment>
                  );
                } else {
                  return <p key={index}>{item || '\u00A0'}</p>;
                }
              })}
            </div>

          </div>
          {/* <div className={styles.options}>
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
      </ul> */}
        </>)}

    </>
  );
};
