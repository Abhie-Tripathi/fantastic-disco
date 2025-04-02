import {EllipsisVertical} from "lucide-react";
import { useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
export default function BulkImport({bulkActions, setShowCheckBox}){
    const [open, setOpen] = useState(false);
    const actionTaken=()=>{
        setShowCheckBox(true)
        setOpen(false);
    }
    return(
        // <div className="flex items-center justify-center bg-background hover:bg-accent cursor-pointer border border-input rounded-md">
        //   <EllipsisVertical />
        // </div>
        <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
           <div className="flex items-center justify-center bg-background hover:bg-accent cursor-pointer border border-input rounded-md">
           <EllipsisVertical />
           </div>
      </PopoverTrigger>
      <PopoverContent className="w-[150px] p-2" align="end">
        <div>
            {
                bulkActions.map((item, index)=>(
                    <div key={index} className="whitespace-nowrap text-sm font-medium hover:bg-accent cursor-pointer p-2" onClick={()=>actionTaken()}>
                        {item}
                    </div>
                ))
            }
        </div>
      </PopoverContent>
    </Popover>
    )
}