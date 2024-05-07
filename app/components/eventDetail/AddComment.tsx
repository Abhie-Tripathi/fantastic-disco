"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "./addcomment.style.module.css";
import { Comment as IComment } from "../../../types/comment";
import { useAuthContext, useTheme } from "@/context";
import { MouseEvent } from "react";
import Send from "@/public/send.svg";
import Pdf from "/public/pdf.svg";
import Close from "/public/close.svg";
import Attach from "@/public/attach.svg";
import Link from "@/public/link.svg";
import Emoji from "@/public/emoji.svg";
import Pic from "@/public/image.svg";
import Pen from "@/public/pen.svg";
import Drive from "@/public/drive.svg";
import Lock from "@/public/lock.svg";
import Image from "next/image";
import EmployeeData from "@/public/data/employeeData.json";
import { revalidateComment } from "@/utils/commentAction";
import { log } from "util";
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
  setFilePreviews: any;
  filePreviews: any;
  selectedPdfs: any;
  setSelectedPdfs: any;
  note?: string | any;
  setNote: React.Dispatch<React.SetStateAction<string>>;
  comments?: IComment[];
  commentType?: string;
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
  setFilePreviews,
  filePreviews,
  selectedPdfs,
  setSelectedPdfs,
  comments,
  commentType
}: Props) => {
  const commentId = replyOptions?.commentId;
  const { user, signOut } = useAuthContext();
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";

  const [userDetail, setUserDetail] = useState<UserDetail | null>(
    user ? user : null
  );
  const [types, showTypes] = useState<boolean>(false);
  const isReply = isEditComment || isEditReply ? false : !!commentId;
  const [noten, setNoten] = useState<string>("");
  const [showUser, setShowUser] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [rec, setRec] = useState<boolean>(false);
  const [mention, setMention] = useState("");
  const [employeeDropDown, setEmployeeDropDown] = useState(false);
  const type: string[] = ["Speak", "Attend"];
  const [filteredEmployees, setFilteredEmployees] = useState(EmployeeData);
  const [alluser, setAlluser] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef(null);
  const pdfRef = useRef(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setUserDetail(user);
  }, [user]);
  // useEffect(() => {
  //   const trimmedNote = noten.trim(); // Trim whitespace from the beginning and end of the input
  //   if (trimmedNote.startsWith("@") || trimmedNote.includes(" @")) { // Check if "@" is at the start or preceded by a space
  //     setShowUser(true);
  //     const searchTerm = trimmedNote.substring(trimmedNote.lastIndexOf("@") + 1).trim(); // Extract text after the last "@" symbol
  //     if (searchTerm) {
  //       const filtered = alluser.filter((employee) =>
  //         employee.toLowerCase().includes(searchTerm.toLowerCase())
  //       );
  //       setAlluser(filtered);
  //     }
  //   }
  // }, [note, alluser]);
  useEffect(() => {
    const trimmedNote = note?.trim();
    if (trimmedNote?.includes("@")) {
      // setShowUser(true);
      const searchTerm = trimmedNote
        .substring(trimmedNote.lastIndexOf("@") + 1)
        .trim();
      if (searchTerm) {
        const filtered = alluser?.filter((user) => {
          return user.toLowerCase().includes(searchTerm.toLowerCase());
        });
        setAlluser(filtered);
      }
    } else setShowUser(false);
  }, [note]);
  // useEffect(() => {
  //   if (!resultContainer.current) return;

  //   resultContainer.current.scrollIntoView({
  //     block: "center",
  //   });
  // }, [focusedIndex]);
  // const handleKeyDown1 = (e) => {
  //   const { key } = e;
  //   console.log(1);

  //   let nextIndexCount = 0;

  //   // move down
  //   if (key === "ArrowDown")
  //     nextIndexCount = (focusedIndex + 1) % alluser.length;

  //   // move up
  //   if (key === "ArrowUp")
  //     nextIndexCount = (focusedIndex + alluser.length - 1) % alluser.length;

  // };
  const handleKeyDown1: React.KeyboardEventHandler<
    HTMLDivElement | HTMLTextAreaElement
  > = (e) => {
    const { key } = e;
    console.log(types + " " + showUser);
    let nextIndexCount = 0;
    // if(rec===true) setRec(false);
    // if(showUser===true) setShowUser(false);
    // move down
    if (key === "ArrowDown")
      nextIndexCount = (focusedIndex + 1) % alluser.length;

    // move up
    if (key === "ArrowUp")
      nextIndexCount = (focusedIndex + alluser.length - 1) % alluser.length;
    if (key === "Enter" && !e.shiftKey && (showUser || rec)) {
      e.preventDefault();
      const newNote = note + alluser[focusedIndex].substring(1) + " ";
      setNote(newNote);
      setRec(true);
    }
    // Handle Enter key press
    else if (key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      notes(e);
    } else if (key === "Enter" && e.shiftKey) {
      // Prevent default behavior
      e.preventDefault();
      // Handle shift + Enter to add a new line
      setNote((prev) => prev + "\n");
    }

    setFocusedIndex(nextIndexCount);
  };

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
    if (note?.charAt(note.length - 1) === "@") {
      console.log(comments);
      setShowUser(true);
      let arr = Array.from(
        new Set(
          comments?.map(
            (comment) =>
              "@" +
              comment?.user?.firstname +
              comment?.user?.lastname.toLowerCase()
          )
        )
      );
      console.log(arr);

      setAlluser(arr);
    }
    // else setShowUser(false);
  }, [note]);
  const noteFun = (e: any) => {
    setNote(e.target.value);
  };
  // },[note])
  const handleSelectRecommendation = (name: String) => {
    if (!note.includes(name)) {
      setNote((prevNote) => prevNote.replace(/@\w*$/, `${name} `));
      showTypes(false);
      setShowUser(false);
      // setMention("");
      setRec(true);
    }
    // console.log(1);
  };
  const handleSelectAttend = () => {
    setNote(
      "@" +
        userDetail?.firstname +
        userDetail?.lastname.toLowerCase() +
        " wants to #Attend"
    );
    setShowUser(false);
  };
  const handleSelectSpeak = () => {
    // setNote(note.substring(0,note.length-6)+"@"+userDetail?.firstname+userDetail?.lastname.toLowerCase()+" wants to #Speak");
    setNote(
      "@" +
        userDetail?.firstname +
        userDetail?.lastname.toLowerCase() +
        " wants to #Speak"
    );
    setShowUser(false);
  };
  const handleRecommend = (event: any) => {
    event.preventDefault();
    let arr = Array.from(
      new Set(
        comments?.map(
          (comment) =>
            "@" +
            comment?.user?.firstname +
            comment?.user?.lastname.toLowerCase()
        )
      )
    );
    setAlluser(arr);
    setNote(
      note.substring(0, note.lastIndexOf("/")) +
        `@${
          userDetail?.firstname
        }${userDetail?.lastname.toLowerCase()} wants to recommend @`
    );
    // if (alluser.some(type => note?.includes(type)) && textareaRef.current) {
    //   textareaRef.current.focus();
    // }
    if (textareaRef?.current) textareaRef.current.focus();
    setShowUser(true);
  };
  useEffect(() => {
    if (rec === true) {
      setNote((prev) => prev + "for #");
      setRec(false);
      setShowUser(false);
    }
  }, [rec]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && mention.length === 0) {
      event.preventDefault();
      console.log(11111);
      notes(event);
    } else if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setNote((prev) => prev + "\n");
    }
  };
  const [recommendCalled, setRecommendCalled] = useState(false);
  if (note?.includes("/recommend") && !recommendCalled) {
    setRecommendCalled(true);
    handleRecommend(event);
  }
  const formRef1 = useRef(null);

  useEffect(() => {
    if (note?.includes("#speak")) {
      handleSelectSpeak();
    }
    if (note?.includes("#attend")) {
      handleSelectAttend();
    }
    if (note?.includes("/recommend")) {
      handleRecommend(event);
    }
    if (note?.charAt(note.length - 1) === "@") {
      handleRecommend(event);
    }
    if (note === "") {
      setRec(false);
      setDisable(false);
    }
  }, [note]);
  useEffect(() => {
    const patternString =
      "@\\w+\\s+wants\\s+to\\s+recommend\\s+@\\w+\\s+for\\s+#";
    const pattern = new RegExp(patternString);
    if (pattern.test(note) && note?.charAt(note.length - 1) === "#") {
      showTypes(true);
    } else {
      showTypes(false);
    }
  }, [note]);

  const [disable, setDisable] = useState(false);
  const handleSelectType = (event: any, ele: string) => {
    console.log(ele);

    if (type.includes(ele)) {
      setNote((prev) => prev + ele);
      // handleKeyDown1(event);
      showTypes(false);
      setRec(false);
      setShowUser(false);
      setDisable(true);
      // notes(event);
    }
  };

  useEffect(() => {
    if (type.some((type) => note?.includes(type)) && textareaRef.current) {
      textareaRef.current.focus();
    }
    if (alluser.some((type) => note?.includes(type)) && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [types, note]);
  console.log(note);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // const handleFileChange = (event: any) => {
  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
    setFilePreviews((prevSelectedFiles: File[] | null) => {
      if (
        prevSelectedFiles === null ||
        typeof prevSelectedFiles === "undefined"
      ) {
        return [event.target.files[0]];
      } else {
        return [...prevSelectedFiles, event.target.files[0]];
      }
    });
  };

  const handleUpload = () => {
    // setUploading(true);
    setTimeout(() => {
      setUploading(true);
      setModalIsOpen(false);
      // setSelectedFile(null);
      // setFilePreview(null); // Clear file preview after upload
    }, 2000);
  };
  // useEffect(() => {
  //   if (!selectedFile) {
  //     console.error("No file selected.");
  //     return;
  //   }

  //   // Simulate upload process
  //   if (selectedFile && selectedFile.type.startsWith("image")) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setFilePreview(reader.result as string);
  //     };
  //     reader.readAsDataURL(selectedFile);
  //   }
  // }, [selectedFile])
  const setModal = () => {
    setModalIsOpen(true);
  };
  // const [selectedPdfs, setSelectedPdfs] = useState<string[]>([]);
  const pdfUpload = (event: any) => {
    const selectedFile = event.target.files[0];
    console.log(URL.createObjectURL(selectedFile));

    // Check if the selected file is a PDF
    if (selectedFile && selectedFile.type === "application/pdf") {
      setSelectedPdfs([...selectedPdfs, selectedFile.name]);
    } else {
      // Handle case when file is not a PDF
      console.log("Please select a PDF file.");
    }
  };
  const removeImg = (id: number) => {
    const filteredImg = filePreviews.filter(
      (item: any, ind: number) => ind !== id
    );
    console.log(filteredImg);

    setFilePreviews(filteredImg);
  };
  useEffect(() => {
    console.log(selectedPdfs);
  }, [selectedPdfs]);
  const pdfSelect = () => {
    if (pdfRef.current) {
      const inputElement = pdfRef.current as HTMLInputElement;
      inputElement.click();
    }
  };
  const imgUpload = () => {
    if (fileRef.current) {
      const inputElement = fileRef.current as HTMLInputElement;
      inputElement.click();
    }
  };
  useEffect(() => {
    if (!resultContainer.current) return;

    resultContainer.current.scrollIntoView({
      block: "center",
    });
  }, [focusedIndex]);
  return (
    <div className={styles.container}>
      {/* <div>{renderNote()}</div> */}
      <form onSubmit={notes} ref={formRef1} className={styles.form}>
        { commentType === 'mainComment' ? 
        <div className={styles.recommendBtn}>
          <button
            onClick={handleSelectAttend}
            className={`${styles.btn1} ${
              theme === "light" && styles.btn1_light
            }`}
          >
            I want to Attend
          </button>
          <button
            onClick={() => handleSelectSpeak()}
            data-action="speak"
            className={`${styles.btn1} ${
              theme === "light" && styles.btn1_light
            }`}
          >
            I want to Speak
          </button>
          <button
            onClick={handleRecommend}
            className={`${styles.btn1} ${
              theme === "light" && styles.btn1_light
            }`}
          >
            I want to @Recommend
          </button>
        </div>
        : <></>}
        <div style={{ display: "flex", gap: "10px" }}>
          {selectedPdfs?.map((item: string, ind: number) => (
            <div key={ind} className={styles.pdf}>
              <Image src={Pdf} width={50} height={50} alt="pdf" />
              <p key={ind} style={{ display: "flex" }}>
                {item}
              </p>
            </div>
          ))}
        </div>
        {filePreviews && (
          <>
            <div className={styles.filePreview}>
              {filePreviews.map((filePreview: any, index: number) => (
                <div className={styles.fileDiv} key={index}>
                  <Image
                    src={URL.createObjectURL(filePreview)}
                    width={80}
                    height={80}
                    alt="File Preview"
                  />
                  <Image
                    className={styles.close}
                    src={Close}
                    onClick={() => removeImg(index)}
                    alt="close"
                  />
                </div>
              ))}
            </div>
          </>
        )}
        <div className={styles.addNotes} onKeyDown={handleKeyDown1}>
          <textarea
            readOnly={disable}
            ref={textareaRef}
            className={`${styles.textArea} ${theme === 'light' && styles.textArea_light}`}
            placeholder="Take a note, @name"
            value={note}
            onChange={(e) => noteFun(e)}
            rows={4}
            onKeyDown={handleKeyDown1}
          />
          <button style={{ display: "flex" }} type="submit">
            <Image src={Send} alt="send" className={iconClass} />
          </button>

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
            // <div className={styles.allUser}  tabIndex={1} onKeyDown={handleKeyDown1}>
            <div className={styles.allUser}>
              {alluser.map((ele, ind) => (
                <div
                  ref={ind === focusedIndex ? resultContainer : null}
                  style={{
                    backgroundColor: ind === focusedIndex ? "#2B233D" : "",
                  }}
                  className={styles.option}
                  key={ind}
                  onMouseDown={() => handleSelectRecommendation(ele)}
                >
                  {ele}
                </div>
              ))}
            </div>
          )}
          {types && (
            <div className={styles.allUser}>
              {type.map((ele, ind) => (
                <div
                  key={ind}
                  className={styles.option}
                  onClick={(e) => handleSelectType(e, ele)}
                >
                  {ele}
                </div>
              ))}
            </div>
          )}
          <button className={styles.commentBtn}>
            {isReply ? (isEditComment ? "Edit Comment" : "Reply") : "Comment"}
          </button>
        </div>
      </form>

      <div className={styles.attachmentIcon}>
        <button
          ref={fileRef}
          onClick={() => setModal()}
          style={{ display: "none" }}
        >
          Upload File
        </button>
        <input
          type="file"
          onChange={handleFileChange}
          ref={fileRef}
          style={{ display: "none" }}
        />
        <input
          ref={pdfRef}
          type="file"
          name="file"
          id="file"
          onChange={pdfUpload}
          style={{ display: "none" }}
        />
        <div className={styles.attachIconContainer} data-name="Attach">
          <Image
            className={`${styles.attachIcon} ${iconClass}`}
            src={Attach}
            alt="attach"
          />
        </div>
        <div className={styles.attachIconContainer} data-name="Link">
          <Image
            className={`${styles.attachIcon} ${iconClass}`}
            src={Link}
            alt="link"
          />
        </div>
        <div className={styles.attachIconContainer} data-name="Emoji">
          <Image
            className={`${styles.attachIcon} ${iconClass}`}
            src={Emoji}
            alt="emoji"
          />
        </div>
        <div className={styles.attachIconContainer} data-name="Upload File">
          <Image
            className={`${styles.attachIcon} ${iconClass}`}
            onClick={pdfSelect}
            src={Drive}
            alt="drive"
          />
        </div>
        <div className={styles.attachIconContainer} data-name="Upload Image">
          <Image
            className={`${styles.attachIcon} ${iconClass}`}
            src={Pic}
            onClick={imgUpload}
            alt="image"
          />
        </div>
        <div className={styles.attachIconContainer} data-name="Lock">
          <Image
            className={`${styles.attachIcon} ${iconClass}`}
            src={Lock}
            alt="lock"
          />
        </div>
        <div className={styles.attachIconContainer} data-name="Write">
          <Image
            className={`${styles.attachIcon} ${iconClass}`}
            src={Pen}
            alt="pen"
          />
        </div>
      </div>

      {modalIsOpen && (
        <div className={styles.overlay}>
          <div className={styles.content} onClick={(e) => e.stopPropagation()}>
            <h2>Upload File</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <button onClick={() => setModalIsOpen(false)}>Close</button>
            <div className={styles.attachmentContainer}>
              {/* Render file preview if available */}
              {/* {filePreview && (
                <div className={styles.filePreview}>
                  <Image src={filePreview} width={100} height={100} alt="File Preview" />
                </div>
              )} */}
            </div>
            {uploading && <p>Uploading...</p>}
          </div>
        </div>
      )}
    </div>
  );
};
