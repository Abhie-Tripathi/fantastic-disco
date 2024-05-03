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
  setFilePreviews: any;
  filePreviews: any;
  selectedPdfs: any;
  setSelectedPdfs: any;
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
  setFilePreviews,
  filePreviews,
  selectedPdfs,
  setSelectedPdfs,
  comments,
}: Props) => {
  const commentId = replyOptions?.commentId;
  const { user, signOut } = useAuthContext();
  const [userDetail, setUserDetail] = useState<UserDetail | null>(
    user ? user : null
  );
  const [types, showTypes] = useState<boolean>(false);
  const isReply = isEditComment || isEditReply ? false : !!commentId;
  const [noten, setNoten] = useState<string>("");
  const [showUser, setShowUser] = useState(false);
  const [rec, setRec] = useState<boolean>(false);
  const [employeeDropDown, setEmployeeDropDown] = useState(false);
  const type: string[] = ["Speak", "Attend"];
  const [filteredEmployees, setFilteredEmployees] = useState(EmployeeData);
  const [alluser, setAlluser] = useState<String[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef(null);
  const pdfRef = useRef(null);

  const { theme } = useTheme();
  const iconClass = theme === "light" ? 'icons_light' : 'icon' ;

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
      setShowUser(true);
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

    setShowUser(true);
  };
  useEffect(() => {
    if (rec) {
      setNote((prev) => prev + "for #");
      setRec(!rec);
    }
  }, [rec]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
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
    const patternString = "@\\w+ for #";
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
      handleKeyDown(event);
      showTypes(false);
      setDisable(true);
      // notes(event);
    }
  };
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (type.some((type) => note?.includes(type)) && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [types]);
  console.log(note);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: any) => {
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
  return (
    <div className={styles.container}>
      {/* <div>{renderNote()}</div> */}
      <form onSubmit={notes} ref={formRef1} className={styles.form}>
        <div className={styles.recommendBtn}>
          <button onClick={handleSelectAttend} className={`${styles.btn1} ${theme === 'light' && styles.btn1_light}`}>
            I want to Attend
          </button>
          <button
            onClick={() => handleSelectSpeak()}
            data-action="speak"
            className={`${styles.btn1} ${theme === 'light' && styles.btn1_light}`}
          >
            I want to Speak
          </button>
          <button onClick={handleRecommend} className={`${styles.btn1} ${theme === 'light' && styles.btn1_light}`}>
            I want to @Recommend
          </button>
        </div>
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
        <div className={styles.addNotes}>
          <textarea
            readOnly={disable}
            ref={textareaRef}
            className={`${styles.textArea} ${theme === 'light' && styles.textArea_light}`}
            placeholder="Take a note, @name"
            value={note}
            onChange={(e) => noteFun(e)}
            rows={4}
            onKeyDown={(e) => handleKeyDown(e)}
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
            <div className={styles.allUser}>
              {alluser.map((ele, ind) => (
                <div
                  className={styles.option}
                  key={ind}
                  onClick={() => handleSelectRecommendation(ele)}
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
        <Image
          className={`${styles.attachIcon} ${iconClass}`}
          src={Attach}
          alt="attach"
        />
        <Image
          className={`${styles.attachIcon} ${iconClass}`}
          src={Link}
          alt="link"
        />
        <Image
          className={`${styles.attachIcon} ${iconClass}`}
          src={Emoji}
          alt="emoji"
        />
        <Image
          className={`${styles.attachIcon} ${iconClass}`}
          onClick={pdfSelect}
          src={Drive}
          alt="drive"
        />
        <Image
          className={`${styles.attachIcon} ${iconClass}`}
          src={Pic}
          onClick={imgUpload}
          alt="image"
        />
        <Image
          className={`${styles.attachIcon} ${iconClass}`}
          src={Lock}
          alt="lock"
        />
        <Image
          className={`${styles.attachIcon} ${iconClass}`}
          src={Pen}
          alt="pen"
        />
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
