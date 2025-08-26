{/* <svg width="196" height="28" viewBox="0 0 196 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.4248 0.636719H187.383L195.114 12.8682C195.484 13.4533 195.484 14.1991 195.114 14.7842L187.383 27.0146L1.28613 27.0156C0.638462 27.0156 0.280358 26.2629 0.689453 25.7607L10.2549 14.0215C10.653 13.5326 10.6359 12.8268 10.2148 12.3574L0.852539 1.91895C0.408639 1.42404 0.759994 0.636719 1.4248 0.636719Z" fill="white" stroke="#C9C9C9" stroke-width="0.512397"/>
</svg> */}

interface Prop {
  fillColor: string;
  borderColor: string;
}
export default function StatusMid({ fillColor, borderColor }: Prop) {
  return (
    <svg
      width="100%"
      height="30"
      viewBox="0 0 196 28"
      fill={fillColor}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.4248 0.636719H187.383L195.114 12.8682C195.484 13.4533 195.484 14.1991 195.114 14.7842L187.383 27.0146L1.28613 27.0156C0.638462 27.0156 0.280358 26.2629 0.689453 25.7607L10.2549 14.0215C10.653 13.5326 10.6359 12.8268 10.2148 12.3574L0.852539 1.91895C0.408639 1.42404 0.759994 0.636719 1.4248 0.636719Z"
        fill={fillColor}
        stroke={borderColor}
        stroke-width="1px"
      />
      <defs>
        <linearGradient
          id="paint0_linear_254_3527"
          x1="-11.3058"
          y1="25.4966"
          x2="368.331"
          y2="25.4966"
          gradientUnits="userSpaceOnUse"
        ></linearGradient>
      </defs>
    </svg>
  );
}
