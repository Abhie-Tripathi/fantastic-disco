interface Prop {
  fillColor: string;
  borderColor: string;
}
export default function StatusEnd({ fillColor, borderColor }: Prop) {
  return (
    <svg
      width="100%"
      height="30"
      viewBox="0 0 172 28"
      fill={fillColor}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.92578 0.636719H166.257C168.945 0.636834 171.124 2.81656 171.124 5.50488V22.1475C171.124 24.8358 168.945 27.0155 166.257 27.0156H1.78613C1.13893 27.0153 0.781966 26.2638 1.19043 25.7617L10.7471 14.0215C11.1449 13.5327 11.1286 12.8268 10.708 12.3574L1.35254 1.91895C0.908982 1.42397 1.26113 0.636719 1.92578 0.636719Z"
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
