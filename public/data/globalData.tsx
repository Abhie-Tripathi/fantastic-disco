import { useFilterContext } from "@/context/filterContext";
export default function GlobalData(){
    const { enabledFilters } = useFilterContext();
    const eventStatuses = [
      { id: "active", label: "Active", isEnabled:enabledFilters?.eventStatus?.enabledValue  },
      { id: "cancelled", label: "Cancelled" },
      { id: "postponed", label: "Postponed" },
      { id: "predicted", label: "Predicted" },
    ]
 
}