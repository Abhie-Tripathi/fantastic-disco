import React,{useEffect, useState} from 'react'
import Tags from './Tags'
const Section = ({demoEvent}) => {
    const [tagList, setTagList] = useState([]);
    const isAdd = true;
  return (
    <div style={{display: "flex",flexDirection: "column",gap: "10px"}}>
      <Tags tagList={tagList} setTagList={setTagList} isAdd={isAdd} />
    </div>
  )
}

export default Section