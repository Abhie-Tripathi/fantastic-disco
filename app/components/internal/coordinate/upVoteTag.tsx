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
  voteCount: number,
  handleVoteClick: (item:"Sponsoring" | "Speaking" | "Exhibiting" | "Attending")=> void,
}

const UpVoteTag: React.FC<voteProps> = ({type, status, voteCount, handleVoteClick}) => {

  const {theme} = useTheme();
  const iconClass = theme === 'light' ? 'icons_light' : 'icon';

  const upVote = () =>{
    handleVoteClick(type);
  }

  return(
    <div style={{ fontSize: "12px" }} >
      <div className={styles.circles}>
        <div className={styles.circle} data-name="John Doe">
          <Image className={styles.image} src={person1} alt="person1" width={25} height={25} />
        </div>
        <div className={styles.circle} style={{ marginLeft: "-8px", width: "25px", height: "25px" }} data-name="Ravi Tripathi">
          RT
        </div>
        <div className={styles.circle} style={{ marginLeft: "-8px" }} data-name="Jane Smith">
          <Image className={styles.image} src={person2} alt="person2" width={25} height={25} />
        </div>
        <span>&nbsp;&nbsp; +{voteCount}</span>
      </div>
      <div className={`${styles.vote_tags} ${status=='voted'?styles.upVoted:''}`} onClick={upVote}>
        <Image src={upArrow} alt="up" width={16} height={16} className={'icons_light'} />
        {type}
      </div>
    </div>
  )
}

export default UpVoteTag