import { Bell, NotebookPen, Settings } from "lucide-react";

const TrackerDraftCard = ({data, type, heading}:any) => {    
    return(
        <div className="flex gap-5 p-3 rounded-lg shadow-[1.5px_3px_9px_0px_#EDEBEB66] border border-[var(--border-color)] justify-between">
            <div className="flex gap-5">
            <div>abc</div>
            <div className="flex flex-col gap-3">
                <div className="font-semibold text-base">{heading}</div>
                <div className="badge_info w-fit border border-[var(--info-text-color))] px-1.5 py-0" style={{fontSize:"10px"}}>{type}</div>
                <div className="flex items-center gap-3">
                <NotebookPen width={16} height={16}/>
                <Bell width={16} height={16}/>
                <Settings width={16} height={16}/>
                </div>
            </div>
            <div>
            </div>
            </div>
            <div>
            <div className="bg-[var(--accent-color)] text-[12px] px-[14px] py-1 rounded-[13px]">
                Draft
            </div>
            </div>
        </div>
    )
}
export default TrackerDraftCard;    