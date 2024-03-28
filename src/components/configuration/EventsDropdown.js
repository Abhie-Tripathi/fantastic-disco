import React, { useState } from "react";
import Down from '../../icons/downArrow.svg'
import Dropdown from "./Dropdown";
import Styles from './eventsDropdown.style.module.css'
import DropDown from "../refs/DropdownRef";
const EventsDropDown = ({ demoEvent, buyerTags, setBuyerTags }) => {
    const evenetFilter=DropDown();
    const fontFilter=DropDown();
    const [inputHeight,setInputHeight]=useState();
    const [inputFontSize,setInputFontSize]=useState();
    const [showBuyerDropdown, setShowBuyerDropdown] = useState(false);
    const heights=['px','%','vh','em']
    const fontSizes=['px', '%', 'pt','em']
    const [fontValue,setFontValue]=useState("px");
    const [heightValue,setHeightValue]=useState("px");
    const [bgcolor, setBgColor] = useState('#000000');
    const [fcolor, setFColor] = useState('#4ca9c8');
    const handleColorChange = (event) => {
        setBgColor(event.target.value);
      };
      const handlefColorChange = (event) => {
        setFColor(event.target.value);
      };
    const setHeightSticky=(item)=>{
        console.log(1);
        setHeightValue(item);
        evenetFilter.setIsOpen(!evenetFilter.isOpen);
    }
    const setFontSticky=(item)=>{
        setFontValue(item);
        fontFilter.setIsOpen(!fontFilter.isOpen);
    }
    const handleSubmit=()=>{
      const allFilters={
        eventName: buyerTags[0],
        height: inputHeight+heightValue,
        fontSizes: inputFontSize+fontValue,
        bgcolor:bgcolor,
        fgcolor:fcolor
      }
      console.log(allFilters);
    }
    console.log(bgcolor)
  return (
    <div style={{display:"flex",gap:"10px", flexDirection:"column"}}>
        <div>
      <div>Event Name</div>
      <div
        className={Styles.dropdown_box}
        onClick={() => setShowBuyerDropdown(!showBuyerDropdown)}
      >
        {buyerTags.length == 0 ? (
          <div className={Styles.placeholder}>--Select--</div>
        ) : (
          buyerTags.map((tag) => (
            <div
              key={tag}
              className={Styles.small_Button}
            >
              {tag}
            </div>
          ))
        )}
        <img src={Down} className={Styles.downIcon} />
        {showBuyerDropdown && (
          <Dropdown state={buyerTags} setState={setBuyerTags} demoEvent={demoEvent}/>
        )}
      </div>
      </div>
      <div>
        Height
        <div
        className={Styles.dropdown_box}>
            <div style={{width:"100%", display:"flex", alignItems:"center", gap:"10px"}}>
            <input className={Styles.inputArea} type="number" value={inputHeight} onChange={(e)=>setInputHeight(e.target.value)}/>
            <div style={{position:"relative", color:"black"}}ref={evenetFilter.dropdownRef} onClick={evenetFilter.toggleDropdown} >
                {heightValue}
                {evenetFilter.isOpen&&(
                <div className={Styles.dropdownMenuHeight}>
               {heights.map((item)=>(
                <div onClick={()=>setHeightSticky(item)}>{item}</div>
               ))}
                </div>
            )}
            </div>

            </div>
            </div>
      </div>
      <div>
        Font Size
        <div
        className={Styles.dropdown_box}>
            <div style={{width:"100%", display:"flex", alignItems:"center", gap:"10px"}}>
            <input className={Styles.inputArea} type="number" value={inputFontSize} onChange={(e)=>setInputFontSize(e.target.value)}/>
            <div style={{position:"relative", color:"black"}}ref={fontFilter.dropdownRef} onClick={fontFilter.toggleDropdown} >
                {fontValue}
                {fontFilter.isOpen&&(
                <div className={Styles.dropdownMenuHeight}>
               {fontSizes.map((item)=>(
                <div onClick={()=>setFontSticky(item)}>{item}</div>
               ))}
                </div>
            )}
            </div>

            </div>
            </div>
      </div>
      <div className={Styles.colorOuter}>
        Color 
        <div style={{display:"flex"}}>
        <div className={Styles.colorInner}> 
            Background Color
        <input type="color" className={Styles.color} value={bgcolor} 
          onChange={handleColorChange} />
        </div>
        <div className={Styles.colorInner} style={{justifyContent:"flex-end"}}> 
            Foreground Color
        <input type="color" className={Styles.color} value={fcolor} 
          onChange={handlefColorChange} />
        </div>
        </div>
      </div>
      <div className={Styles.submit_button} onClick={()=>handleSubmit()}>
          Submit
        </div>
    </div>
  )
}

export default EventsDropDown
