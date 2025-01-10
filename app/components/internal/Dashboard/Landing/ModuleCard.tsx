import { Button } from '@/components/ui/button'
import React from 'react'
import { MoveRight } from 'lucide-react'
import Image, { StaticImageData } from 'next/image'
import { useRouter } from 'next/navigation'
// import styles from './style.module.css'
import { useFilterContext } from '@/context/filterContext';

interface Props {
  imgWidth: number
  imgHeight: number
  heading: string;
  subHeading: string;
  button: string;
  image: StaticImageData;
  top: number;
}

const ModuleCard = ({ imgHeight, imgWidth, heading, subHeading, image, button, top }: Props) => {

  const router = useRouter()
      const {  getLocalFilterValue, localFilters } = useFilterContext();

  const handleRouting = () => {
    if (button === "Promote") {
      router.push("/widget/dashboard")
    } else router.push("/internal/search/events")
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
    <div className="flex flex-col items-center justify-start h-[267px] w-[289px] bg-[var(--primary-foreground)] rounded-md shadow-md overflow-hidden p-3">
      <div className={`flex flex-col items-center justify-center min-h-[130px] max-h-[130px] w-[250px]`}>
        <div className="text-[var(--primary-color)] font-semibold text-sm">
          {heading}
        </div>
        <div className="text-[var(--bold-border-color)] text-xs mt-3 text-center">
          {subHeading}
        </div>
        {button === "Coming Soon" ?
          <button className='text-white text-sm rounded-lg bg-gradient-to-r from-[#8C67E2] via-[#946DF0] via-[#E87D83] via-[#F2AB7F] to-[#FFC899] px-4 py-2 mt-5 cursor-not-allowed'>{button}</button> :
          <Button onClick={button === "Research" ? searchHandler : handleRouting} className="mt-5 btn-default flex items-center z-20">{button}<MoveRight width={12} /></Button>}
      </div>
      <Image
        className={`min-w-[${imgWidth}px] min-h-[${imgHeight}px]`}
        src={image}
        alt="research"
        width={imgWidth}
        height={imgHeight}
        unoptimized
        style={{ marginTop: `${top}px` }}
      />
    </div>
  );
}

export default ModuleCard