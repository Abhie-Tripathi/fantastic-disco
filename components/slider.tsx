import { useState, useEffect } from "react";
interface SliderProps{
    width:number;
    color:string;
    source?:string;
}
export default function Slider({ width, color, source}: SliderProps) {
  const [temp, setTemp] = useState(0);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
        setTemp(width);
      }, 1000);
    return () => clearTimeout(timeout);
  }, [width]);
  const calculateTranslation = (value: number) => {
    const maxValue = source==="template"?30:100; 
    const percentage = Math.min((value / maxValue) * 100, 100);
    return percentage - 100; 
  };

  return (
    <div className="h-3 rounded-[3px] bg-[#E6E6E6] overflow-hidden w-full relative">
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