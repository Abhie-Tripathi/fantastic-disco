import React, { useState, useEffect, useRef } from "react";
import styles from "./notes.module.css";
import { AddComment } from "./AddComment";
import { Comment as IComment } from "../../../types/comment";
import Image from "next/image";
import close from "@/public/close.svg";
import person1 from "@/public/person2.svg";
import Pdf from "/public/pdf.svg";
// import profileImage from "@/public/profile_Image.jpg";
// import CommentProfileImage from "@/public/profile_Image.jpg";
// import { EditComment } from "./EditComment";
// import { text } from "stream/consumers";
import CommentsData from "@/public/data/commentsData.json";
import ButtonView from "../ButtonView";
import { useTheme } from "@/context";
import { useAuthContext } from "@/context";

interface UserDetail {
  firstname: string;
  email: string;
  lastname: string;
}
interface Props {
  productId?: string | undefined;
  comments?: IComment[];
}

export const Notes = ({ comments, productId }: Props) => {
  const { theme } = useTheme();
  const { user, signOut } = useAuthContext();
  const [isDraggingOver, setIsDraggingOver] = useState(true);
  const [drop, setDrop] = useState(false);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(
    user ? user : null
  );
  const [username, setUserName] = useState([]);
  const wrapperRef = useRef(null);
  // const [filePreview, setFilePreview] = useState<string | null>(null);
  const [filePreviews, setFilePreviews] = useState<any>([]);
  const [selectedPdfs, setSelectedPdfs] = useState<string[]>([]);
  const [replyId, setReplyId] = useState<string | undefined>("");
  useEffect(() => {
    setUserDetail(user);
  }, [user]);
  productId = "017bb854-12d5-4350-aa29-feb4790d06cc";
  const containerRef = useRef(null);
  const commentRef = useRef(null);
  const [note, setNote] = useState<string>("");
  const [height, setHeight] = useState<number | null>(null);
  const [notes, setNotes] = useState<any>(CommentsData);
  const scrollToBottom = () => {
    if (containerRef.current) {
      (containerRef.current as HTMLElement).scrollTop = (
        containerRef.current as HTMLElement
      ).scrollHeight;
    }
  };

  useEffect(() => {
    // if(note!==null)
    if (commentRef.current) {
      const height = (commentRef.current as HTMLElement).clientHeight;
      setHeight(height);
    }
    scrollToBottom();
  }, [notes]);
  comments = [...notes];
  console.log(comments);
  const addNote = (event: any) => {
    event.preventDefault();
    // console.log(notes);
    // const { user } = useAuthContext();
    const len = CommentsData?.length;
    const id = Date.now().toString();
    // setNote(note.replace(/\n/g, "<br>"))
    console.log(11111111 + filePreviews);
    if (filePreviews) console.log("file file");

    if (
      note.length !== 0 ||
      filePreviews.length !== 0 ||
      selectedPdfs?.length !== 0
    ) {
      const updatedNotes = [
        ...notes,
        {
          id: Date.now().toString(),
          images: filePreviews,
          pdfs: selectedPdfs,
          text: note,
          user: {
            id: user?.id,
            firstname: user?.firstname,
            lastname: user?.lastname,
            email: user?.email,
            createdAt: new Date(),
          },
        },
      ];
      scrollToBottom();
      setNotes(updatedNotes);
      console.log(note);
      // scrollToBottom();
    }
    setNote("");
    setFiles(null);
    // setDrop(true);
    setFilePreviews([]);
    setSelectedPdfs([]);
  };
  console.log(filePreviews);
  const [files, setFiles] = useState<File | null>(null);
  const handleDragOver = (event: React.DragEvent) => {
    console.log("HandleDragver", event);
    event.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setFiles(event?.dataTransfer.files[0]);
    setDrop(false);
    // if (!files) return; // Exit early if files is null or undefined
    // // setDrop(true);
    // console.log(files);

    // if (files && files.type === "application/pdf") {
    // setSelectedPdfs([...selectedPdfs, files.name]);
    // }else if(files.type.startsWith('image/')){
    // setFilePreviews((prevSelectedFiles: File[] | null) => {
    // if (
    // prevSelectedFiles === null ||
    // typeof prevSelectedFiles === "undefined"
    // ) {
    // return [files];
    // } else {
    // return [...prevSelectedFiles,files];
    // }
    // });
    // }
    // else {
    // // Handle case when file is not a PDF
    // console.log("Please select a PDF file.");
    // }
  };
  useEffect(() => {
    if (!files) return; // Exit early if files is null or undefined
    // setDrop(true);
    console.log(files);

    if (files && files.type === "application/pdf") {
      setSelectedPdfs([...selectedPdfs, files.name]);
    } else if (files.type.startsWith("image/")) {
      setFilePreviews((prevSelectedFiles: File[] | null) => {
        if (
          prevSelectedFiles === null ||
          typeof prevSelectedFiles === "undefined"
        ) {
          return [files];
        } else {
          return [...prevSelectedFiles, files];
        }
      });
    } else {
      // Handle case when file is not a PDF
      console.log("Please select a PDF file.");
    }
  }, [files]);

  // useEffect(() => {
  // if (files) {
  // setDrop(true);
  // }
  // }, [files]);

  // console.log("drop is "+ drop);
  useEffect(() => {
    setTimeout(() => {
      console.log(height);
    }, 1000);
  });

  comments = [...notes];
  let arr = Array.from(
    new Set(
      comments?.map(
        (comment) =>
          "@" + comment?.user?.firstname + comment?.user?.lastname.toLowerCase()
      )
    )
  );
  const onDragEnter = () => {
    setDrop(true);


  }
  const onDragLeave = () => {
    setDrop(false);

  }
  setTimeout(() => {
    console.log(replyId);
  }, 1000);
  const [replyText, setReplyText] = useState<string | undefined
  >("");
  useEffect(() => {
    const reply = comments?.find(comment => comment.id == replyId);
    console.log("reply is: " + reply?.text);
    setReplyText(reply?.text);
  }, [replyId])
  return (
    <div className={styles.container}>

      {comments ? (
        <div
          className={styles.commentDiv}
          ref={containerRef}
          style={{ position: "relative" }}
        >
          <div
            className={styles.cont}
            style={{
              position: "absolute",
              width: "100%",
              top: 0,
              left: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: `${height}px`,
              background: theme === "dark" ? "white" : "#1a1a1a",
              zIndex: drop ? 1 : 0,
              overflowY: "scroll",
              opacity: drop ? 0.5 : 0,
            }}
            onDragEnter={onDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={onDragLeave}
            onDrop={handleDrop}
          ></div>
          <ul className={styles.comments} ref={commentRef}>
            {comments.map((comment) => (
              <li
                className={comment.replies?.length! > 0 ? styles.thread : ""}
                data-id={comment.id}
                key={comment.id}
                id="commentList"
              >
                <Comment
                  setReplyId={setReplyId}
                  productId={productId!}
                  comment={comment}
                  superCommentId={comment.id}
                  notes={notes}
                  setNote={setNote}
                  filePreviews={filePreviews}
                  setFilePreviews={setFilePreviews}
                  selectedPdfs={selectedPdfs}
                  setSelectedPdfs={setSelectedPdfs}
                  arr={arr}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {replyId &&
        <div className={styles.replyDiv}>
          <div className={styles.outerReplyDiv}>
            <div className={styles.replyText}>{replyText}</div>
          </div>
          <div ><Image onClick={() => setReplyId(undefined)} className={styles.closeBtn} src={close} alt="close" /></div>
        </div>
      }
      <div
        className={`${styles.notesAdd} ${theme === "light" ? styles.notesAdd_light : ""
          }`}
      >
        <AddComment
          replyId={replyId}
          productId={productId}
          notes={addNote}
          setNote={setNote}
          note={note}
          comments={comments}
          filePreviews={filePreviews}
          setFilePreviews={setFilePreviews}
          selectedPdfs={selectedPdfs}
          setSelectedPdfs={setSelectedPdfs}
          commentType={"mainComment"}
        />

      </div>
    </div>
  );
};

interface CommentProps {
  setReplyId?: any,
  comment: IComment;
  productId: string;
  superCommentId: string;
  userName?: string;
  notes: () => void;
  setNote: React.Dispatch<React.SetStateAction<string>>;
  arr?: string[];
  setFilePreviews: any;
  filePreviews: any;
  selectedPdfs: any;
  setSelectedPdfs: any;
  setComments?: React.Dispatch<React.SetStateAction<IComment[]>>;
}
const Comment = ({
  comment,
  productId,
  setReplyId,
  setComments,
  superCommentId,
  userName,
  notes,
  setNote,
  arr,
  setFilePreviews,
  filePreviews,
  selectedPdfs,
  setSelectedPdfs,
}: CommentProps) => {
  let a = comment.text.split("\n");
  console.log(a);
  let newArr: string[] = [];
  a.map((item, ind) => {
    if (
      item.length === 0 &&
      a[ind - 1]?.length === 0 &&
      a[ind + 1]?.length === 0
    ) {
      newArr.push("space");
    } else if (item.length !== 0) {
      newArr.push(item);
    }
  });
  console.log(newArr);
  // const [replyId,setReplyId]=useState("");
  const handleReply = (id: string) => {
    setReplyId(id);
  }
  const { theme } = useTheme();
  return (
    <>
      {!arr?.some((ele) => comment.text.includes(ele)) ? (
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
              <div
                className={`${styles.comment_name} ${theme === "light" && styles.comment_name_light
                  }`}
              >
                <span>
                  {comment.user?.firstname} {comment.user?.lastname}
                  <span>
                    {" "}
                    @
                    {`${comment.user.firstname}${comment.user.lastname
                      .charAt(0)
                      .toLowerCase()}${comment.user.lastname.slice(1)}`}
                  </span>
                </span>

                <p className={styles.designationText}>
                  Founder and leadership at Nityo Infotech
                </p>
              </div>
            </header>
          </div>

          <ButtonView
            view={"cancelBtn"}
            productId={productId}
            commentId={comment.id}
            commentText={comment.text}
          />
          <div className={styles.text}>
            <div className={styles.commentText} style={{ color: "grey" }}>
              <span>{userName}</span>{" "}
              {comment &&
                comment.text.split("\n").map((item, index) => {
                  if (item.includes("@")) {
                    const words = item.split(" ");
                    return (
                      <React.Fragment key={index}>
                        {words.map((word, idx) => {
                          if (word.startsWith("@")) {
                            const username = word.substring(1);
                            if (arr?.includes("@" + username)) {
                              return (
                                <a
                                  key={idx}
                                  href={`#${username}`}
                                  style={{ color: "white", fontWeight: "800" }}
                                >
                                  {word}{" "}
                                </a>
                              );
                            } else {
                              return (
                                <React.Fragment key={idx}>
                                  {word}{" "}
                                </React.Fragment>
                              );
                            }
                          } else if (word.startsWith("#")) {
                            return (
                              <React.Fragment key={idx}>
                                <span
                                  style={{
                                    backgroundColor: "#2B233D",
                                    color: "white",
                                    padding: "0px 4px",
                                    borderRadius: "10px",
                                  }}
                                >
                                  {word}
                                </span>
                              </React.Fragment>
                            );
                          } else {
                            return (
                              <React.Fragment key={idx}>{word} </React.Fragment>
                            );
                          }
                        })}
                        <br />
                      </React.Fragment>
                    );
                  } else {
                    if (item.length === 0 && item) {
                      // If line is empty, return an empty <p> tag with a unique key
                      return (
                        <p key={index} style={{ margin: 0 }}>
                          &nbsp;
                        </p>
                      );
                    } else {
                      // If line is not empty, return the line wrapped in a <p> tag
                      return (
                        <p key={index} style={{ margin: 0 }}>
                          {item}
                        </p>
                      );
                    }
                  }
                })}
            </div>
            <div className={styles.images}>
              {comment?.images?.map((image, index) => (
                <div key={index}>
                  <Image
                    src={URL.createObjectURL(image)}
                    alt={image.name}
                    width={200}
                    height={150}
                  />
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
            <div style={{ display: "flex", gap: "10px" }}>
              {comment?.pdfs?.map((item: any, ind: number) => (
                <div
                  key={ind}
                  className={`${styles.pdf} ${theme === "light" && styles.pdf_light
                    }`}
                >
                  <Image src={Pdf} width={50} height={50} alt="pdf" />
                  <p key={ind} style={{ display: "flex" }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.options}>
            <ButtonView view={"upvoteBtn"} />
            <button onClick={() => handleReply(comment.id)} className={styles.replyBtn}>Reply</button>
            {/* <ButtonView view={"replyBtn"} /> */}
            {comment?.user?.createdAt ? (
              <p>
                {new Date(comment.user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </p>
            ) : (
              <p>Mar 20,2024</p>
            )}
            <ButtonView
              view={"editDeleteButton"}
              commentUserId={comment.user.id}
            />
          </div>
          <div className={styles.addMoreCommentSection}>
            <AddComment
              focus
              replyOptions={{ commentId: superCommentId }}
              productId={productId!}
              className={`${styles.active}`}
              repliesLength={comment.replies?.length}
              notes={notes}
              setNote={setNote}
              filePreviews={filePreviews}
              setFilePreviews={setFilePreviews}
              selectedPdfs={selectedPdfs}
              setSelectedPdfs={setSelectedPdfs}
              commentType={"subComment"}
            />

          </div>

          <ButtonView
            view={"viewMoreReplies"}
            repliesLength={comment.replies?.length}
          ></ButtonView>
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
                    notes={notes}
                    setNote={setNote}
                    filePreviews={filePreviews}
                    setFilePreviews={setFilePreviews}
                    selectedPdfs={selectedPdfs}
                    setSelectedPdfs={setSelectedPdfs}
                    userName={"@Roxette"}
                  />
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <>
          <div className={styles.comment__user}></div>
          <ButtonView
            view={"cancelBtn"}
            productId={productId}
            commentId={comment.id}
            commentText={comment.text}
          />
          <div className={styles.text1}>
            <span className={styles.imgContainer}>
              <Image width={30} height={30} src={person1} alt="" />
            </span>
            <div className={styles.commentText1}>
              <span>{userName}</span>{" "}
              {comment.text.split("\n").map((item, index) => {
                if (item.includes("@")) {
                  const words = item.split(" ");
                  return (
                    <React.Fragment key={index}>
                      {words.map((word, idx) => {
                        if (word.startsWith("@")) {
                          const username = word.substring(1);
                          <header>
                            <div
                              className={styles.comment_name}
                              style={{ color: "grey" }}
                            >
                              <span>
                                {comment.user?.firstname}{" "}
                                {comment.user?.lastname}
                                <span>
                                  {" "}
                                  @
                                  {`${comment.user.firstname
                                    }${comment.user.lastname
                                      .charAt(0)
                                      .toLowerCase()}${comment.user.lastname.slice(
                                        1
                                      )}`}
                                </span>
                              </span>

                              <p className={styles.designationText}>
                                Founder and leadership at Nityo Infotech
                              </p>
                            </div>
                          </header>;
                          if (arr?.includes("@" + username)) {
                            return (
                              <a
                                key={idx}
                                href={`#${username}`}
                                className={`${styles.span} ${theme === 'light' && styles.span_light}`}

                              >
                                {word}{" "}
                              </a>
                            );
                          } else {
                            return (
                              <React.Fragment key={idx}>{word} </React.Fragment>
                            );
                          }
                        } else if (word.startsWith("#")) {
                          return (
                            <React.Fragment key={idx}>
                              <span
                                style={{
                                  backgroundColor: "#2B233D",
                                  color: "white",
                                  padding: "4px",
                                  borderRadius: "10px",
                                }}
                              >
                                {word}
                              </span>
                            </React.Fragment>
                          );
                        } else {
                          return (
                            <React.Fragment key={idx}>{word} </React.Fragment>
                          );
                        }
                      })}
                      {comment?.user?.createdAt && (
                        <span style={{ paddingLeft: "5px" }}>
                          on{" "}
                          {new Date(comment.user.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </span>
                      )}

                      <br />
                    </React.Fragment>
                  );
                } else {
                  return <p key={index}>{item || "\u00A0"}</p>;
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
        </>
      )}
    </>
  );
};