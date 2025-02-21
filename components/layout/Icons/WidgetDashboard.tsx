import React from 'react'


interface Props{
  color : string;
}

const WidgetDashboard = () => {
  return (
    <svg className="flex-shrink-0" width="20" height="20" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.5 6.99821L6.47 1.02821C6.53959 0.958585 6.62221 0.903354 6.71315 0.865672C6.80409 0.827989 6.90156 0.808594 7 0.808594C7.09844 0.808594 7.19591 0.827989 7.28685 0.865672C7.37779 0.903354 7.46041 0.958585 7.53 1.02821L13.5 6.99821M2 5.49821V12.2482C2 12.6622 2.336 12.9982 2.75 12.9982H5.5V9.74821C5.5 9.33421 5.836 8.99821 6.25 8.99821H7.75C8.164 8.99821 8.5 9.33421 8.5 9.74821V12.9982H11.25C11.664 12.9982 12 12.6622 12 12.2482V5.49821M4.5 12.9982H10" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    
  )
}

export default WidgetDashboard