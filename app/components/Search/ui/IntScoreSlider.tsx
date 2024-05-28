import React from "react";
import { Slider, SliderTrack, SliderThumb } from "react-aria-components";
import styles from "@/app/components/UI/Slider.module.css";

interface RangeSliderProps {
  state: number;
  setState: (value: number) => void;
}

const IntScoreSlider: React.FC<RangeSliderProps> = ({ state, setState }) => {
  const breakpoints = [
    { 0: "Local" },
    { 33: "National" },
    { 66: "Regional" },
    { 100: "International" },
  ];

  return (
    <div className={styles.container}>
      <Slider
        defaultValue={state}
        onChange={setState}
        className={styles.slider}
      >
        <SliderTrack className={styles.sliderTrack}>
          {({ state }) => (
            <>
              <div className={styles.track} />
              <div
                className={styles.fill}
                style={{ width: state.getThumbPercent(0) * 100 + "%" }}
              />
              <SliderThumb className={styles.thumb} />
              {breakpoints.map((mark:any, index) => {
                const key = Object.keys(mark)[0];
                const value = mark[key];

                return (
                  <div
                    key={index}
                    className={styles.mark}
                    style={{
                      left: `${key}%`,
                    }}
                  >
                    <span className={styles.markLabel}>{value}</span>
                  </div>
                );
              })}
            </>
          )}
        </SliderTrack>
      </Slider>
    </div>
  );
};

export default IntScoreSlider;
