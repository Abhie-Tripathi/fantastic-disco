import UserProfile from '@/app/components/userProfile/UserProfile';
import Reply from '@/public/reply.svg'
import { File } from 'geist-icons';
import Image from 'next/image';
import Link from 'next/link';
import React,{useState,useEffect} from 'react';
// Define the type for the note prop
// interface Note {
//   content: string;
// }

interface NotesDiscussionWidgetProps {
  note: any;
  redirectUrl:string;
}

const NotesDiscussionWidget: React.FC<NotesDiscussionWidgetProps> = ({ note, redirectUrl }) => {
    // const [displayNote, setDisplayNote] = useState(note);

    // useEffect(() => {
    //   if (note !== undefined) {
    //     setDisplayNote(note);
    //   }
    // }, [note]);
    // console.log(displayNote[0]?.id);
    console.log(note);
    
    return (
      <Link href={`${redirectUrl}`} className="flex w-full flex-col gap-6 border rounded-[12px] p-4 border-[var(--border-color)] bg-[var(--primary-foreground)]">
          <div className="flex items-center gap-2 text-[var(--primary-color)]">
            <div className="font-semibold">Notes & Discussions</div>
          </div>
          
          {note ? (
            <div className="relative flex items-center justify-center">
              <div className="flex p-2 h-[85px] w-[95%] flex-col rounded-[20px] gap-2 border-b-[1px] border-[var(--border-color)]"></div>
              
              <div className="flex items-center p-2 h-[85px] w-full top-[-12px] flex-row rounded-[20px] gap-2 absolute justify-between border-[1px] border-[var(--border-color)] shadow-[var(--shadow-medium)]">
                <div className="flex gap-2">
                  {note && (
                    <>
                      <div className="flex items-center justify-center gap-2">
                        {note[0]?.user?.UserDetail?.attachment?.filePath?<Image src={note[0]?.user?.UserDetail?.attachment?.filePath} alt="userProfile" height={40} width={40} style={{borderRadius:"50%", height:"40px", width:"40px"}}/>:(
                          <div style={{display:"flex"}}>
                              <UserProfile name={`${note[0]?.user?.firstname} ${note[0]?.user?.lastname}`} />
                              </div>
                        )}
                      <div className="flex flex-col">
                        <div className="font-semibold">{`${note[0]?.user?.firstname} ${note[0]?.user?.lastname}`}</div>
                        {note[0]?.content.length!==0?
                        (<div className="text-xs text-[var(--secondary-text-color)]">
                          {note[0]?.content.length > 40 
                            ? `${note[0]?.content.substring(0, 40)}...`
                            : note[0]?.content
                          }
                        </div>):(
                          <div className='flex items-center gap-1'>
                            <File width='12px' height='12px' style={{color:"var(--secondary-text-color)"}}/>
                            <span className='text-xs text-[var(--secondary-text-color)]'>Attachment</span></div>
                        )
                        }
                      </div>
                      </div>
                      
                    </>
                  )}
                </div>
                
                <div className="flex items-center justify-center p-3 rounded-full font-medium border-[1px] border-[var(--border-color)]">
                  <Image src={Reply} alt="reply" />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-[var(--secondary-text-color)] text-sm -mt-4">
              Let&apos;s start taking notes and initiate the discussion with the team.
            </div>
          )}
      </Link>
    );
};

export default NotesDiscussionWidget;
