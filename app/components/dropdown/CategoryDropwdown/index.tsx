import React, { useEffect, useState } from "react";
import styles from "./categoryDropdown.module.css";
import CheckboxInput from "../../UI/CheckBoxInput";
import { useTheme } from "@/context";
import { usePathname } from "next/navigation";

interface CategoryDropdownProps {
  className?: string;
  dropdownRef?: React.MutableRefObject<null>;
  state: string[];
  setState: (ids: string[]) => void;
  categorySlug?: string[];
  setCategorySlug?: (slugs: string[]) => void;
  onClose?: () => void;
  categoryData?: any;
}


const CategoryDropdown = ({
  state,
  setState,
  categorySlug,
  setCategorySlug,
  categoryData,
}: CategoryDropdownProps) => {
  const { theme } = useTheme()
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const getPath=usePathname().split('/');
  const last=getPath[getPath.length-1];
  const onClickHandler = (id: string, slug: string) => {
    if (state.includes(id)) {
      setState(state.filter((data) => data !== id));
      setSelectedSlugs(selectedSlugs.filter((data) => data !== slug));
    } else {
      setState([...state, id]);
      setSelectedSlugs([...selectedSlugs, slug]);
    }
  };

  function containsSubarray(childArray: string[]) {
    if (childArray.length === 0) return true;
    if (childArray.length > state.length) return false;

    return state.some((_, index) => {
      if (index + childArray.length > state.length) return false;
      return childArray.every(
        (value, childIndex) => state[index + childIndex] === value
      );
    });
  }

  const attended = categoryData?.attendedCategories!.map(
    (category: any) => category.slug
  );
  const nonAttended = categoryData?.nonAttendedCategories!.map(
    (category: any) => category.slug
  );

  const unscheduled = categoryData?.unscheduledCategories!.map(
    (category: any) => category.slug
  );

  const selectAllHandler = (categories: any[]) => {
    const categoryIds = categories.map((category) => category.id);
    const categorySlugs = categories.map((category) => category.slug);

    if (containsSubarray(categoryIds)) {
      setState(state.filter((id) => !categoryIds.includes(id)));
      setSelectedSlugs(
        selectedSlugs.filter((slug) => !categorySlugs.includes(slug))
      );
    } else {
      setState([...state, ...categoryIds]);
      setSelectedSlugs([...selectedSlugs, ...categorySlugs]);
    }
  };

  useEffect(() => {
    setCategorySlug && setCategorySlug(selectedSlugs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSlugs]);

  return (
    <div className={styles.container} style={{background: theme==="light"?"white":""}}>
      <div>
        <div className={styles.heading}>Attended</div>
        <div className={styles.list}>
          <li key="selectAllAttended">
            <CheckboxInput
              id="selectAllAttended"
              onChange={() => selectAllHandler(categoryData.attendedCategories)}
              checked={containsSubarray(attended)}
            />
            <label htmlFor="selectAllAttended">Select All</label>
          </li>
          {categoryData?.attendedCategories?.map((attendedCategory: any) => {
            return (
              <li key={attendedCategory.id}>
                <CheckboxInput
                  id={attendedCategory.id}
                  onChange={() =>
                    onClickHandler(attendedCategory.id, attendedCategory.slug)
                  }
                  checked={state.includes(attendedCategory.id)}
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
              onChange={() =>
                selectAllHandler(categoryData.nonAttendedCategories)
              }
              checked={containsSubarray(nonAttended)}
            />
            <label htmlFor="selectAllNonAttended">Select All</label>
          </li>
          {categoryData?.nonAttendedCategories?.map(
            (nonAttendedCategory: any) => {
              return (
                <li key={nonAttendedCategory.id}>
                  <CheckboxInput
                    id={nonAttendedCategory.id}
                    onChange={() =>
                      onClickHandler(
                        nonAttendedCategory.id,
                        nonAttendedCategory.slug
                      )
                    }
                    checked={state.includes(nonAttendedCategory.id)}
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
              onChange={() =>
                selectAllHandler(categoryData.unscheduledCategories)
              }
              checked={containsSubarray(unscheduled)}
            />
            <label htmlFor="selectAllUnscheduled">Select All</label>
          </li>
          {categoryData?.unscheduledCategories?.map(
            (unscheduledCategory: any) => {
              return (
                <li key={unscheduledCategory.id}>
                  <CheckboxInput
                    id={unscheduledCategory.id}
                    onChange={() =>
                      onClickHandler(
                        unscheduledCategory.id,
                        unscheduledCategory.slug
                      )
                    }
                    checked={state.includes(unscheduledCategory.id)}
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
