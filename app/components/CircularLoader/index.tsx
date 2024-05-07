// import React from 'react';
// import './circularLoader.module.css'; // Import CSS file for styling

// const CircularLoader = ({ numerator, denominator }:any) => {
//   // Calculate the percentage of completion
//   const percentage = (numerator / denominator) * 100;

//   return (
//     <div className="circular-loader">
//       <svg className="progress-ring" width="100" height="100">
//         <circle
//           className="progress-ring__circle"
//           stroke="#A48BE6"
//           strokeWidth="8"
//           fill="transparent"
//           r="52"
//           cx="60"
//           cy="60"
//         />
//         <text x="40%" y="40%" textAnchor="middle" fill="#A48BE6" dy=".3em">
//           {`${numerator}/${denominator}`}
//         </text>
//       </svg>
//       <style jsx>{`
//         .circular-loader {
//           position: relative;
//           width: 100px;
//           height: 100px;
//         }

//         .progress-ring {
//           transform: rotate(-90deg);
//         }

//         .progress-ring__circle {
//           stroke-dasharray: 326;
//           stroke-dashoffset: calc(326 - (${percentage} / 100) * 326);
//           transition: stroke-dashoffset 0.3s;
//         }

//         text {
//           font-size: 20px;
//           font-weight: bold;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default CircularLoader;

import React from "react";
import "./circularLoader.module.css"; // Import CSS file for styling

const CircularLoader = ({ numerator, denominator }: any) => {
  // Calculate the percentage of completion
  const percentage = (numerator / denominator) * 100;

  return (
    <div className="circular-loader">
      <svg className="progress-ring" width="80" height="80">
        <circle
          className="progress-ring__circle"
          stroke="#B8B7EA"
          strokeWidth="6"
          fill="transparent"
          r="32"
          cx="40"
          cy="40"
        />
        <text x="50%" y="50%" textAnchor="middle" fill="#A48BE6" dy=".3em">
          {`${numerator}/${denominator}`}
        </text>
      </svg>
      <style jsx>{`
        .circular-loader {
          position: relative;
          width: 80px;
          height: 80px;
        }

        .progress-ring {
          transform: rotate(-90deg);
        }

        .progress-ring__circle {
          stroke-dasharray: 201;
          stroke-dashoffset: calc(201 - (${percentage} / 100) * 201);
          transition: stroke-dashoffset 0.3s;
        }

        text {
          font-size: 14px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default CircularLoader;
