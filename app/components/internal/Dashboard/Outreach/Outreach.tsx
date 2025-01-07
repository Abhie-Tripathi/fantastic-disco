import React from 'react'
import OutreachImage from '/public/internal/dashboard/Outreach.png'
import OutreachImageDark from '/public/internal/dashboard/OutreachDark.png'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { MoveRight } from 'lucide-react'
import PhaseCard from './PhaseCard'
import RecentChat from './RecentChat'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'geist-icons'

interface OutreachLastChat {
  eventName: string;
  status: string;
  comment: string;
  eventId: string;
  enquiryId: string;
}
interface Props {
  theme: string | null
  outreachData : { name: string, value: number }[]
  outreachChat : OutreachLastChat | undefined
}
const Outreach = ({ theme, outreachData, outreachChat }: Props) => {

  // const events = [
  //   // { name: "Shortlisted", value: 0, color: "#f8712b" },
  //   // { name: "In Progress", value: 0, color: "#166aeb" },
  //   // { name: "Confirmed", value: 1, color: "#f9bf44" },
  //   // { name: "Confirmed", value: 1, color: "#f9bf44" },
  //   // { name: "Confirmed", value: 1, color: "#f9bf44" },
  // ]
  const colors = ["#f8712b", "#166aeb", "#f9bf44","#52c41a", "#dd46eb" ]
  const router = useRouter()
  console.log("outreach chat:", outreachChat)
  const handleRouting = (type: string) => {
    if (type === 'button') {
      router.push("/internal/outreach")
    } else {
      if (outreachData.length > 0) {
        router.push("/internal/outreach")
      }
    }
  }

  return (
    <div className={`${outreachData.length === 0 && "bg-[var(--background-secondary-color)]"} border border-[var(--border-color)] w-full overflow-hidden relative rounded-xl flex h-[273px]`}>
      <div className={`flex flex-col ${outreachData.length > 0 ? "gap-2" : "gap-8"} w-[50%] p-4`}>
        <div className='flex items-center gap-1 text-[var(--primary-color)] font-semibold'>
          <OutreachIcon />
          <div className={`flex items-center gap-2 ${outreachData.length > 0 && "cursor-pointer"}`} onClick={() => handleRouting("heading")}>
            <span className='text-xs text-[var(--primary-color)] font-[var(--font-weight-semibold)]'>Outreach</span>
            {outreachData.length > 0 && <div><ArrowRight color='#6750a4' width='12px' height='12px' /></div>}
          </div>
        </div>
        <div className='text-xs text-[var(--bold-border-color)]'>
          {outreachData.length > 0 ? "Track your event outreach status from a dashboard built for events." : "Reach out to right event POCs and move your plans forward. Monitor your progress and stay organized through every phase of the process."}
        </div>
        {outreachData.length === 0 ? <Button onClick={() => handleRouting("button")} className="mt-4 w-[110px]" size="xs">Start Outreach <MoveRight width={12} /></Button> :
          <div
            className={`mt-3 ${outreachData.length === 3
                ? "flex flex-col gap-2"
                : "grid grid-cols-2 gap-4"
              }`}
          >
            {outreachData.map((event, key) => (
              <div key={key}><PhaseCard color={colors[key]} heading={event.name} value={event.value} /></div>
            ))}
          </div>
        }

      </div>
      {(outreachData.length === 0 || outreachChat === undefined) ? <div className='relative h-full w-[50%]'>
        <Image src={theme === "dark" ? OutreachImageDark : OutreachImage} alt='outreach' className='absolute top-[40px] left-[20px]' width={303} height={272} unoptimized /></div>
        : <div className='p-4 w-[50%] h-full'><RecentChat outreachChat={outreachChat}/></div>
      }
    </div>
  )
}

export default Outreach


