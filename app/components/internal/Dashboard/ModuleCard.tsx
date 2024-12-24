import { Button } from '@/components/ui/button'
import React from 'react'
import styles from './modulecard.style.module.css'
import { MoveRight } from 'lucide-react'
import ResearchModule from '/public/internal/dashboard/ResearchModule.png'
import Image, { StaticImageData } from 'next/image'

interface Props {
  imgWidth: number
  imgHeight: number
  heading: string;
  subHeading: string;
  button: string;
  image: StaticImageData;
  bottom: number;
}

const ModuleCard = ({ imgHeight, imgWidth, heading, subHeading, image, button, bottom }: Props) => {
  return (
    <div className="flex flex-col items-center justify-start h-[267px] w-[289px] bg-primary-foreground rounded-md shadow-md overflow-hidden p-3">
      <div className="flex flex-col items-center justify-center min-h-[130px] max-h-[130px] w-[250px]">
        <div className="text-[var(--primary-color)] font-semibold text-sm">
          {heading}
        </div>
        <div className="text-[var(--bold-border-color)] text-xs mt-3 text-center">
          {subHeading}
        </div>
        <Button className="mt-5 btn-default flex items-center">
          {button}
          <MoveRight width={12} />
        </Button>
      </div>
      <Image
        className={`${styles.img} min-w-[${imgWidth}px] min-h-[${imgHeight}px]`}
        src={image}
        alt="research"
        width={imgWidth}
        height={imgHeight}
        unoptimized
        style={{ bottom: bottom }}
      />
    </div>
  );
}

export default ModuleCard