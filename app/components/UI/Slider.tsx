import React from "react";
import {
  Slider,
  Label,
  SliderOutput,
  SliderTrack,
  SliderThumb,
} from "react-aria-components";
import styles from "./Slider.module.css";

interface RangeSliderProps {
  state: number;
  setState: (value: number) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ state, setState }) => {
  const marks = [0, 50, 100];

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

              {marks.map((mark) => (
                <div
                  key={mark}
                  className={styles.mark}
                  style={{
                    left: `${(mark / 100) * 100}%`,
                  }}
                >
                  <span className={styles.markLabel}>{mark}</span>
                </div>
              ))}
            </>
          )}
        </SliderTrack>
      </Slider>
    </div>
  );
};

export default RangeSlider;
