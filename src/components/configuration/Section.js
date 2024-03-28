import React,{useEffect, useState} from 'react'
import RangePicker from './RangePicker'
import Tags from './Tags'
const Section = ({demoEvent}) => {
    const [tagList, setTagList] = useState([]);
    // useEffect(()=>{
    //     console.log(tagList);
    // },[tagList])
    console.log(tagList)
    const isAdd = true;
  return (
    <div style={{display: "flex",flexDirection: "column",gap: "10px"}}>
      <RangePicker  demoEvent={demoEvent}/>
      <Tags tagList={tagList} setTagList={setTagList} isAdd={isAdd} />
    </div>
  )
}

export default Section