import { EventTableHeader } from "@/app/components/Table/EventTableHeader";
import { EventTableRow } from "@/app/components/Table/EventTableRow";
import { Table, TableBody } from "@/components/ui/table";
import Loading from "@/components/ui/Loading";
import NullState from "@/app/components/trackers/nullState";
import trackerNullState from "@/public/trackerNullState.svg";
import { useEffect, useState } from "react";
import { useTrackerServices } from "@/services/trackerServices";
import { useSearchParams } from "next/navigation";
import { useFilterState } from "@/hooks/useFilterState";
import { PaginationComponent } from "@/components/pagination";
const PublicEventTable=({presetTemplateData,active})=>{
    const {getFilterValue, setMultipleFilters} =
          useFilterState();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = parseInt(getFilterValue("limit") || "10");
  const currentPage =
    Math.floor(parseInt(getFilterValue("offset") || "0") / itemsPerPage) + 1;
    const [totalEvents,setTotalEvents] = useState(0);
  const totalPages = Math.ceil(totalEvents / itemsPerPage);
    const { publicEvents } = useTrackerServices();
    const [eventsData,setEventsData] = useState();
    const typeOfEvent = searchParams.get("eventType");
    const [activeVal, setActiveVal] = useState(typeOfEvent);
    useEffect(()=>{
        setIsLoading(true);
        const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  const orgName: string[] = [];
  const orgWebsite: string[] = [];

  presetTemplateData?.data?.organizations?.forEach((item:string) => {
    const value = item?.trim();
    if (!value) return;

    if (regex.test(value)) {
      orgWebsite.push(value);
    } else {
      orgName.push(value);
    }
  });
  const formData: any = {};

// formData.name = presetTemplateData?.name;
if(presetTemplateData){

  console.log("presetTemplateData?.trackerType?.[0]",presetTemplateData?.trackerType?.[0]);
  
if (presetTemplateData?.trackerType?.includes("T_COMPETITOR")) {
  formData.searchByEntity = "company";
}
if(presetTemplateData?.trackerType?.includes("T_PRODUCT_KEYWORDS")){
  formData.searchByEntity = "keywords";
}
if(presetTemplateData?.trackerType?.includes("T_PEOPLE_FINDER")){
  formData.searchByEntity = "user";
}
if(presetTemplateData?.trackerType?.includes("T_SPEAKING_OPPORTUNITY")){
  formData.searchByEntity = "speaker"
}
formData.view = "list";
formData.trackerEventStatus = active || "active";
// Include conditional filter values
if (presetTemplateData?.data?.includeKeywords?.length > 0) {
  const updatedPositiveKeywords =presetTemplateData.data.includeKeywords.map((item:string)=>item.replaceAll(" ","_"))
  formData.includeKeywords = updatedPositiveKeywords.slice(0,100).join(",");
}

if (presetTemplateData?.data?.excludeKeywords?.length > 0) {
  const updatedNegativeKeywords =presetTemplateData.data.excludeKeywords.map((item:string)=>item.replaceAll(" ","_"))
  formData.excludeKeywords = updatedNegativeKeywords.slice(0,100).join(",");
}

if (presetTemplateData?.data?.userName?.length > 0) {
  formData.userName = presetTemplateData.data.userName.slice(0,100).join(",");
}

if (presetTemplateData?.data?.userOrgWebsite?.length > 0) {
  formData.userOrgWebsite = presetTemplateData.data.userOrgWebsite.slice(0,100).join(",");
}
if(active==="past"){
  const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

const formatted = yesterday.toISOString().split('T')[0];
  formData.active_lte = formatted;
}
if(active==="active"){
  const today = new Date();
  const formatted = today.toISOString().split('T')[0];
  formData.active_gte = formatted;
}
if(active === "new"){
  const today = new Date();
  const formatted = today.toISOString().split('T')[0];
  formData.createdAt = formatted;
}
if (orgWebsite.length > 0) {
  formData.orgWebsite = orgWebsite.slice(0,100).join(",");
}
if (orgName.length > 0) {
  formData.orgName = orgName.slice(0,100).join(",");
}
formData.limit = searchParams.get("limit") || "10";
formData.offset = searchParams.get("offset") || "0";
// setPayload(formData);
getData(formData);
  console.log("formData", formData);
}
      },[presetTemplateData, active, currentPage])
    // useEffect(()=>{
    //     setIsLoading(true)
    //     getData(formData);
    // },[active, currentPage])
    const getData=async(formData)=>{
    try{
      const response = await publicEvents(formData)
    //  if(response){
    //   setIsLoading(false);
    //  }
     setTotalEvents(response.count);
     setEventsData(response);
     console.log(response);
    }catch(error){
        
    }finally{
      setIsLoading(false)
    }
     
     
  }
  const handlePageChange = (page: number) => {
    setMultipleFilters({
      offset: ((page - 1) * itemsPerPage).toString(),
      limit: itemsPerPage.toString(),
    });
  };
  const handleItemsPerPageChange = (newItemsPerPage: string) => {
    setMultipleFilters({
      limit: newItemsPerPage,
    });
  };
    return(
        <div>
            {isLoading?<Loading className="h-24 text-primary" />:
                eventsData?.count===0 ?(
                  <NullState
                        image={trackerNullState}
                        title="We couldn't find any events matching your tracker criteria at the moment."
                        // text="Try adjusting your filters or checking back later, as new events are added frequently."
                        // buttonText="Manage Configurations"
                        // buttonUrl={`/internal/trackers/${trackerId}/editTracker?type=${query.type}`}
                      />
                ):
                <>
                <div className="flex-1 overflow-hidden rounded-md border bg-background">
                
                    <div
                      className={`${
                         "h-[calc(100vh-210px)]"
                      } overflow-auto`}
                    >
                      <Table>
                        <EventTableHeader
                          show={[]}
                        />
                        <TableBody className="overflow-auto">
                          {eventsData &&
                            eventsData.events.map((event: Event) => (
                              <EventTableRow
                                event={event}
                              />
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  
                </div>
                {totalPages > 0 && (
                        <div className="sticky bottom-0 bg-background py-3 border-t">
                          <PaginationComponent
                            currentPage={currentPage}
                            totalPages={totalPages}
                            itemsPerPage={itemsPerPage}
                            count={totalEvents}
                            onPageChange={handlePageChange}
                            onItemsPerPageChange={handleItemsPerPageChange}
                          />
                        </div>
                      )}
                    </>
                    }
        </div>
    )
}

export default PublicEventTable;