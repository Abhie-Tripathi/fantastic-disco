import React from "react";
import styles from "./category.style.module.css";
import { categories } from "@/public/data/categories";
import useClickOutside from "../../../../hooks/useClickOutside";
import CheckboxInput from "@/app/components/UI/CheckBoxInput";

interface CategoryDropdownProps {
  className?: string
  dropdownRef: React.MutableRefObject<null>;
  state: string[];
  setState: ([]) => void;
  onClose: () => void;
}

const CategoryDropdown = ({
  className,
  dropdownRef,
  state,
  setState,
  onClose,
}: CategoryDropdownProps) => {
  useClickOutside(dropdownRef, () => onClose());

  const onClickHandler = (value: string) => {
    console.log(value);
    state.includes(value)
      ? setState(state.filter((data) => data !== value))
      : setState([...state, value]);
  };

  return (
    <div className={`${styles.options} ${className}`}>
      <div>
        <div className={styles.heading}>Attended</div>
        <div className={styles.list}>
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
        <div className={styles.heading}>UNSCHEDULED</div>
        <ul className={styles.list}>
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

      <div className={styles.done_button} onClick={() => onClose()}>
        Done
      </div>
    </div>
  );
};

export default CategoryDropdown;