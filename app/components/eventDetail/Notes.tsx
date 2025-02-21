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
import { createNoteFB, onNoteAdded } from "@/utils/notesAction";
import { Trash } from "geist-icons";
import UserProfile from "../userProfile/UserProfile";
import { useNotesServices } from "@/services/notesServices";
import NullState from "../trackers/nullState";
import NotesNullState from '@/public/notesNullState.svg'
import { GAEvent } from "@/utils/GAEvent";
import { UserResponse } from "@/types/user";
interface UserDetail {
  firstname: string;
  email: string;
  name: string;
  lastname: string;
}
interface Props {
  eventId?: string;
  enquiryId?: string;
  productId?: string | undefined;
  comments?: IComment[];
  stage?: string;
}
interface Reply {
  content?: string;
  user: {
    firstname?: string;
    lastname?: string;
  }
  id?: string;
}
export const Notes = ({ eventId, enquiryId, comments, productId, stage }: Props) => {
  const { theme } = useTheme();
  const urlPath = usePathname().split('/')[2]
  const pageSource = urlPath.charAt(0).toUpperCase() + urlPath.slice(1);
  const {getNotesFromTracker, saveNotes, deleteNotes, likeNotes, getUsers, error, getCoordinateNotes}=useNotesServices();
  const path=usePathname().split('/');
  const { user, signOut } = useAuthContext();
  console.log(user);
  
  // const searchParams = useSearchParams();
  const [suggest, setSuggest] = useState();
  const [zeroState,setZeroState]=useState(false);
  // console.log(searchParams);

  const [isDraggingOver, setIsDraggingOver] = useState(true);
  const [drop, setDrop] = useState(false);
  const [type, setType] = useState("TEXT");
  // const [stage,setStage]=useState("");
  const [userDetail, setUserDetail] = useState<UserResponse | null>(
    user ? user : null
  );
  const [interestType, setInterestType] = useState("");
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
  const containerRef: any = useRef(null);
  const commentRef = useRef(null);
  // const replyRef=useRef(null);
  const [note, setNote] = useState<string>("");
  const [isReply, setIsReply] = useState(false);
  const [height, setHeight] = useState<number | null>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const isInitialMount = useRef(true);
  const [scrollPosition, setScrollPosition] = useState<number>();
  const scrollToBottom = () => {
    if (containerRef.current) {
      (containerRef.current as HTMLElement).scrollTop = (
        containerRef.current as HTMLElement
      ).scrollHeight;
    }
  };
  async function fetchData() {
    if(path[path.length-1]==="notesDiscussion"){
      // const url =
      // `${baseUrl}/comment?stage=INTERNAL&entityType=TRACKER&entityId=${path[path.length-2]}&offset=${page}&limit=10`;
      // const { data, error } = await myFetch(url);
      // if (data) {
      //   // setNotes([]);
      //   console.log(data);
      //   // setNotes(data.comments.reverse());
      //   if (data.comments?.length > 0){
      //     setNotes(prevNotes => [...data.comments.reverse(), ...prevNotes]);
      //   }
      // }
      try{
        const data = await getNotesFromTracker(path[path.length-2], `offset=${page}&limit=10`);
        if (data && data.comments) {
            // setNotes([]);
            console.log(data);
            // setNotes(data.comments.reverse());
            if (data.comments && data.comments?.length > 0){
              setZeroState(false);
              setNotes(prevNotes => [...data.comments.reverse(), ...prevNotes]);
            }
            if(data.comments.length===0&& page===0){
              setZeroState(true);
            }
          }
      }catch(error){
        console.log(error);
        
      }
    }else{
      try{
        const data = await getCoordinateNotes(enquiryId, `offset=${page}&limit=10`, path[2]);
        if (data && data.comments) {
          if (data.comments && data.comments?.length > 0){
            setZeroState(false);
            setNotes(prevNotes => [...data.comments.reverse(), ...prevNotes]);
          }
          if(data.comments.length===0&& page===0){
            setZeroState(true);
          }
        }
      }catch(error){
        console.log(error);
      }
  }
  }
  
  const generateFbPath = (): string => {
    if(urlPath === "trackers")
      return `eventgeni/${user?.companyId}/notes/${urlPath}/${path[path.length-2]}`;
    else if(urlPath === "coordinate" || urlPath === "outreach")
      return `eventgeni/${user?.companyId}/notes/${urlPath}/${eventId}`;
    else
      return `eventgeni/${user?.companyId}/notes/general`;
    // return "xyz";
  }

  // const isInitialMount = useRef(true);
  // const commentRef=useRef();
  const [scrolling, setScrolling] = useState(false);
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleInfiniteScroll);
      onNoteAdded(generateFbPath(), handleRealtimeAction);

      return () => {
        container.removeEventListener('scroll', handleInfiniteScroll);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInfiniteScroll = async () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const isAtTop = container.scrollTop === 0;
      const scrollBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
      console.log('Client Height:', container.clientHeight);
      console.log('Scroll Height:', container.scrollHeight);
      console.log('Scroll Top:', container.scrollTop);

      // Your infinite scroll logic here
      if (isAtTop) {
        setPage(prev => prev+10);
        setScrolling(true);
        setScrollPosition(scrollBottom);
        // Trigger data fetch or any action you want to perform on scroll end
      }
    }
  };
  useEffect(() => {
    if (note !== null)
      if (isInitialMount.current) {
        console.log(1111);

        // Skip the effect on the initial mount
        isInitialMount.current = false;
      }
      else {
        if (commentRef.current) {
          const height = (commentRef.current as HTMLElement).clientHeight;
          setHeight(height);
          console.log(111111111);

          // scrollToBottom();
          if(scrollPosition)
            containerRef.current.scrollTop = containerRef.current.scrollHeight - containerRef.current.clientHeight - scrollPosition;
        }
        // scrollToBottom();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes?.length]);

  console.log(comments);
  const addNote = async (event: any) => {
    event.preventDefault();
    console.log(note);


    // const { user } = useAuthContext();
    const len = CommentsData?.length;
    const id = Date.now().toString();
    // setNote(note.replace(/\n/g, "<br>"))
    console.log(11111111 + filePreviews);
    if (filePreviews) console.log("file file");

    if (
      note.trim().length !== 0  ||
      filePreviews.length !== 0 ||
      selectedPdfs.length !== 0
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
      if(path[path.length-1]==="notesDiscussion"){
        const dataToSend = {
          "commentType": "TEXT",
          "content": note,
          // "source": "GTM",
          "sourceModule": "TRACKER",
          "sourceId":path[path.length-2],
          ...(replyId !== null && {
            "parentCommentId": replyId
          })
        };
        postNote(dataToSend);
      }else
      {
        const dataToSend = {
          "commentType": type,
          "content": note,
          "sourceModule": stage,
          "sourceId": enquiryId,
          ...(replyId !== null && {
            "parentCommentId": replyId
          }),
          ...(type !== 'TEXT' && { "interest": interestType }),
          ...(type === "RECOMMEND" && {
            "interestedUserId": suggest
          }),
        };
        postNote(dataToSend);
      }
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
  const postNote = async (dataToSend: {}) => {
    const formData = new FormData();
    for (let i = 0; i < filePreviews.length; i++) {
      formData.append('files', filePreviews[i]);
    }
    // console.log(selectedPdfs[0]);
    // formData.append('files',files);
    for (let i = 0; i < selectedPdfs.length; i++) {
      formData.append('files', selectedPdfs[i]);
    }
    let url = "";
    if (replyId === null) {
      url = `${baseUrl}/comment`;
    } else {
      url = `${baseUrl}/comment/reply`
    }
    // formData.append("eventId","7cd52884-1409-43a4-9dde-01a06bb8faf9")
    // formData.append("eventGroupId", "53cd1194-2e00-43a0-b9dd-20642710815e")
    // formData.append("stage","INTERNAL")
    // formData.append("content", note)
    // formData.append("type",type);
    // formData.append("files",{...filePreviews});
    // formData.append("source","GTM");
    Object.keys(dataToSend).forEach(key => {
      formData.append(key, dataToSend[key as keyof typeof dataToSend])
    });
    try{
        const data = await saveNotes(formData, replyId);
        if (data) {
          if (replyId) {
            GAEvent("Notes", "Notes", `${pageSource} | Enquiry Detail`, `${pageSource} | Enquiry Detail | Reply`);
          } else
            GAEvent("Notes", "Notes", `${pageSource} | Enquiry Detail`, `${pageSource} | Enquiry Detail | Message Send`);
            // const newData = transformData(data);
            
            setNotes(prevNotes => [...prevNotes, data]);
            createRealtimeAction('add', data.data.id);
            setScrolling(false);
            setZeroState(false);
          }
    }catch(error){
        console.log(error);
        
    }
    setType("TEXT")
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
    if (scrolling === false) {
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes?.length]);

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

      setSelectedPdfs((prevSelectedFiles: File[] | null) => {
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
    const reply: Reply = notes?.find((comment) => comment.id == replyId);
    // console.log("reply is: " + reply?.text);
    setReplyName((reply?.user.firstname|| "User") + " " + (reply?.user.lastname || ""));
    setReplyText(reply?.content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replyId]);
  const handleLike = (id: string, isLiked: boolean) => {
    // Find the comment by id and update its isLiked property
    likedFun(id, isLiked)
    const updatedComments = notes.map((c: any) => {
      if (c.id === id) {
        return {
          ...c,
          totalLikes: (c.totalLikes || 0) + (!isLiked ? 1 : -1),
          userUpvoted: !isLiked,
        };
        
      }
      return c;
    });

    // Update the state with the new comments array
    setNotes(updatedComments);
  };
  const likedFun = async (id: string, isLiked: boolean) => {
    // const url = `${baseUrl}/comment/${id}/interest`;
    // const { data, error } = await myFetch(url, {
    //   method: "POST"
    // })
    // if(data) {
    //   createRealtimeAction(isLiked? 'unlike' : 'like', id);
    // }
    try{
      const data = await likeNotes(id, isLiked);
      if(data){
        createRealtimeAction(isLiked? 'unlike' : 'like', id);
      }
    }catch(error){
        console.log(error);
        
    }
  }
  // 22b0588a-7207-4e25-a0e7-1134c05fdf52
  // up
  const handleDelete = (id: string) => {
    console.log(id);

    const updatedNotes = notes.filter((comment: any) => comment.id !== id);
    if(updatedNotes.length===0) setZeroState(true);
    deleteComment(id);
    setNotes(updatedNotes);
  };

  const deleteComment = async (id: string) => {
    // const url = `${baseUrl}/comment/${id}`;
    // const { data, error } = await myFetch(url, {
    //   method: "DELETE"
    // })
    // if(data) {
    //   createRealtimeAction('delete', id);
    // }
    try{
        const data = await deleteNotes(id);
        if(data) {
            createRealtimeAction('delete', id);
            GAEvent("Notes", "Notes", `${pageSource} | Enquiry Detail`, `${pageSource} | Enquiry Detail | Delete`);
          }
          
    }catch(error){
        console.log(error);
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  useEffect(() => {
    // const url = `${baseUrl}/auth/users?limit=100`
    console.log(`${baseUrl}/auth/users?limit=100`);
    GAEvent("Notes", "Notes", `${pageSource} | Enquiry Detail`, `${pageSource} | Enquiry Detail | View`);
    
    getAllUser();
  }, [])

  const createRealtimeAction = (action: string, commentId: string) => {
    const fbData = {
      id: commentId,
      action: action,
      userId: user?.id,
    }
    createNoteFB(generateFbPath(), fbData);
  }

  const currentTimeStamp: number = Date.now();

  const handleRealtimeAction = async (fbData: any) => {
    if(fbData.timestamp >= currentTimeStamp && fbData.userId != user?.id){
      if(fbData.action === 'add'){
        const url = `${baseUrl}/comment/${fbData.id}`;
        const { data, error } = await myFetch(url);
        if(data) {
          setNotes(prevNotes => [...prevNotes, ...data.comments]);
        }
      }
      else if(fbData.action === 'delete'){
        setNotes(prevNotes => prevNotes.filter((comment: any) => comment.id !== fbData.id));
      }
      else if(fbData.action === 'like' || fbData.action === 'unlike'){
        setNotes(prevNotes =>
          prevNotes.map((c: any) => {
            if (c.id === fbData.id) {
              let isLiked = (fbData.action === 'like');
              return {
                ...c,
                _count: {
                  ...c._count,
                  Commentlikes: (c._count?.Commentlikes || 0) + (isLiked ? 1 : -1),
                }
              };
            }
            return c;
          })
        );
      }
    }
  }

  const [userArr, setUserArr] = useState<string[]>([]);
  const  [users,setUsers]=useState<{}>();
  const getAllUser = async () => {
    // const { data, error } = await myFetch(url);

    // if (data && data?.users?.length>0) {
    //   console.log(data);

    //   // Collect new items to add to the array
    //   const newItems = data?.users?.map((item: UserDetail) => "@" + item.firstname + item.lastname);
    //   setUsers(data?.users);

    //   // Use functional form to update state
    //   setUserArr(prevArr => [...prevArr, ...newItems]);
    // }
    try{
      const result= await getUsers('limit=100')
      console.log(result);
      if(result){
      setUsers(result);
      const newItems = (result?.users || []).map((item: UserResponse) => "@" + item?.firstname);
      setUserArr(prevArr => [...prevArr, ...newItems]);

      }else{
        console.log(error);
        
      }
    }catch(error){
      console.log(error);
      
    }
    
  };
  console.log(notes);
  return (
    <div className="flex flex-col items-start w-full h-full border rounded-[12px]" style={{border:"1px solid var(--border-color)"}}>
      <div className="text-[var(--primary-color)] font-bold px-5 py-2">Notes & Discusssion</div>
      {notes ? (
        <div
          className="h-[85%] w-full overflow-y-scroll relative"
          ref={containerRef}
          // style={{ position: "relative" }}
        >
          {zeroState && 
          <div className="w-[100%] h-[100%] flex items-center justify-center">
          <div className="w-[500px]">
          <NullState image={NotesNullState} title="Start jotting down your thoughts or key takeaways here!" text="Whether it's planning, capturing important points, or kicking off a team discussion, this space is yours to keep everyone aligned and engaged"/>
          </div>
          </div>
          }
          <div
           className="min-h-full absolute w-full top-0 left-0 flex justify-center items-center overflow-y-scroll bg-[var(--primary-foreground)]"
           style={{
             height: `${height}px`,
             zIndex: drop ? 1 : 0,
             opacity: drop ? 0.5 : 0,
           }}
            onDragEnter={onDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={onDragLeave}
            onDrop={handleDrop}
          ></div>
          <ul className="flex flex-col items-start justify-center gap-6 w-full list-none" ref={commentRef}>
            {notes.map((comment: IComment) => (
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
          // className={theme === "light" ? styles.replyDivLight : styles.replyDiv}
          className="p-[10px] text-left flex cursor-pointer gap-2 w-full justify-between flex-col bg-[var(--background-secondary-color)]"
        >
          <div className="py-5 px-2.5 bg-black bg-opacity-20 w-full rounded-2xl flex justify-between">
            <div className="overflow-hidden relative m-0">
              <div className="absolute bg-[var(--primary-color)] w-1 h-full"></div>
              <div className="pl-4 pb-2 text-[var(--primary-color)]">{replyName}</div>
              <div className={styles.replyText1}>{replyText}</div>
            </div>

            <div onClick={() => setReplyId(null)} className={styles.closeBtn}>
              X
            </div>
          </div>
        </div>
      )}
      <div
        className="p-2 w-full bg-[var(--heading-background-color)] rounded-bl-[12px] rounded-br-[12px]"
        style={{borderTop:"1px solid var(--border-color)"}}
      >
        <AddComment
        allUsers={users}
          setSuggest={setSuggest}
          replyId={replyId}
          setType={setType}
          setInterestType={setInterestType}
          productId={productId}
          structuredUsers={userArr}
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
  setIsReply: any;
  getCommentPos?: any;
  handleDelete?: any;
  replyText?: undefined | string;
  handleLike?: any;
  setReplyId?: any;
  userArr: string[];
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
  const [userDetail, setUserDetail] = useState<UserResponse | null>(
    user ? user : null
  );

  useEffect(() => {
    setUserDetail(user);
  }, [user]);
  const d = `@${userDetail?.firstname}${userDetail?.lastname?.toLowerCase()}`;
  const handleReply = (id: string) => {
    setReplyId(id);
    scroll();
    setIsReply(true);
  };
  const [isLiked, setIsLiked] = useState(false);
  // useEffect(() => { }, [isLiked]);
  const handleLiked = (id: string, isLiked: boolean,) => {
    handleLike(id, isLiked)
  };
  // useEffect(()=>{
  //   setIsLiked(!isLiked)
  // },[isLiked])

  // useEffect(()=>{
  //   setIsLiked(!isLiked);
  // },[isLiked])
  // const handleLike=(id)=>{
  //   console.log(1);

  //   const newComment={...comment,isLiked:true};
  //   comment=newComment;
  // }

  console.log(arr);
  setTimeout(() => {
    console.log(comment?.CommentFiles);
  }, 5000)


  const { theme } = useTheme();
  return (
    <>
      {
        comment.commentType === "TEXT" ? (
        <>
          <div className={styles.comment__user}>
            <header className="flex flex-row justify-start gap-2 h-fit">
              <span className={styles.imgContainer}>
                {/* <Image
                  width={50}
                  height={50}
                  className={styles.userImage}
                  src={person1}
                  alt=""
                /> */}
                <UserProfile name={(comment?.user?.firstname || "user") + " " + (comment?.user?.lastname || "")} height={50} width={50} />
              </span>
              <div
                // className={`${styles.comment_name} ${theme === "light" && styles.comment_name_light
                //   }`}
                className="flex flex-col"
              >
                <span className="font-medium">
                  {comment?.user?.firstname || "User"} {comment?.user?.lastname || ""}
                  <span className="text-[var(--tertiary-text-color)]">
                    {" "}
                    @
                    {`${comment?.user?.firstname ? comment.user.firstname : "User"}${
                comment?.user?.lastname
                  ? comment.user.lastname.charAt(0).toLowerCase() + comment.user.lastname.slice(1)
                       : ""
                  }`}

                  </span>
                </span>

                <p className="text-[var(--tertiary-text-color)] text-sm">
                {comment?.user?.UserDetail?.designation}
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
            className="flex flex-col gap-1 ml-[58px]"
            style={{
              background: comment?.parentComment
                ? "var(--background-secondary-color)"
                  
                : "none",
            }}
          >
            <div className="block">
              <span>{userName}</span>{" "}
              {comment?.parentComment && (
                <div
                  // className={
                  //   theme === "light" ? styles.replyDivLight : styles.replyDiv
                  // }
                  className="p-[10px] text-left flex gap-2 w-full justify-between flex-col cursor-pointer"
                  onClick={(e) => getCommentPos(e, comment?.parentComment?.id)}
                >
                  <div className="py-5 px-2.5 bg-black bg-opacity-20 w-full rounded-2xl flex justify-between">
                    <div className="overflow-hidden relative m-0">
                      <div className="absolute bg-[var(--primary-color)] w-1 h-full"></div>
                      {comment.parentComment !== null ?
                        <div className="pl-4 pb-2 text-[var(--primary-color)]">{comment.parentComment && (comment?.parentComment?.user?.firstname || "User")}{" "}{comment.parentComment && (comment?.parentComment?.user?.lastname||"")}</div>
                        :
                        <div className="pl-4 pb-2 text-[var(--primary-color)]">{comment?.replyName}</div>
                      }

                      <div className={styles.replyText1} id={comment.parentComment?.id}>
                        {comment?.parentComment?.content}
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
                          {comment?.parentComment ? (
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
                                style={{ margin: 0, padding: "0px 20px", paddingBottom:"10px" }}
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
            {/* {comment.CommentFiles && comment?.CommentFiles?.map((item: any, index) => (
              <div key={index}>{item.Attachment.fileName}</div>
            ))} */}
            {comment.CommentFiles && comment?.CommentFiles.length>0 &&
            <div
              className={styles.images}
              style={{ padding: comment?.parent ? "10px 20px" : "none" }}
            >

              {comment.CommentFiles && comment?.CommentFiles?.map((item: any, index) => (

                (item.Attachment && item?.Attachment?.fileType === "IMAGE" ? (
                  <div key={index} className="w-[200px] h-[150px]">
                    <Image
                      style={{ borderRadius: "5px", width:"200px", height:"150px" }}
                      src={item?.Attachment?.filePath}
                      alt={item.name}
                      width={200}
                      height={150}
                    />
                  </div>) : (
                  <div
                    key={index}
                    className={`${styles.pdf} ${theme === "light" && styles.pdf_light
                      }`}
                  >
                    <Image src={Pdf} width={50} height={50} alt="pdf" style={{width:"50px", height:"50px", maxWidth:"unset"}}/>
                    <p key={index} style={{ display: "flex" }}>
                      {item.Attachment && item?.Attachment[0]?.fileName}
                    </p>
                  </div>)
                )
              ))}

            </div>
            }
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
          <div className="relative mx-[3.6rem] mt-1 gap-[var(--spacing-sm)] flex flex-row items-center text-[var(--tertiary-text-color)] text-sm font-mediu">
            {/* <ButtonView view={"upvoteBtn"} /> */}
            <div
              className={`${styles.likeSection} flex cursor-pointer gap-1 py-1 px-2 border-[0px] rounded-[20px] ml-[-10px]`}
              onClick={() => handleLiked(comment.id, comment?.userUpvoted)}
            >
              <div className={styles.like}>
                {comment?.userUpvoted ? (
                  <Image src={LikeFill} alt="like" />
                ) : (
                  <Image src={Like} alt="like" />
                )}
              </div>
              <div>{comment && comment?.totalLikes}</div>
            </div>
            <button
              onClick={() => handleReply(comment.id)}
              className="cursor-pointer font-medium"
            >
              Reply
            </button>
            {/* <ButtonView view={"replyBtn"} /> */}
            {comment?.createdAt ? (
              <p className="font-medium">
                {new Date(comment.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </p>
            ) : (
              <p>Mar 20,2024</p>
            )}
            {/* {userDetail?.firstname === comment.user.firstname && userDetail?.lastname === comment.user.lastname && */}
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(comment.id)}
              >
                {/* Delete */}
                <Trash style={{marginBottom: '4px'}} color="var(--tertiary-text-color)" height="15px" />
              </button>
            {/* } */}

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
              {/* <Image width={30} height={30} src={person1} alt="" /> */}
              <UserProfile name={comment.user?.firstname + " " + comment.user?.lastname} height={30} width={30} />
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

                              {/* <p className={styles.designationText}>
                                Founder and leadership at Nityo Infotech
                              </p> */}
                            </div>
                          </header>;
                          if (userArr?.includes("@" + username) || d === "@" + username) {
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
                              <React.Fragment key={idx}>{word}1 </React.Fragment>
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