import { useState, useEffect } from "react";

export default function Slider({ width, color }) {
  const [temp, setTemp] = useState(0);
  
  useEffect(() => {
    setTimeout(() => {
      setTemp(width);
    }, 1000);
  }, [width]);
  const calculateTranslation = (value) => {
    const maxValue = 30; 
    const percentage = Math.min((value / maxValue) * 100, 100);
    return percentage - 100; 
  };

  return (
    <div className="h-5 rounded-[6px] bg-[#E6E6E6] overflow-hidden w-full relative">
      <div
        style={{ 
          transform: `translateX(${calculateTranslation(temp)}%)`,
          background: color,
        }}
        className="absolute top-0 left-0 h-full w-full transition-all duration-300 ease-in"
      />
    </div>
  );
}