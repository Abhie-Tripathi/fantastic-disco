import UserProfile from '@/app/components/userProfile/UserProfile';
import Reply from '@/public/reply.svg'
import Image from 'next/image';
import React,{useState,useEffect} from 'react';
// Define the type for the note prop
interface Note {
  content: string;
}

interface NotesDiscussionWidgetProps {
  note: Note;
}

const NotesDiscussionWidget: React.FC<NotesDiscussionWidgetProps> = ({ note }) => {
    // const [displayNote, setDisplayNote] = useState(note);

    // useEffect(() => {
    //   if (note !== undefined) {
    //     setDisplayNote(note);
    //   }
    // }, [note]);
    // console.log(displayNote[0]?.id);
    console.log(note);
    
  return (
    <div className="flex w-[100%] flex-col gap-6 border rounded-[12px] p-4" style={{ border: "1px solid var(--border-color)" }}>
      <div className='flex items-center gap-2' style={{ color: "var(--primary-color)" }}>
        <div className='font-semibold'>Notes & Discussions</div>
      </div>
      {note?(<div className='relative flex items-center justify-center'>
        <div className='flex p-2 h-[85px] w-[95%] flex-col rounded-[20px] gap-2' style={{ borderBottom: "1px solid var(--border-color)" }}>
        </div>
        <div className='flex items-center p-2 h-[85px] w-[100%] top-[-12px] flex-row rounded-[20px] gap-2 absolute justify-between' style={{ border: "1px solid var(--border-color)", boxShadow: "var(--shadow-medium)" }}>
          <div className='flex gap-2'>
            {note &&
            <>
            <div className="flex items-center justify-center">
            <UserProfile name={note && `${note[0]?.user?.firstname} ${note[0]?.user?.lastname}`}/>
            </div>
            
            <div className='flex flex-col'>
            <div className='font-semibold'>{note && `${note[0]?.user?.firstname} ${note[0]?.user?.lastname}`}</div>
            <div className='text-xs color-[var(--secondary-text-color)]'>
            {note && note[0]?.content.length > 50 
    ? `${note[0]?.content.substring(0, 50)}...` 
    : note[0]?.content
  }
            </div>
            </div>
            </>
}
          </div>
          
          <div className='flex items-center justify-center p-3 rounded-[50%] font-medium' style={{ border: "1px solid var(--border-color)" }}>
            <Image src={Reply} alt="reply" />
          </div>
        </div>
      </div>):<div className='text-[var(--secondary-text-color)] text-sm -mt-4'>Let's start taking notes and initiate the discussion with the team.</div>}
    </div>
  );
};

export default NotesDiscussionWidget;
