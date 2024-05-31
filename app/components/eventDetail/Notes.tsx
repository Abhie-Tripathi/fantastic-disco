import React, { useState, useEffect, useRef } from "react";
import styles from "./notes.module.css";
import { useSearchParams } from "next/navigation";
import { AddComment } from "./AddComment";
import { Comment as IComment } from "../../../types/comment";
import Image from "next/image";
import close from "@/public/close.svg";
import Like from "@/public/thumbsUp.svg";
import { usePathname } from "next/navigation";
import LikeFill from "@/public/thumbsUpFill.svg";
import person1 from "@/public/person2.svg";
import Pdf from "/public/pdf.svg";
import CommentsData from "@/public/data/commentsData.json";
import ButtonView from "../ButtonView";
import { useTheme } from "@/context";
import { useAuthContext } from "@/context";
import { number, undefined } from "zod";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
import { transcode } from "buffer";

interface UserDetail {
  firstname: string;
  email: string;
  lastname: string;
}
interface Props {
  eventId?: string;
  eventGroupId?: string;
  productId?: string | undefined;
  comments?: IComment[];
  stage?:string;
}
interface Reply{
  content?:string;
  user:{
    firstname?:string;
    lastname?:string;
  }
  id?:string;
}
export const Notes = ({eventId, eventGroupId, comments, productId, stage }: Props) => {
  const { theme } = useTheme();
  const urlPath=usePathname().split('/')[2]
  const { user, signOut } = useAuthContext();
  // const searchParams = useSearchParams();
  const [suggest,setSuggest]=useState();
  
  // console.log(searchParams);
  
  const [isDraggingOver, setIsDraggingOver] = useState(true);
  const [drop, setDrop] = useState(false);
  const [type,setType]=useState("MESSAGE");
  // const [stage,setStage]=useState("");
  const [userDetail, setUserDetail] = useState<UserDetail | null>(
    user ? user : null
  );
  const [interestType,setInterestType]=useState("");
  const [data, setData] = useState([]);
  const [username, setUserName] = useState([]);
  const wrapperRef = useRef(null);
  // const [filePreview, setFilePreview] = useState<string | null>(null);
  const [filePreviews, setFilePreviews] = useState<any>([]);
  const [selectedPdfs, setSelectedPdfs] = useState<any>([]);
  const [replyId, setReplyId] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);



  
  useEffect(() => {
    setUserDetail(user);
  }, [user]);
  productId = "017bb854-12d5-4350-aa29-feb4790d06cc";
  const containerRef :any  = useRef(null);
  const commentRef = useRef(null);
  // const replyRef=useRef(null);
  const [note, setNote] = useState<string>("");
  const [isReply,setIsReply]=useState(false);
  const [height, setHeight] = useState<number | null>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const isInitialMount = useRef(true);
  const scrollToBottom = () => {
    if (containerRef.current) {
      (containerRef.current as HTMLElement).scrollTop = (
        containerRef.current as HTMLElement
      ).scrollHeight;
    }
  };