function OutreachIcon() {
  return (
    <svg
      className="flex-shrink-0"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.861 1.16321L16.021 1.21721L17.223 1.61721C17.686 1.77221 18.093 1.90721 18.414 2.05721C18.762 2.21921 19.081 2.42721 19.325 2.76621C19.569 3.10421 19.666 3.47321 19.71 3.85421C19.75 4.20721 19.75 4.63521 19.75 5.12421V13.3362C19.75 14.0342 19.75 14.6232 19.696 15.0892C19.64 15.5732 19.514 16.0512 19.161 16.4372C18.952 16.666 18.6981 16.8492 18.415 16.9752C17.937 17.1872 17.444 17.1552 16.967 17.0562C16.507 16.9602 15.949 16.7742 15.287 16.5532L15.244 16.5392C14.124 16.1652 13.739 16.0492 13.367 16.0622C13.2184 16.0673 13.0707 16.087 12.926 16.1212C12.563 16.2062 12.223 16.4202 11.24 17.0752L9.858 17.9972L9.718 18.0902C8.656 18.7992 7.918 19.2912 7.054 19.4072C6.191 19.5232 5.349 19.2422 4.139 18.8372L3.979 18.7842L2.777 18.3842C2.314 18.2292 1.907 18.0942 1.586 17.9442C1.238 17.7822 0.919 17.5742 0.675 17.2342C0.431 16.8962 0.334 16.5282 0.29 16.1462C0.25 15.7932 0.25 15.3662 0.25 14.8772V6.66521C0.25 5.96621 0.25 5.37721 0.304 4.91221C0.36 4.42821 0.486 3.95021 0.839 3.56421C1.04797 3.33543 1.30194 3.15227 1.585 3.02621C2.063 2.81321 2.557 2.84521 3.033 2.94521C3.493 3.04021 4.051 3.22721 4.713 3.44821L4.756 3.46221C5.876 3.83521 6.261 3.95221 6.634 3.93921C6.78225 3.9341 6.92964 3.91434 7.074 3.88021C7.437 3.79421 7.777 3.58021 8.76 2.92621L10.142 2.00421L10.282 1.91021C11.344 1.20221 12.082 0.710214 12.945 0.594214C13.809 0.478214 14.651 0.758215 15.861 1.16321ZM13.75 2.10721V14.5802C14.286 14.6382 14.85 14.8262 15.593 15.0742L15.718 15.1162C16.435 15.3552 16.91 15.5122 17.273 15.5882C17.629 15.6622 17.75 15.6282 17.805 15.6042C17.8994 15.5623 17.9842 15.5014 18.054 15.4252C18.094 15.3812 18.164 15.2762 18.206 14.9152C18.249 14.5472 18.25 14.0462 18.25 13.2912V5.16321C18.25 4.62321 18.249 4.28321 18.22 4.02521C18.192 3.78621 18.148 3.69721 18.108 3.64321C18.069 3.58921 17.999 3.51821 17.782 3.41721C17.546 3.30721 17.222 3.19921 16.712 3.02821L15.547 2.64021C14.66 2.34421 14.134 2.17721 13.75 2.10721ZM12.25 14.7602V2.43421C11.939 2.61421 11.54 2.87521 10.974 3.25221L9.592 4.17421L9.482 4.24721C8.794 4.70721 8.281 5.04921 7.75 5.24121V17.5672C8.061 17.3872 8.46 17.1252 9.026 16.7482L10.408 15.8272L10.518 15.7542C11.206 15.2942 11.719 14.9522 12.25 14.7602ZM6.25 17.8952V5.42021C5.714 5.36221 5.15 5.17421 4.407 4.92621L4.282 4.88421C3.565 4.64521 3.09 4.48821 2.726 4.41221C2.371 4.33821 2.25 4.37121 2.196 4.39521C2.10111 4.43727 2.01598 4.49856 1.946 4.57521C1.906 4.61821 1.836 4.72321 1.794 5.08421C1.751 5.45221 1.75 5.95421 1.75 6.70921V14.8372C1.75 15.3772 1.751 15.7172 1.78 15.9752C1.808 16.2142 1.852 16.3022 1.892 16.3572C1.931 16.4112 2.001 16.4822 2.218 16.5832C2.454 16.6932 2.778 16.8012 3.288 16.9722L4.453 17.3602C5.34 17.6552 5.865 17.8232 6.25 17.8942"
        fill="#6750a4"
      />
    </svg>
  );
}
