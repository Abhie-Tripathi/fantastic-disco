import React, { useState } from 'react'
import styles from './tag.style.module.css'
import Image from 'next/image'
import person1 from '@/public/person1.svg'
import person2 from '@/public/person2.svg'
import upArrow from '/public/internal/up_arrow.svg';
import { useTheme } from '@/context';

interface voteProps {
  type: "Sponsoring" | "Speaking" | "Exhibiting" | "Attending",
  status?: string,
  userList: [{name: string}]
  handleVoteClick: (item:"Sponsoring" | "Speaking" | "Exhibiting" | "Attending")=> void,
}

function getInitials(name: string) {
  const words = name.split(" ");
  let initials = "";
  words.forEach(word => {
    initials += word.charAt(0).toUpperCase();
  });
  return initials;
}

const UpVoteTag: React.FC<voteProps> = ({type, status, userList, handleVoteClick}) => {

  const {theme} = useTheme();
  const iconClass = theme === 'light' ? 'icons_light' : 'icon';

  const upVote = () =>{
    handleVoteClick(type);
  }

  return(
    <div className={styles.main} >
      <div className='desktop_view'>
        <div className={styles.circles}>
          <>
          { userList && userList.map((item, index) => {
              return (
                <div key={index} className={`${styles.circle} ${index>0? styles.imageOverlap:''}`} style={{ width: "25px", height: "25px" }} data-name={item.name}>
                  {getInitials(item.name)}
                </div>
              )
            })
          }
          { userList && userList.length > 3 && 
            <span>&nbsp;&nbsp; +{userList?.length - 3}</span>
          }
          </>
        </div>
      </div>
      <div className={`${styles.vote_tags} ${status=='voted'?styles.upVoted:''}`} onClick={upVote}>
        <Image src={upArrow} alt="up" width={16} height={16} className={'icons_light'} />
        {type}
      </div>
    </div>
  )
}

export default UpVoteTag