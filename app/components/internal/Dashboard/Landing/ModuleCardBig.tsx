import { Button } from '@/components/ui/button'
import React from 'react'
import { MoveRight } from 'lucide-react'
import Image, { StaticImageData } from 'next/image'
import { useFilterContext } from '@/context/filterContext';
import { useRouter } from 'next/navigation'
// import styles from './style.module.css'

interface Props {
  imgWidth: number
  imgHeight: number
  heading: string;
  subHeading: string;
  button: string;
  image: StaticImageData;
  top: number;
}

const ModuleCardBig = ({ imgHeight, imgWidth, heading, subHeading, image, button, top }: Props) => {

  const router = useRouter()
  const { getLocalFilterValue, localFilters } = useFilterContext();
  const handleRouting = () => {
    router.push("/widget/dashboard")
  }

  const searchHandler = () => {
    const params = new URLSearchParams();
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value && key !== "skip") {
        params.set(key, value);
      }
    });
    console.log('params', params);
    router.push(`/internal/search/events?${params.toString()}`, { scroll: false });
  };
  return (
    <div className="flex flex-row items-start justify-start h-[200px] w-[500px] bg-[var(--primary-foreground)] rounded-md shadow-md overflow-hidden p-5">
      <div className={`flex flex-col items-start justify-center min-h-[130px] max-h-[130px] w-[250px]`}>
        <div className="text-[var(--primary-color)] font-semibold text-sm">
          {heading}
        </div>
        <div className="text-[var(--bold-border-color)] text-xs mt-3 text-center max-[1010px]:text-left">
          {subHeading}
        </div>
        {button === "Coming Soon" ?
          <button className='cursor-not-allowed text-white text-sm rounded-lg bg-gradient-to-r from-[#8C67E2] via-[#946DF0] via-[#E87D83] via-[#F2AB7F] to-[#FFC899] px-4 py-2 mt-5'>{button}</button> :
          <Button onClick={button === "Research" ? searchHandler : handleRouting} className="mt-5 btn-default flex items-center z-20">{button}<MoveRight width={12} /></Button>}
      </div>
      <div className={button === "Research" ? "ml-10" : ""}>
        <Image
          className={`min-w-[${imgWidth}px] min-h-[${imgHeight}px] mt-[${top}px] max-[1010px]:mt-[30px]`}
          src={image}
          alt="research"
          width={imgWidth+20}
          height={imgHeight+20}
          unoptimized
        />
      </div>
    </div>
  );
}

export default ModuleCardBig