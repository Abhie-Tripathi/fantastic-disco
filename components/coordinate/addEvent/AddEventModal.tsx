"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Papa from "papaparse";
import EventForm from "./EventForm";
import Modal from "./modal";
// import ColMapping from "./colMapping";
import { useCoordinateService } from "@/services/coordinateService";
import { useToast } from "@/hooks/use-toast";
// import CheckboxInput from "@/app/components/UI/CheckBoxInput";
// import LoadingSkeleton from "./LoadingSkeleton";
import UrlFetch from "./UrlFetch";
import BulkImport from "./BulkImport";
import SampleTable from "./SampleTable";
import { X } from "lucide-react";

export default function AddEventModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [selectedView, setSelectedView] = useState<
    "home" | "addEventForm" | "bulkImport" | "urlFetch"
  >("home"); // home, loading, addEventForm, bulkImport, urlFetch
  const [eventFormState, setEventFormState] = useState<
    "default" | "similarEvents" | "editEvents" | "validating" | "fetching"
  >("default");

  const { toast } = useToast();

  const coordinateService = useCoordinateService();

  const [csvData, setCsvData] = useState<any[]>([]);

  const [csvFileName, setCsvFileName] = useState<string>("");

  const [error, setError] = useState<string>("");

  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fileInputRef = React.createRef<HTMLInputElement>();

  const [websiteUrl, setWebsiteUrl] = useState<string>("");

  const [mappedHeaders, setMappedHeaders] = useState([
    {
      defaultName: "Name",
      fieldName: "",
      suggestions: ["name", "event name", "eventname"],
      isMatch: false,
    },
    {
      defaultName: "Start Date",
      fieldName: "",
      suggestions: ["start date", "start", "startdate", "startDate"],
      isMatch: false,
    },
    {
      defaultName: "End Date",
      fieldName: "",
      suggestions: ["end date", "end", "enddate", "endDate"],
      isMatch: false,
    },
    {
      defaultName: "Location",
      fieldName: "",
      suggestions: ["location", "venue", "address"],
      isMatch: false,
    },
    {
      defaultName: "Participation",
      fieldName: "",
      suggestions: [
        "participation",
        "participation type",
        "participationType",
        "mode",
      ],
      isMatch: false,
    },
    {
      defaultName: "Event Type",
      fieldName: "",
      suggestions: ["type", "event type", "eventType"],
      isMatch: false,
    },
  ]);

  const resetForm = () => {
    setIsFetching(false);
    setSelectedView("home");
    closeModal();
  };

  // Handle file change event
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setCsvFileName(file.name);
    // resetForm();

    // Parse the CSV file using PapaParse
    Papa.parse(file, {
      complete: (result) => {
        // console.log("result.data", result.data);

        // const mappedData = result.data.map((item: any) => ({
        //   name: item['Name'], // Map to your column names
        //   age: item['Age'],
        //   email: item['Email'],
        // }));

        setCsvData(result.data);

        const colHeader = result.data[0] ? Object.keys(result.data[0]) : [];

        const tempHeader2 = mappedHeaders;
        tempHeader2.map((header, index) => {
          // tempHeader[item] = colHeader[index]
          header.fieldName = colHeader[index] ?? "";
          // header.isMatch = true;
          header.isMatch = header.suggestions.some(
            (item) =>
              header.fieldName.toLowerCase().includes(item.toLowerCase()) ||
              header.fieldName.toLowerCase() === item.toLowerCase()
          );
        });

        setMappedHeaders(tempHeader2);
        setSelectedView("bulkImport");

        setError("");
        // setShowColMapping(true);
      },
      header: true, // assuming the first row contains headers
      skipEmptyLines: true, // skip empty lines
      error: (err) => {
        setError("Error parsing file");
        console.error(err);
      },
    });
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the input to clear the previous file
    }
    fileInputRef.current?.click();
  };

  // const handleMainModal = (action: string) => {
  //   if (action === "open")
  //     setIsModalOpen(true);
  //   else if (action === "close")
  //     setIsModalOpen(false);
  // }

  // useEffect(() => {
  //   resetForm();
  // }, [isModalOpen]);

  return (
    <div>
      <Button size="lg" onClick={openModal}>Add Event</Button>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="flex flex-col gap-4 h-full">
          <div className="flex justify-between items-center h-10">
            <h2 className="text-lg font-medium leading-6">Add Event</h2>
            <div className="flex gap-3">
              {(selectedView === "urlFetch" ||
                selectedView === "addEventForm" ||
                selectedView === "bulkImport") && (
                // <span
                //   className="cursor-pointer text-primary text-base mr-4"
                //   onClick={() => setSelectedView("home")}
                // >
                //   Back
                // </span>
                <Button
                  className="text-sm text-primary hover:text-primary"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedView("home")}>
                    Back
                </Button>
              )}

              {(selectedView === "home" ||
                selectedView === "urlFetch" ||
                selectedView === "bulkImport") && (
                <Button
                  className="text-primary hover:text-primary"
                  variant="outline"
                  onClick={() => {
                    setSelectedView("addEventForm");
                    setEventFormState("default");
                  }}
                >
                  Add Manually
                </Button>
              )}

              {selectedView === "addEventForm" &&
                (eventFormState === "default" ? (
                  <Button
                    className="text-sm"
                    size="sm"
                    onClick={() => setEventFormState("validating")}>
                      Save Event
                  </Button>
                ) : eventFormState === "similarEvents" ? (
                  <Button
                    className="text-primary hover:text-primary"
                    variant="outline"
                    onClick={() => setEventFormState("default")}>
                    Edit Event
                  </Button>
                ) : (
                  <></>
                ))}
                <Button
                  className="p-1 h-8 w-8 rounded-sm"
                  variant="ghost"
                  size="sm">
                  <X className="h-5 w-5"
                  onClick={closeModal} />
                </Button>
            </div>
          </div>

          {selectedView === "home" && (
            <>
              <div className="bg-[var(--background-secondary-color)] px-3 py-4 border border-[var(--border-color)] rounded-sm">
                <div className="text-[var(--link-color)] text-xs mb-3">
                  Enter the Event Website Link Or paste a link containing
                  multiple events to fetch them all
                </div>
                <div className="flex gap-4">
                  <Input
                    id="name"
                    className="rounded-sm bg-background focus-visible:border-none"
                    placeholder="Enter web URL"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    // aria-invalid={error ? "true" : "false"}
                    aria-describedby="name-error"
                  />
                  <Button
                    onClick={() => setSelectedView("urlFetch")}
                    disabled={isFetching || websiteUrl.trim() === ""}
                  >
                    {isFetching ? "Fetching..." : "Fetch"}
                  </Button>
                </div>
                <div className="text-center">
                  <div className="relative text-[#A1A2A2]">
                    <div className="border-b my-9"></div>
                    <span className="absolute text-[10px] -top-1.5 bg-[var(--background-secondary-color)] px-2 font-semibold">
                      OR
                    </span>
                  </div>
                  <div className="text-start text-[var(--link-color)] text-xs mb-3">
                    Upload a .PDF, .CSV, or .XLSX file following the sample
                    format to fetch your events effortlessly!
                  </div>
                  <div className="flex flex-col gap-2 justify-center items-center h-[140px] border border-dashed rounded-[18px] bg-background border-[var(--border-color)] text-[#A1A2A2]">
                    <span className="text-xs">
                      Click to browse or drag and drop your files
                    </span>
                    <span className="text-[10px] font-semibold">OR</span>
                    <Button size="sm" onClick={handleButtonClick}>
                      Upload File
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Button
                  className="text-primary hover:text-primary w-fit self-end"
                  variant="outline"
                  size="sm"
                >
                  Download Sample Format
                </Button>
              </div>

              <SampleTable mappedHeaders={mappedHeaders} isSampleTable={true} />
            </>
          )}

          <div
            className={`transition-opacity duration-500 ease-in-out overflow-y-auto ${
              selectedView === "addEventForm" ? "opacity-100" : "opacity-0"
            }`}
          >
            {selectedView === "addEventForm" && (
              <EventForm
                eventFormState={eventFormState}
                setEventFormState={setEventFormState}
                resetForm={resetForm}
              />
            )}
          </div>

          {/* <div
            className={`transition-opacity duration-500 ease-in-out overflow-y-auto ${
              selectedView === 'loading' ? "opacity-100" : "opacity-0"
            }`}
          >
            {selectedView === 'loading' && <LoadingSkeleton />}
          </div> */}

          <div
            className={`transition-opacity duration-500 ease-in-out overflow-y-auto ${
              selectedView === "urlFetch" ? "opacity-100" : "opacity-0"
            }`}
          >
            {selectedView === "urlFetch" && <UrlFetch url={websiteUrl} />}
          </div>

          <div
            className={`transition-opacity duration-500 ease-in-out overflow-y-auto ${
              selectedView === "bulkImport" ? "opacity-100" : "opacity-0"
            }`}
          >
            {selectedView === "bulkImport" && (
              <BulkImport
                mappedHeaders={mappedHeaders}
                csvFileName={csvFileName}
                handleFileUpload={handleButtonClick}
                csvData={csvData}
              />
            )}
          </div>
        </div>
      </Modal>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
