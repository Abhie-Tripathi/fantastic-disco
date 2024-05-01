"use client";
import React, { useEffect, useState, useRef } from "react";
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
import EmployeeData from "@/public/data/employeeData.json"
import { revalidateComment } from "@/utils/commentAction";
interface Props {
  productId?: string;
  replyOptions?: replyOptions;
  focus?: boolean;
  isEditComment?: boolean;
  isEditReply?: boolean;
  editCommentText?: string;
  className?: string;
  repliesLength?: number;
  notes: any;

  note?: string | any;
  setNote: React.Dispatch<React.SetStateAction<string>>;
  comments?: IComment[];
}
interface User {
  firstname: string;
  lastname: string;

}
interface replyOptions {
  commentId: string;

}
interface UserDetail {
  firstname: string;
  email: string;
  lastname: string;
}
export const AddComment = ({
  productId,
  replyOptions,
  focus,
  isEditComment,
  isEditReply,
  className,
  repliesLength,
  notes,
  note,
  setNote,
  comments,
}: Props) => {
  const commentId = replyOptions?.commentId;
  const { user, signOut } = useAuthContext();
  const [userDetail, setUserDetail] = useState<UserDetail | null>(user ? user : null);
  const [types, showTypes] = useState<boolean>(false);
  const isReply = isEditComment || isEditReply ? false : !!commentId;
  const [showUser, setShowUser] = useState(false);
  const type: string[] = ["Speak", "Attend"];
  const [filteredEmployees, setFilteredEmployees] = useState(EmployeeData);
  const [alluser, setAlluser] = useState<String[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    setUserDetail(user);
  }, [user]);
  // useEffect(() => {
  //   const trimmedNote = noten.trim(); // Trim whitespace from the beginning and end of the input
  //   if (trimmedNote.startsWith("@") || trimmedNote.includes(" @")) { // Check if "@" is at the start or preceded by a space
  //     setEmployeeDropDown(true);
  //     const searchTerm = trimmedNote.substring(trimmedNote.lastIndexOf("@") + 1).trim(); // Extract text after the last "@" symbol
  //     if (searchTerm) {  setAlluser(allUser);
  //       const filtered = EmployeeData.filter((employee) =>
  //         employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  //       );
  //       setFilteredEmployees(filtered);
  //     } else {
  //       setFilteredEmployees(EmployeeData); // Show all employees if no specific name is typed after "@"
  //     }
  //   } else {
  //     setEmployeeDropDown(false);
  //   }
  // }, [noten, EmployeeData]);


  // const handleEmployeeClick = (employee: any) => {
  //   setNote((prevNote) => {
  //     // Find the last index of "@" in the input value
  //     const lastIndex = prevNote.lastIndexOf("@");
  //     // Split the input value into two parts: text before "@" and text after "@"
  //     const beforeAt = prevNote.substring(0, lastIndex);
  //     const afterAt = prevNote.substring(lastIndex + 1);
  //     // Concatenate the text before "@" with the selected employee name and "@" and text after "@"
  //     return `${beforeAt}@${employee.name} ${afterAt}`;
  //   });
  //   setEmployeeDropDown(false);
  // }

  // const renderNote = () => {
  //   const parts = note.split("@");
  //   return parts.map((part, index) => {
  //     console.log("notes :"+part);
  //     if (index === 0) {
  //       return part;
  //     } else {
  //       return (
  //         <span key={index} style={{ color: "blue" }}>
  //           @{part}
  //         </span>
  //       );
  //     }
  //   });
  // };
  // const addNote=()=>{
  //   console.log(notes);
  //   const len=notes?.length;
  //   const id = Date.now().toString();
  //   const newNote={
  //       id: id,
  //     text: note
  // }
  //  notes = [ ...notes, newNote ];
  //   // console.log(updatedNotes)
  //     console.log(notes);

  // }
  // useEffect(() => {

  useEffect(() => {
    if (note?.charAt(note.length - 1) === '@') {
      console.log(comments);
      setShowUser(true);
      let arr = Array.from(new Set(comments?.map(comment => "@" + comment?.user?.firstname + comment?.user?.lastname.toLowerCase())));
      console.log(arr);

      setAlluser(arr);
    } else setShowUser(false);
  }, [note])
  const noteFun = (e: any) => {
    setNote(e.target.value);

  }
  // },[note])
  const handleSelectRecommendation = (name: String) => {
    if (!note.includes(name)) {
      setNote(prevNote => prevNote.replace(/@\w*$/, `${name} `));
      showTypes(false);
    }
    // console.log(1);

  };
  const handleSelectAttend = () => {
    // e.preventDefault();
    setNote(prev => prev + ("@" + userDetail?.firstname + userDetail?.lastname.toLowerCase() + " wants to attend"));
    setShowUser(false);

    // if (formRef.current) {
    //   formRef.current.submit(); 
    // }
  }
  const handleSelectSpeak = () => {
    setNote("@" + userDetail?.firstname + userDetail?.lastname.toLowerCase() + " wants to speak");
    setShowUser(false);
  }
  const handleRecommend = () => {
    let arr = Array.from(new Set(comments?.map(comment => "@" + comment?.user?.firstname + comment?.user?.lastname.toLowerCase())));
    setAlluser(arr);
    setNote("@");
    setShowUser(true);
  }
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      notes(event);// Submit the form if "Enter" is pressed without "Shift"
    } else if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault();
      setNote(prev => prev + '\n');
    }
  }
  useEffect(() => {
    const patternString = "@\\w+ for #";
    const pattern = new RegExp(patternString);
    if (pattern.test(note) && note?.charAt(note.length - 1) === '#') {
      showTypes(true);
    } else {
      showTypes(false);
    }
  }, [note]);
  const handleSelectType = (ele: string) => {
    if (type.includes(ele)) {
      setNote(note + ele);
      showTypes(false);
    }
  }

  console.log(note);

  return (
    <div className={styles.container}>
      {/* <div>{renderNote()}</div> */}
      <div className={styles.recommendBtn}>
        <button onClick={handleSelectAttend}>Attend</button>
        <button onClick={() => handleSelectSpeak()}>Speak</button>
        <button onClick={() => handleRecommend()}>Recommend</button>
      </div>
      <div className={styles.addNotes}>
        <form onSubmit={notes} ref={formRef} className={styles.form}>
          <textarea className={styles.textArea} placeholder="Take a note, @name" value={note} onChange={(e) => noteFun(e)} rows={4} onKeyDown={(e) => handleKeyDown(e)} />
          <button style={{ display: "flex" }} type="submit"><Image src={Send} alt="send" /></button>
        </form>
        {/* {employeeDropDown && (
          <div className={styles.employeeDropdown}>
            {filteredEmployees.map((employee: any, key: any) => (
              <div key={key} className={styles.employee} onClick={() => handleSelectRecommendation(employee)}>
                {employee.name}
              </div>
            ))}
          </div>
        )} */}

        {showUser && (
          <div className={styles.allUser}>
            {alluser.map((ele, ind) => (
              <div className={styles.option} key={ind} onClick={() => handleSelectRecommendation(ele)}>{ele}</div>
            ))}
          </div>
        )}
        {types && (
          <div className={styles.allUser}>
            {type.map((ele, ind) => (
              <div key={ind} className={styles.option} onClick={() => handleSelectType(ele)}>{ele}</div>
            ))}
          </div>
        )}
        <button className={styles.commentBtn}>
          {isReply ? isEditComment ? "Edit Comment" : "Reply" : "Comment"}
        </button>
      </div>
      <div className={styles.attachmentOption}>
        <Image className={styles.attachIcon} src={Attach} alt="attach" />
        <Image className={styles.attachIcon} src={Link} alt="link" />
        <Image className={styles.attachIcon} src={Emoji} alt="emoji" />
        <Image className={styles.attachIcon} src={Drive} alt="drive" />
        <Image className={styles.attachIcon} src={Pic} alt="image" />
        <Image className={styles.attachIcon} src={Lock} alt="lock" />
        <Image className={styles.attachIcon} src={Pen} alt="pen" />
      </div>

    </div>
  );
};