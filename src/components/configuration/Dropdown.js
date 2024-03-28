import React, { useState } from "react";
import Styles from './dropDown.style.module.css'
import CheckedBox from "../../icons/checkedBox.svg";
import UncheckedBox from "../../icons/uncheckedBox.svg";

const options = ["Distributors", "Manufacturers", "Retailers", "Pharmacies"];

const Dropdown = ({ demoEvent, state, setState, orientation }) => {
  const onClickHandler = (name) => {
   setState([name]);
  };
  return (
    <div>
    <div className={Styles.overlay}></div>
      <div className={Styles.outerContainer}>
        <div
          className={`${Styles.dropcontainer} ${orientation ? Styles.upwards : ""}`}
        >
          <div className={Styles.info}>--Select all that applies--</div>
          <div className={Styles.options_container}>
            {demoEvent.map((option) => (
              <div
                className={Styles.option}
                onClick={() => onClickHandler(option.name)}
              >
                {state.includes(option) ? <img src={CheckedBox} /> : <img src={UncheckedBox} />}
                <div className={Styles.option_title}>{option.name}</div>
              </div>
            ))}
          </div>
        </div>
    </div>
    </div>
  );
};

export default Dropdown;