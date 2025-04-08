import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { CheckCircle, CheckCircleFill, CrossCircleFill } from "geist-icons";
import ColSelector from "./ColSelector";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { CircleAlert } from "lucide-react";

interface Props {
  csvData: any;
  setShowEventList: any;
  mappedHeaders: any;
  setMappedHeaders: any;
}

const dafaultHeaders = ["Name", "Start Date", "End Date", "Location", "Participation", "Type"];

const suggestions = {
  "Name": ["name", "event name", "eventname"],
  "Start Date": ["start date", "start", "startdate"],
};

const ColMapping = ({ csvData, setShowEventList, mappedHeaders, setMappedHeaders }: Props) => {
  const colHeader = csvData[0] ? Object.keys(csvData[0]) : [];

  const changeSelectedHeader = (defaultHeader: string, updatedValue: string) => {

    const updatedItems = mappedHeaders.map((item: any) => 
      item.defaultName === defaultHeader
        ? { ...item, fieldName: updatedValue }
        : item
    );
    setMappedHeaders(updatedItems);
  };
  

  return (
    <>
    <div className="flex gap-3 mb-4" >
      <span className="text-base font-semibold" >{colHeader.length} columns detected:</span>
      <span className="text-sm flex w-fit rounded-full px-2 gap-2 items-center bg-[var(--success-background-color)] text-[var(--success-text-color)] font-medium" ><CheckCircle height="14px" color="var(--secondary-text-color)" /> 4 recognized</span>
      <span className="text-sm flex w-fit rounded-full px-2 gap-1 items-center bg-[var(--warning-background-color)] text-[var(--warning-text-color)] font-medium" ><CircleAlert height="14px" color="var(--secondary-text-color)" /> 2 need mapping</span>
    </div>
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-muted/50">
            {mappedHeaders.map((header: any, index: number) => (
              <TableHead
                key={index}
                className="p-4 px-6 max-w-[280px] shadow-[10px_0_15px_-5px_rgba(0,0,0,0.3)] h-10 after:absolute after:inset-0 border"
                style={{ zIndex: 0 }}
              >
                <div className="flex gap-3 items-center text-lg font-semibold text-md text-foreground relative z-[999] mb-3">
                  {/* <span className="line-clamp-1">{header}</span> */}
                  {header.defaultName}
                  <span>
                    {header.isMatch ?
                      <CheckCircleFill color="#00dc8b" /> :
                        <CrossCircleFill color="var(--danger-text-color)" />
                    }
                  </span>
                </div>
                <div className="font-medium text-md text-foreground relative z-[999]">
                  <ColSelector options={colHeader} selectedHeader={header} changeSelectedHeader={changeSelectedHeader} />
                </div>
              </TableHead>
            ))}

            {/* <TableHead
              className="p-4 px-6 max-w-[280px] shadow-[10px_0_15px_-5px_rgba(0,0,0,0.3)] h-10 after:absolute after:inset-0 border"
              style={{ zIndex: 0 }}
            >
              <div className="flex gap-3 items-center text-lg font-semibold text-md text-foreground relative z-[999] mb-3">
                Name
                <span>
                  <CheckCircleFill color="#00dc8b" />
                </span>
              </div>
              <div className="font-medium text-md text-foreground relative z-[999]">
                <ColSelector options={colHeader} />
              </div>
            </TableHead> */}

            {/* <TableHead
              className="p-4 px-6 sticky left-0 max-w-[280px] shadow-[10px_0_15px_-5px_rgba(0,0,0,0.3)] h-10 after:absolute after:inset-0 border"
              style={{ zIndex: 0 }}
            >
              <div className="flex gap-3 items-center text-lg font-semibold text-md text-foreground relative z-[999] mb-3">
                Location
                <span>
                  <CheckCircleFill color="#00dc8b" />
                </span>
              </div>
              <div className="font-medium text-md text-foreground relative z-[999]">
                <UpvoteSelector />
              </div>
            </TableHead>

            <TableHead
              className="p-4 px-6 sticky left-0 max-w-[280px] shadow-[10px_0_15px_-5px_rgba(0,0,0,0.3)] h-10 after:absolute after:inset-0 border"
              style={{ zIndex: 0 }}
            >
              <div className="flex gap-3 items-center text-lg font-semibold text-md text-foreground relative z-[999] mb-3">
                Duration
                <span>
                  <CheckCircleFill color="#00dc8b" />
                </span>
              </div>
              <div className="font-medium text-md text-foreground relative z-[999]">
                <UpvoteSelector />
              </div>
            </TableHead> */}
          </TableRow>
        </TableHeader>

        <TableBody>
          {csvData.map((row: any, index: number) => (
            <TableRow key={index}>
              {colHeader.map((header, colIndex) => (
                <TableCell className="border" key={colIndex} >{row[header]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    <Button className="mt-3" onClick={()=>setShowEventList(true)} >Add Events</Button>
    </>
  );
};

export default ColMapping;
