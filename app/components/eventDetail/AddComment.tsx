"use client";
import React, { useEffect, useState } from "react";
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
  productId: string;
  replyOptions?: replyOptions;
  focus?: boolean;
  isEditComment?: boolean;
  isEditReply?: boolean;
  editCommentText?: string;
  className?: string;
  repliesLength?: number
}
interface replyOptions {
  commentId: string;
}
export const AddComment = ({
  productId,
  replyOptions,
  focus,
  isEditComment,
  isEditReply,
  className,
  repliesLength,
}: Props) => {
  const commentId = replyOptions?.commentId;
  const isReply = isEditComment || isEditReply ? false : !!commentId;
  const [note, setNote] = useState<string>("");
  const [employeeDropDown, setEmployeeDropDown] = useState(false)
  const [filteredEmployees, setFilteredEmployees] = useState(EmployeeData);

  useEffect(() => {
    const trimmedNote = note.trim(); // Trim whitespace from the beginning and end of the input
    if (trimmedNote.startsWith("@") || trimmedNote.includes(" @")) { // Check if "@" is at the start or preceded by a space
      setEmployeeDropDown(true);
      const searchTerm = trimmedNote.substring(trimmedNote.lastIndexOf("@") + 1).trim(); // Extract text after the last "@" symbol
      if (searchTerm) {
        const filtered = EmployeeData.filter((employee) =>
          employee.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEmployees(filtered);
      } else {
        setFilteredEmployees(EmployeeData); // Show all employees if no specific name is typed after "@"
      }
    } else {
      setEmployeeDropDown(false);
    }
  }, [note, EmployeeData]);


  const handleEmployeeClick = (employee: any) => {
    setNote((prevNote) => {
      // Find the last index of "@" in the input value
      const lastIndex = prevNote.lastIndexOf("@");
      // Split the input value into two parts: text before "@" and text after "@"
      const beforeAt = prevNote.substring(0, lastIndex);
      const afterAt = prevNote.substring(lastIndex + 1);
      // Concatenate the text before "@" with the selected employee name and "@" and text after "@"
      return `${beforeAt}@${employee.name} ${afterAt}`;
    });
    setEmployeeDropDown(false);
  }
  const renderNote = () => {
    const parts = note.split("@");
    return parts.map((part, index) => {
      if (index === 0) {
        return part;
      } else {
        return (
          <span key={index} style={{ color: "blue" }}>
            @{part}
          </span>
        );
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.addNotes}>
        <input type="text" placeholder="Take a note, @name" value={note} onChange={(e) => setNote(e.target.value)} />
        <div style={{ display: "flex" }}><Image src={Send} alt="send" /></div>
        {employeeDropDown && (
          <div className={styles.employeeDropdown}>
            {filteredEmployees.map((employee: any, key: any) => (
              <div key={key} className={styles.employee} onClick={() => handleEmployeeClick(employee)}>
                {employee.name}
              </div>
            ))}
          </div>
        )}
         <div>{renderNote()}</div>
      </div>
      <button className={styles.commentBtn}>
        {isReply ? isEditComment ? "Edit Comment" : "Reply" : "Comment"}
      </button>
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