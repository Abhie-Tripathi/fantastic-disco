import { StaticImageData } from 'next/image'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Template from "/public/template.svg";

interface Props {
    type: string,
    domain: string,
    img: StaticImageData,
    url: string,
    trackerName: string,
    content: string
}

const TrackerTemplateCard = ({ trackerName, type, domain, img, url, content }: Props) => {
    return (
        <Link href={`/internal/trackers/create?type=${url}`}>
            <div className="w-[272px] p-2 gap-2 flex items-center flex-col h-fit text-sm border border-[var(--border-color)] rounded-[5px] bg-[var(--primary-foreground)]">
                <div className="w-full flex items-center h-[40%] rounded-md bg-[var(--tabs-background-color)]">
                    <div
                    // className={styles.account}
                    >
                        <Image src={img} alt="people" width={31} height={31} />
                    </div>
                    <div> <Image src={Template} alt="template" /> </div>
                </div>
                <div className="w-full h-[60%] flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <div className="bg-[var(--tabs-background-color)] text-[10px] p-1 rounded-sm text-[var(--primary-color)]">
                            {domain}
                        </div>
                    </div>
                    <div className="text-xs font-bold text-[var(--primary-color)]">
                        {trackerName}
                    </div>
                    <div className="font-medium text-[var(--tertiary-text-color)] text-[10px] leading-[14px]">
                        {content}
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default TrackerTemplateCard