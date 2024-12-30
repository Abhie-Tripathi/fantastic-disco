import React, { useState } from 'react'
import styles from './style.module.css'
import { StaticImageData } from 'next/image'
import TrackerTemplateCard from './TrackerTemplateCard'
import { ChevronLeftSmall, ChevronRightSmall } from 'geist-icons'

interface Props {
    templates: {
        type: string,
        domain: string,
        img: StaticImageData,
        url: string,
        trackerName: string,
        content: string
    }[]
}
const Carousel = ({ templates }: Props) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex < templates.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    };
    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    };
    return (
        <div className="flex flex-col items-center justify-center relative w-full h-full z-[1] gap-2.5">
            <button
                className={`absolute cursor-pointer top-1/2 -translate-y-1/2 left-1 border-none z-[999] h-[28px] 
                    w-[28px] flex items-center justify-center bg-white rounded-full shadow-md ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                onClick={handlePrev}
                disabled={currentIndex === 0}
            >
                <div className="">
                    <ChevronLeftSmall />
                </div>
            </button>
            <div className="flex justify-center items-center overflow-hidden w-full h-full relative">
                {templates.map((template, index) => {
                    const isActive = currentIndex === index;
                    const isLeft = currentIndex - 1 === index;
                    const isRight = currentIndex + 1 === index;
                    return (
                        <div
                            key={index}
                            className={`
                                absolute opacity-0 transition-opacity-0 transition-transform duration-500 ease-in-out
                                ${isActive ? 'filter drop-shadow-lg  z-[2] opacity-100' : ''}
                                ${isLeft ? 'transform -translate-x-[40%] scale-75 z-[1] opacity-60' : ''}
                                ${isRight ? 'transform translate-x-[40%] scale-75 z-[1] opacity-60' : ''}
                            `}
                        >
                            <div className="cursor-pointer">
                                <TrackerTemplateCard type={template.type}
                                    domain={template.domain}
                                    img={template.img}
                                    url={template.url}
                                    trackerName={template.trackerName}
                                    content={template.content} />
                            </div>
                        </div>
                    );
                })}
            </div>
            <button
                className={`absolute cursor-pointer top-1/2 -translate-y-1/2 right-1 border-none z-[999] h-[28px] 
                    w-[28px] flex items-center justify-center bg-white rounded-full shadow-md ${currentIndex === templates.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                onClick={handleNext}
                disabled={currentIndex === templates.length - 1}
            >
                <div className="">
                    <ChevronRightSmall />
                </div>
            </button>
        </div>
    )
}

export default Carousel

function ArrowIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 20V4M12 4L18 10M12 4L6 10" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    )
}