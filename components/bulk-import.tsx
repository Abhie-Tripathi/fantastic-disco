import {EllipsisVertical} from "lucide-react";
import { useState, Dispatch, SetStateAction } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
  interface BulkImportProps {
  bulkActions: string[];
  setShowCheckBox: Dispatch<SetStateAction<boolean>>;
  setShowExport: Dispatch<SetStateAction<boolean>>;
}
export default function BulkImport({ bulkActions, setShowCheckBox, setShowExport }: BulkImportProps){
    const [open, setOpen] = useState(false);
    const actionTaken=(index:number)=>{
        if(index==0){
        setShowCheckBox(true)
        }else{
            setShowExport(true);
        }
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
                    <div key={index} className="whitespace-nowrap text-sm font-medium hover:bg-accent cursor-pointer p-2" onClick={()=>actionTaken(index)}>
                        {item}
                    </div>
                ))
            }
        </div>
      </PopoverContent>
    </Popover>
    )
}