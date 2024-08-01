import React from "react";
import {
  Slider,
  Label,
  SliderOutput,
  SliderTrack,
  SliderThumb,
} from "react-aria-components";
import styles from "./Slider.module.css";
import { useTheme } from "@/context";

interface RangeSliderProps {
  state: number;
  setState: (value: number) => void;
  sliderType?: string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ state, setState, sliderType }) => {
  const marks = [0, 50, 100];
  const {theme} = useTheme()

  return (
    <div className={styles.container} style={{background: theme==="light"?"white":""}}>
      <Slider
        defaultValue={state}
        onChange={setState}
        className={styles.slider}
      >
        <SliderTrack className={styles.sliderTrack}>
          {({ state }) => (
            <>
              <div className={styles.track} />
              {
                (sliderType == 'reverse') ?
                  <div
                    className={`${styles.fill} ${sliderType == 'reverse' ? styles.fillReverse:''}`}
                    style={{ width: 100 - state.getThumbPercent(0) * 100 + "%" }}
                  /> : 
                  <div
                    className={styles.fill}
                    style={{ width: state.getThumbPercent(0) * 100 + "%" }}
                  />
              }
              <SliderThumb className={styles.thumb} />

              {marks.map((mark, index) => (
                <div
                  key={index}
                  className={styles.mark}
                  style={{
                    left: `${(mark / 100) * 100}%`,
                  }}
                >
                  <span className={styles.markLabel}>{mark}</span>
                </div>
              ))}

              {/* {breakpoints && breakpoints.map((mark, index) => {
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
              })} */}
            </>
          )}
        </SliderTrack>
      </Slider>
    </div>
  );
};

export default RangeSlider;
