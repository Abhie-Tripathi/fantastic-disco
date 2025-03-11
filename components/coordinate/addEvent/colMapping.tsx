import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { CheckCircleFill } from "geist-icons";
import ColSelector from "./ColSelector";
import { Button } from "@/components/ui/button";

interface Props {
  csvData: any;
  setShowEventList: any;
}

const dafaultHeaders = ["Name", "Start Date", "End Date", "Location", "Participation", "Type"];

const ColMapping = ({ csvData, setShowEventList }: Props) => {
//   console.log("csvData", csvData);
  const colHeader = csvData[0] ? Object.keys(csvData[0]) : [];
//   console.log("csvData", csvData, colHeader);

  return (
    <>
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-muted/50">
            {dafaultHeaders.map((header, index) => (
              <TableHead
                className="p-4 px-6 max-w-[280px] shadow-[10px_0_15px_-5px_rgba(0,0,0,0.3)] h-10 after:absolute after:inset-0 border"
                style={{ zIndex: 0 }}
              >
                <div className="flex gap-3 items-center text-lg font-semibold text-md text-foreground relative z-[999] mb-3">
                  {/* <span className="line-clamp-1">{header}</span> */}
                  {header}
                  <span>
                    <CheckCircleFill color="#00dc8b" />
                  </span>
                </div>
                <div className="font-medium text-md text-foreground relative z-[999]">
                  <ColSelector options={colHeader} selectedHeader={colHeader[index]} />
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
          {csvData.map((row: any) => (
            <TableRow>
              {colHeader.map((header) => (
                <TableCell className="border">{row[header]}</TableCell>
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
