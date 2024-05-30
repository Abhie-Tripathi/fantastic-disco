import React from "react";
import styles from "./categoryDropdown.module.css";
import { categories } from "@/public/data/categories";
import CheckboxInput from "../../UI/CheckBoxInput";
import { useTheme } from "@/context";

interface CategoryDropdownProps {
  className?: string
  dropdownRef?: React.MutableRefObject<null>;
  state: string[];
  setState: ([]) => void;
  onClose?: () => void;
}

const CategoryDropdown = ({ state, setState }: CategoryDropdownProps) => {
  const {theme}=useTheme();
  const onClickHandler = (value: string) => {
    state.includes(value)
      ? setState(state.filter((data) => data !== value))
      : setState([...state, value]);
  };

  function containsSubarray(childArray: string[]) {
    if (childArray.length === 0) return true; // An empty array is always a subarray
    if (childArray.length > state.length) return false; // Child array can't be longer than the parent array

    return state.some((_, index) => {
      if (index + childArray.length > state.length) return false;
      return childArray.every(
        (value, childIndex) => state[index + childIndex] === value
      );
    });
  }

  const attendedCategories = categories[0].attended!.map(
    (category) => category.slug
  );
  const nonAttendedCategories = categories[1].nonAttended!.map(
    (category) => category.slug
  );

  const unscheduledCategories = categories[2].unscheduled!.map(
    (category) => category.slug
  );

  const selectAllHandler = (categories: string[]) => {
    if (containsSubarray(categories)) {
      setState(state.filter((category) => !categories.includes(category)));
    } else {
      setState([...state, ...categories]);
    }
  };


  return (
    <div className={styles.container} style={{background: theme==="light"?"#F7F7F9":""}}>
      <div>
        <div className={styles.heading}>Attended</div>
        <div className={styles.list}>
          <li key="selectAllAttended">
            <CheckboxInput
              id="selectAllAttended"
              onChange={() => selectAllHandler(attendedCategories)}
              checked={containsSubarray(attendedCategories)}
            />
            <label htmlFor="selectAllAttended">Select All</label>
          </li>
          {categories[0]?.attended?.map((attendedCategory) => {
            return (
              <li key={attendedCategory.slug}>
                <CheckboxInput
                  id={attendedCategory.slug}
                  onChange={() => onClickHandler(attendedCategory.slug)}
                  checked={state.includes(attendedCategory.slug)}
                />
                <label htmlFor={attendedCategory.slug}>
                  {attendedCategory.name}
                </label>
              </li>
            );
          })}
        </div>
      </div>
      <div>
        <div className={styles.heading}>Non-Attended</div>
        <ul className={styles.list}>
          <li key="selectAllNonAttended">
            <CheckboxInput
              id="selectAllNonAttended"
              onChange={() => selectAllHandler(nonAttendedCategories)}
              checked={containsSubarray(nonAttendedCategories)}
            />
            <label htmlFor="selectAllNonAttended">Select All</label>
          </li>
          {categories[1].nonAttended?.map((nonAttendedCategory, key) => {
            return (
              <li key={nonAttendedCategory.slug}>
                <CheckboxInput
                  id={nonAttendedCategory.slug}
                  onChange={() => onClickHandler(nonAttendedCategory.slug)}
                  checked={state.includes(nonAttendedCategory.slug)}
                />
                <label htmlFor={nonAttendedCategory.slug}>
                  {nonAttendedCategory.name}
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <div className={styles.heading}>Unscheduled</div>
        <ul className={styles.list}>
          <li key="selectAllUnscheduled">
            <CheckboxInput
              id="selectAllUnscheduled"
              onChange={() => selectAllHandler(unscheduledCategories)}
              checked={containsSubarray(unscheduledCategories)}
            />
            <label htmlFor="selectAllUnscheduled">Select All</label>
          </li>
          {categories[2].unscheduled?.map((unscheduledCategory, key) => {
            return (
              <li key={unscheduledCategory.slug}>
                <CheckboxInput
                  id={unscheduledCategory.slug}
                  onChange={() => onClickHandler(unscheduledCategory.slug)}
                  checked={state.includes(unscheduledCategory.slug)}
                />
                <label htmlFor={unscheduledCategory.slug}>
                  {unscheduledCategory.name}
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default CategoryDropdown;