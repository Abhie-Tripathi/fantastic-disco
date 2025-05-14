import { Button } from "@/components/ui/button";
import { Bell, NotebookPen, Settings } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";
interface TrackerDraftCardProps {
    data:string;
    heading:string;
    imgUrl:string;
    view?:string;
    type:string;
    entries?:any;
}
const TrackerDraftCard = ({data, heading, imgUrl, view, type, entries}:TrackerDraftCardProps) => {   
   if(!data) return null;
   
   console.log("entries", entries);
   
    return(
        <div className="flex gap-5 p-3 rounded-lg shadow-[1.5px_3px_9px_0px_#EDEBEB66] border border-[var(--border-color)] justify-between bg-background">
            <div className="flex gap-5 w-[100%]">
            <div className="rounded-[8px] bg-white shadow-[0px_3.38px_10.13px_0px_#0000001F] h-fit p-3 items-baseline flex">
            <Image src={imgUrl} alt="draftTracker" width={30} height={25} />
            </div>
            <div className="flex flex-col gap-3 w-[100%]">
                <div className="font-semibold text-base">{heading}</div>
                {/* <div className="badge_info w-fit border border-[var(--info-text-color))] px-1.5 py-0" style={{fontSize:"10px"}}>{type}</div> */}
                {view!="minView" &&
                <div className="text-[var(--secondary-text-color)] text-sm px-2">
                    {" "}{entries.slice(0,2).join(",")} 
                    <Link href={`/internal/trackers/create?type=${type}`}>
                    <span className="pl-1 text-[var(--primary-color)] hover:text-[var(--primary-color)] hover:underline">+{entries.length>2 && entries.length-2}</span>
                    </Link>
                </div>
                }
                <div className="flex gap-2 justify-between">
                    {/* <div> */}
                <div className="flex items-center gap-3 justify-between w-[100%]">
                {/* <NotebookPen width={16} height={16} color="var(--secondary-text-color)"/>
                <Bell width={16} height={16} color="var(--secondary-text-color)"/>
                <Settings width={16} height={16}/> */}
                <div className="badge_info w-fit border border-[var(--info-text-color))] px-1.5 py-0" style={{fontSize:"10px"}}>{data}</div>
               
                </div>
                    {/* </div> */}
                    <Link href={`/internal/trackers/create?type=${type}`}>
                    <Button className="h-7">Save</Button>
                    </Link>
                </div>
            </div>
            </div>
            {/* <div>
            <div className="bg-[var(--accent-color)] text-[12px] px-[14px] py-1 rounded-[13px]">
                Draft
            </div>
            </div> */}
        </div>
    )
}
export default TrackerDraftCard;    