async function fetchData() {
 
    const url =
      `${baseUrl}/comment?eventId=${eventId}&eventGroupId=${eventGroupId}&stage=${stage}&offset=${page}&limit=10`;
      
    const { data, error } = await myFetch(url);
    console.log(data);
    if (data && urlPath==="coordinate" ) {
      // setNotes([]);
      console.log(data);
      // setNotes(data.comments.reverse());
      if(data.comments?.length>0)
        setNotes(prevNotes => [...data.comments.reverse(),...prevNotes]);
    }
    if (data && urlPath==="outreach") {
      // setNotes([]);
      
      console.log(data);
      // setNotes(data.comments.reverse());
      if(data.comments?.length>0)
        setNotes(prevNotes => [...data.comments.reverse(),...prevNotes]);
    }
    else setNotes(CommentsData );
  }
  // const isInitialMount = useRef(true);
  // const commentRef=useRef();
  const [scrolling,setScrolling]=useState(false);
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleInfiniteScroll);

      return () => {
        container.removeEventListener('scroll', handleInfiniteScroll);
      };
    }
  }, []);

  const handleInfiniteScroll = async () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const isAtTop = container.scrollTop === 0;
      console.log('Client Height:', container.clientHeight);
      console.log('Scroll Height:', container.scrollHeight);
      console.log('Scroll Top:', container.scrollTop);

      // Your infinite scroll logic here
      if (isAtTop) {
        setPage(page+10);
        setScrolling(true);
        // Trigger data fetch or any action you want to perform on scroll end
      }
    }
  };
  useEffect(() => {
    if(note!==null)
      if (isInitialMount.current) {
        console.log(1111);
        
        // Skip the effect on the initial mount
        isInitialMount.current = false;
      }
      else{
    if (commentRef.current) {
      const height = (commentRef.current as HTMLElement).clientHeight;
      setHeight(height);
      console.log(111111111);
      
      // scrollToBottom();
    }
    // scrollToBottom();
  }
  }, [notes?.length]);

  console.log(comments);
  const addNote = async (event: any) => {
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
      event.preventDefault();
      console.log("number of hits");
      // const updatedNotes = [
      //   ...notes,
      //   {
      //     id: Date.now().toString(),
      //     images: filePreviews,
      //     pdfs: selectedPdfs,
      //     content: note,
      //     parentCommentId: replyId,
      //     userLiked:false,
      //     upvote: 0,
      //     _count:{
      //       Commentlikes:0,
      //     },
      //     parent:{
      //       content:replyText,
      //       user:{
      //         firstname:replyName?.split(" ")[0],
      //         lastname:replyName?.split(" ")[1],
      //       }
      //     },
      //     type:type,
      //     user: {
      //       id: user?.id,
      //       firstname: user?.firstname,
      //       lastname: user?.lastname,
      //       email: user?.email,
      //       createdAt: new Date(),
      //     },
      //   },
      // ];
      // setNotes(notes);
      console.log(selectedPdfs);
      
      console.log(replyName);
      
      const dataToSend = {
        "eventId": eventId,
        "eventGroupId": eventGroupId,
        "stage": stage,
        "type": type,
        "content": note,
        "source": "GTM",
        ...(type !== 'MESSAGE' && { "interestType": interestType }),
        ...(type==="RECOMMEND"&&{
            "recommendUserId":suggest
        }),
        ...(replyId!==null && {
          "parentCommentId":replyId
        } )
      };
      postNote(dataToSend);
      // console.log(dataToSend.files);
     
      // setNotes(updatedNotes);
      console.log(note);
      // scrollToBottom();
    }
    setNote("");
    setFiles(null);
    setReplyId(null);
    // setDrop(true);
    setFilePreviews([]);
    setSelectedPdfs([]);
  };
  const postNote=async(dataToSend:{})=>{
    const formData = new FormData();
    for (let i = 0; i < filePreviews.length; i++) {
      formData.append('files', filePreviews[i]);
    }
    // console.log(selectedPdfs[0]);
    // formData.append('files',files);
    for (let i = 0; i < selectedPdfs.length; i++) {
      formData.append('files', selectedPdfs[i]);
    }
    let url="";
    if(replyId===null){
    url = `${baseUrl}/comment`;
    }else{
      url=`${baseUrl}/comment/reply`
    }
    // formData.append("eventId","7cd52884-1409-43a4-9dde-01a06bb8faf9")
    // formData.append("eventGroupId", "53cd1194-2e00-43a0-b9dd-20642710815e")
    // formData.append("stage","INTERNAL")
    // formData.append("content", note)
    // formData.append("type",type);
    // formData.append("files",{...filePreviews});
    // formData.append("source","GTM");
    Object.keys(dataToSend).forEach(key => {
      formData.append(key , dataToSend[key as  keyof typeof dataToSend])
    });
    const { data, error } = await myFetch(url, {
      method: "POST",
      body: formData,
      // headers: {
      //   "Content-Type": "multipart/form-data"
      // }
    });
    if(data){
      const newData=transformData(data.data);
      
      setNotes(prevNotes=>[...prevNotes, newData]);
    }
      if (!error){
        console.log(data);
        setScrolling(false);
      }
      else console.log(error);
      setType("MESSAGE")
  }
  const transformData = (data: any) => {
    
      const transformedCommentFiles = data.CommentFiles.map((file: any) => ({
        ...file,
        Attachment: [file.Attachment],
      }))
      return {
        ...data,
        CommentFiles: transformedCommentFiles,
      };
  };
  useEffect(() => {
    if(scrolling===false){
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
  }, [notes]);

  console.log(filePreviews);
  const [files, setFiles] = useState<any | null>(null);
  const handleDragOver = (event: React.DragEvent) => {
    console.log("HandleDragver", event);
    event.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setFiles(event?.dataTransfer.files[0]);
    // console.log(event?.dataTransfer.files[0]);
    
    setDrop(false);
    // if (!files) return; // Exit early if files is null or undefined
    // // setDrop(true);
    // console.log(files);

    // if (files && files.type === "application/pdf") {
    //   setSelectedPdfs([...selectedPdfs, files.name]);
    // }else if(files.type.startsWith('image/')){
    //   setFilePreviews((prevSelectedFiles: File[] | null) => {
    //   if (
    //     prevSelectedFiles === null ||
    //     typeof prevSelectedFiles === "undefined"
    //   ) {
    //     return [files];
    //   } else {
    //     return [...prevSelectedFiles,files];
    //   }
    // });
    // }
    // else {
    //   // Handle case when file is not a PDF
    //   console.log("Please select a PDF file.");
    // }
  };
  useEffect(() => {
    if (!files) return; // Exit early if files is null or undefined
    // setDrop(true);
    console.log(files);

    if (files && files.type === "application/pdf") {
      // console.log(files);
      
      // setSelectedPdfs([...selectedPdfs, files]);
      // const file = [files]
      // console.log(file);
      
      setSelectedPdfs((prevSelectedFiles:File[] | null) => {
        if (!prevSelectedFiles || prevSelectedFiles.length === 0) {
          // console.log(file);
          
          return [files];
        } else {
          return [...prevSelectedFiles, files];
        }
      });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  // useEffect(() => {
  //   if (files) {
  //     setDrop(true);
  //   }
  // }, [files]);

  // console.log("drop is "+ drop);
  useEffect(() => {
    setTimeout(() => {
      console.log(height);
    }, 1000);
  });

  // comments = [...notes];
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
  };
  const onDragLeave = () => {
    setDrop(false);
  };
  setTimeout(() => {
    console.log(replyId);
  }, 1000);
  const [replyText, setReplyText] = useState<string | undefined>("");
  const [replyName, setReplyName] = useState<string | undefined>("");
  useEffect(() => {
    const reply:Reply = notes?.find((comment) => comment.id == replyId);
    // console.log("reply is: " + reply?.text);
    setReplyName(reply?.user.firstname + " " + reply?.user.lastname);
    setReplyText(reply?.content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replyId]);
  const handleLike = (id: string, isLiked: boolean) => {
    // Find the comment by id and update its isLiked property
    likedFun(id,isLiked)
    const updatedComments = notes.map((c: any) => {
      if (c.id === id) {
        return { ...c, _count: {
          ...c._count,
          Commentlikes: c._count?.Commentlikes + (!isLiked ? 1 : -1),
        }, userLiked: !isLiked };
      }
      return c;
    });

    // Update the state with the new comments array
    setNotes(updatedComments);
  };
  const likedFun=async(id:string, isLiked:boolean)=>{
    const url=`${baseUrl}/comment/${id}/interest`;
    const { data, error } = await myFetch(url, {
      method:"POST"
    })
  }
  // 22b0588a-7207-4e25-a0e7-1134c05fdf52
  // up
  const handleDelete = (id: number) => {
    console.log(id);
    
    const updatedNotes = notes.filter((comment: any) => comment.id !== id);
    deleteComment(id);
    setNotes(updatedNotes);
  };
  const deleteComment=async(id:number)=>{
    const url = `${baseUrl}/comment/${id}`;
    const {data,error}=await myFetch(url,{
      method:"DELETE"
    })
  }
  const [class1, setClass1] = useState(false);
  const [chedkedId, setCheckedId] = useState<number | null>(null);
  const getCommentPos = (
    event: React.MouseEvent<HTMLDivElement>,
    id: number
  ) => {
    setCheckedId(id);
    const element = document.getElementById(String(id));
    // console.log(element+"11111111111111111111111111111111111111111");

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      // setClass1(true)
      setCheckedId(id);
      setTimeout(() => {
        setCheckedId(null);
        //  element.classList.add("your")
      }, 1000);
    }

    // if(element!==null)
    // window.scrollBy(0, -100);
  };
  //   async function fetchData() {
  //     try {
  //       // const response = await fetch('https://api.eventgeni.com/tracker',{
  //       //   credentials: "include",
  //       //   mode: "cors",

  //       //   headers: {
  //       //     "Content-Type": "application/json",
  //       //   }},);
  //       // console.log(response);
  //       const url="https://api.eventgeni.com/tracker"
  //       const {data,error}=await myFetch(url);

  //       if (!response.ok) {
  //         throw new Error('Failed to fetch data');
  //       }
  //       const data = await response.json();
  //       console.log('Data:', data);
  //       return data;
  //     } catch (error) {
  //       console.error('Error:', error);
  //       throw error;
  //     }
  //   }
  // fetchData();
  
  

  useEffect(() => {
    fetchData();
  }, [page]);
  // setTimeout(() => {
  //   console.log("data is: " + notes);
  // }, 5000);
  useEffect(() => {
    if (data.length !== 0) {
      setNotes(data);
    }
  }, [data]);
  // fetchData();
 
  // comments = [...notes];
  setTimeout(() => {
    console.log(selectedPdfs);
  }, 5000);
  useEffect(()=>{
    const url=`${baseUrl}/auth/users`
   getAllUser(url);
  },[])
  const [userArr, setUserArr] = useState<string[]>([]);

  const getAllUser = async (url: string) => {
    const { data, error } = await myFetch(url);
    
    if (data) {
      console.log(data);

      // Collect new items to add to the array
      const newItems = data.map((item: UserDetail) => "@" + item.firstname + item.lastname);
  

      // Use functional form to update state
      setUserArr(prevArr => [...prevArr, ...newItems]);
    }
  };
console.log(notes);
  return (
    <div className={styles.container}>
      {notes ? (
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
            {notes.map((comment:IComment) => (
              <li
                className={
                  String(chedkedId) === comment.id
                    ? `${styles.thread} ${styles.your}`
                    : `${styles.thread}`
                }
                data-id={comment.id}
                key={comment.id}
                id={comment.id}
              >
                <Comment
                userArr={userArr}
                setIsReply={setIsReply}
                  handleLike={handleLike}
                  getCommentPos={getCommentPos}
                  handleDelete={handleDelete}
                  replyName={replyName}
                  replyText={replyText}
                  setReplyId={setReplyId}
                  productId={productId!}
                  comment={comment}
                  superCommentId={comment?.id}
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
      {replyId && (
        <div
          className={theme === "light" ? styles.replyDivLight : styles.replyDiv}
        >
          <div className={styles.outerReplyDiv}>
            <div className={styles.replyText}>
              <div className={styles.bar}></div>
              <div className={styles.name}>{replyName}</div>
              <div className={styles.replyText1}>{replyText}</div>
            </div>
            
            <div onClick={() => setReplyId(null)} className={styles.closeBtn}>
              X
            </div>
          </div>
        </div>
      )}
      <div
        className={`${styles.notesAdd} ${theme === "light" ? styles.notesAdd_light : ""
          }`}
      >
        <AddComment
        setSuggest={setSuggest}
          replyId={replyId}
          setType={setType}
          setInterestType={setInterestType}
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
  replyName?: undefined | string;
  setIsReply:any;
  getCommentPos?: any;
  handleDelete?: any;
  replyText?: undefined | string;
  handleLike?: any;
  setReplyId?: any;
  userArr:string[];
  comment: IComment;
  productId: string;
  superCommentId: string;
  userName?: string;
  notes: any[];
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
  userArr,
  handleLike,
  replyText,
  productId,
  setReplyId,
  replyName,
  setComments,
  getCommentPos,
  handleDelete,
  setIsReply,
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
  // let a = comment.text.split("\n");
  // // const commentRef = useRef(null);
  // console.log(a);
  // let newArr: string[] = [];
  // a.map((item, ind) => {
  //   if (
  //     item.length === 0 &&
  //     a[ind - 1]?.length === 0 &&
  //     a[ind + 1]?.length === 0
  //   ) {
  //     newArr.push("space");
  //   } else if (item.length !== 0) {
  //     newArr.push(item);
  //   }
  // });
  // console.log(newArr);
  // const [replyId,setReplyId]=useState("");
  const scroll = () => {
    console.log(document.documentElement.scrollHeight);
    
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };
  const { user, signOut } = useAuthContext();
  const [userDetail, setUserDetail] = useState<UserDetail | null>(
    user ? user : null
  );
  
  useEffect(() => {
    setUserDetail(user);
  }, [user]);
  const d=`@${userDetail?.firstname}${userDetail?.lastname.toLowerCase()}`;
  const handleReply = (id: string) => {
    setReplyId(id);
    scroll();
    setIsReply(true);
  };
  const [isLiked, setIsLiked] = useState(false);
  useEffect(() => { }, [isLiked]);
  const handleLiked = (id: string, isLiked: boolean, ) => {
    handleLike(id,isLiked)
  };
  // useEffect(()=>{
  //   setIsLiked(!isLiked)
  // },[isLiked])
  setTimeout(() => {
    console.log(isLiked);
  }, 5000);
  // useEffect(()=>{
  //   setIsLiked(!isLiked);
  // },[isLiked])
  // const handleLike=(id)=>{
  //   console.log(1);

  //   const newComment={...comment,isLiked:true};
  //   comment=newComment;
  // }
  
  console.log(arr);
  setTimeout(()=>{
    console.log(comment?.CommentFiles);
  },5000)


  const { theme } = useTheme();
  return (
    <>
      {comment.content &&
        comment.type === "MESSAGE" ? (
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
          <div
            className={styles.text}
            style={{
              background: comment?.parentCommentId
                ? theme === "light"
                  ? "var(--secondary-bg-light)"
                  : "#1a1a1a"
                : "none",
            }}
          >
            <div className={styles.commentText}>
              <span>{userName}</span>{" "}
              {comment?.parentCommentId && (
                <div
                  className={
                    theme === "light" ? styles.replyDivLight : styles.replyDiv
                  }
                  onClick={(e) => getCommentPos(e, comment.parentCommentId)}
                >
                  <div className={styles.outerReplyDiv}>
                    <div className={styles.replyText}>
                      <div className={styles.bar}></div>
                      {comment.parentCommentId!==null?
                      <div className={styles.name}>{comment.parent && comment?.parent?.user?.firstname}{" "}{comment.parent && comment?.parent?.user?.lastname}</div>
                      :
                      <div className={styles.name}>{comment?.replyName}</div>
                      }
                      
                      <div className={styles.replyText1} id={comment.parent?.id}>
                        {comment?.parent?.content}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {comment &&
                comment.content.split("\n").map((item, index) => {
                  if (item.includes("@")) {
                    const words = item.split(" ");
                    return (
                      <React.Fragment key={index}>
                        <div
                          style={{
                            padding: comment?.parentCommentId
                              ? "0 10px 20px 20px"
                              : "none",
                          }}
                        >
                          {words.map((word, idx) => {
                            if (word.startsWith("@")) {
                              const username = word.substring(1);
                              if (userArr?.includes("@" + username)) {
                                return (
                                  <a
                                    key={idx}
                                    href={`#${username}`}
                                    style={{ fontWeight: "800" }}
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
                                <React.Fragment key={idx}>
                                  {" "}
                                  {word}{" "}
                                </React.Fragment>
                              );
                            }
                          })}
                          <br />
                        </div>
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
                        <>
                          {comment?.parentCommentId ? (
                            <>
                              {/* <div className={styles.replyDiv}>

                     <div className={styles.outerReplyDiv}>
                     <div className={styles.replyText}>
                       <div className={styles.bar}></div>
                     <div className={styles.name}>{comment?.replyName}</div>
                       <div className={styles.replyText1}>{comment?.replyText}</div>
                       </div>
                     </div>
                     
                   </div> */}
                              <p
                                key={index}
                                style={{ margin: 0, padding: "0px 20px" }}
                              >
                                {item}
                              </p>
                            </>
                          ) : (
                            <p key={index} style={{ margin: 0 }}>
                              {item}
                            </p>
                          )}
                        </>
                      );
                    }
                  }
                })}
            </div>
            {/* {comment?.images &&
            <div
            className={styles.images}
            style={{ padding: comment?.replyId ? "0px 20px" : "none" }}
          >
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
            }
            {comment?.pdfs&&
            <div
            style={{
              display: "flex",
              gap: "10px",
              padding: comment?.replyId ? "0 10px 20px 20px" : "none",
            }}
          >
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
            } */}
            {comment.CommentFiles && comment?.CommentFiles?.map((item:any, index) => (
              <div key={index}>{item.Attachment.fileName}</div>
            ))}
            <div
              className={styles.images}
              style={{ padding: comment?.parent ? "10px 20px" : "none" }}
            >
              
              {comment.CommentFiles && comment?.CommentFiles?.map((item:any, index) => (
               
                (item.Attachment && item?.Attachment[0]?.fileType==="IMAGE"?(
                <div key={index}>
                  <Image
                    style={{borderRadius:"5px"}}
                    src={item?.Attachment[0]?.filePath}
                    alt={item.name}
                    width={200}
                    height={150}
                  />
                </div>):(
                <div
                  key={index}
                  className={`${styles.pdf} ${theme === "light" && styles.pdf_light
                    }`}
                >
                  <Image src={Pdf} width={50} height={50} alt="pdf" />
                  <p key={index} style={{ display: "flex" }}>
                    {item.Attachment &&  item?.Attachment[0]?.fileName}
                  </p>
                </div>)
              )
              ))}
              
            </div>
            {/* <div style={{ display: "flex", gap: "10px"}}>

      {comment?.pdfs?.map((item: any, ind: number) => (
<div className={styles.pdf} key={ind} style={{ width: "200px", height:"150px",overflow: 'hidden' }}>
<iframe src={URL.createObjectURL(item)} className={styles.pdf} style={{ border: "none", outline: "none", width: "90%", height: "100%", overflow: "hidden",scrollbarWidth: "thin" }} title="PDF Preview" scrolling="no" />
</div>
))}

      </div> */}
            {/* <div
              style={{
                display: "flex",
                gap: "10px",
                padding: comment?.replyId ? "0 10px 20px 20px" : "none",
              }}
            >
              {comment?.CommentFiles?.map((item: any, ind: number) => (
                <div
                  key={ind}
                  className={`${styles.pdf} ${theme === "light" && styles.pdf_light
                    }`}
                >
                  <Image src={Pdf} width={50} height={50} alt="pdf" />
                  <p key={ind} style={{ display: "flex" }}>
                    {item.FileName}
                  </p>
                </div>
              ))}
            </div> */}
          </div>
          <div className={styles.options}>
            {/* <ButtonView view={"upvoteBtn"} /> */}
            <div
              className={
                theme === "light" ? styles.likeSectionLight : styles.likeSection
              }
              onClick={() => handleLiked(comment.id, comment?.userLiked)}
            >
              <div className={styles.like}>
                {comment?.userLiked ? (
                  <Image src={LikeFill} alt="like" />
                ) : (
                  <Image src={Like} alt="like" />
                )}
              </div>
              <div>{comment._count && comment?._count.Commentlikes}</div>
            </div>
            <button
              onClick={() => handleReply(comment.id)}
              className={styles.replyBtn}
            >
              Reply
            </button>
            {/* <ButtonView view={"replyBtn"} /> */}
            {comment?.created ? (
              <p>
                {new Date(comment.created).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </p>
            ) : (
              <p>Mar 20,2024</p>
            )}
            {userDetail?.firstname===comment.user.firstname&&userDetail?.lastname===comment.user.lastname &&
            <button
            className={styles.replyBtn}
            onClick={() => handleDelete(comment.id)}
          >
            Delete
          </button>
            }
            
            {/* <ButtonView
        view={"editDeleteButton"}
        commentUserId={comment.user.id}
      /> */}
          </div>
          <div className={styles.addMoreCommentSection}>
            {/* <AddComment
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
            /> */}
          </div>

          {/* <ButtonView
      view={"viewMoreReplies"}
      repliesLength={comment.replies?.length}
    ></ButtonView> */}
          <ul className={styles.replies} id="replyContainer">
            {comment.replies?.map((reply) => {
              return (
                <li
                  className={reply.replies?.length! > 0 ? styles.thread : ""}
                  key={reply.id}
                >
                  <Comment
                  userArr={userArr}
                   setIsReply={setIsReply}
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
              {comment.content?.split("\n").map((item, index) => {
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
                          if (userArr?.includes("@" + username)||d==="@"+username) {
                            return (
                              <a
                                key={idx}
                                href={`#${username}`}
                                className={`${styles.span} ${theme === "light" && styles.span_light
                                  }`}
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
                      {comment?.created && (
                        <span style={{ paddingLeft: "5px" }}>
                          on{" "}
                          {new Date(comment?.created).toLocaleDateString(
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
          
        </>
        
      )}
    </>
  );
};
