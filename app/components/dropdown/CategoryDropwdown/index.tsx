import React, { useEffect, useState } from "react";
import styles from "./categoryDropdown.module.css";
import CheckboxInput from "../../UI/CheckBoxInput";
import { useTheme } from "@/context";

interface CategoryDropdownProps {
  className?: string;
  dropdownRef?: React.MutableRefObject<null>;
  state: string[];
  setState: ([]) => void;
  onClose?: () => void;
  categoryData?: any;
}


const CategoryDropdown = ({
  state,
  setState,
  categoryData,
}: CategoryDropdownProps) => {
  const {theme} = useTheme()
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

  const attended = categoryData.attendedCategories!.map(
    (category: any) => category.slug
  );
  const nonAttended = categoryData.nonAttendedCategories!.map(
    (category: any) => category.slug
  );

  const unscheduled = categoryData.unscheduledCategories!.map(
    (category: any) => category.slug
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
              onChange={() => selectAllHandler(attended)}
              checked={containsSubarray(attended)}
            />
            <label htmlFor="selectAllAttended">Select All</label>
          </li>
          {categoryData?.attendedCategories?.map((attendedCategory: any) => {
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
              onChange={() => selectAllHandler(nonAttended)}
              checked={containsSubarray(nonAttended)}
            />
            <label htmlFor="selectAllNonAttended">Select All</label>
          </li>
          {categoryData?.nonAttendedCategories?.map(
            (nonAttendedCategory: any) => {
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
            }
          )}
        </ul>
      </div>

      <div>
        <div className={styles.heading}>Unscheduled</div>
        <ul className={styles.list}>
          <li key="selectAllUnscheduled">
            <CheckboxInput
              id="selectAllUnscheduled"
              onChange={() => selectAllHandler(unscheduled)}
              checked={containsSubarray(unscheduled)}
            />
            <label htmlFor="selectAllUnscheduled">Select All</label>
          </li>
          {categoryData?.unscheduledCategories?.map(
            (unscheduledCategory: any) => {
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
            }
          )}
        </ul>
      </div>
    </div>
  );
};

export default CategoryDropdown;
