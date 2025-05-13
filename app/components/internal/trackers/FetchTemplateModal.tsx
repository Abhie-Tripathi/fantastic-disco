import { Button } from "@/components/ui/button";
import Modal from "@/components/coordinate/addEvent/modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import FetchedTracker from "./FetchedTracker";
import { useFilterContext } from "@/context/filterContext";


type TemplatesModalProps = {
  inputValue: string;
  setMin:(val:boolean)=>void
  loadingState: {
    isKeywordsLoading: boolean;
    isCompetitorsLoading: boolean;
    isPeopleLoading: boolean;
  };
  open: boolean;
  onOpenChange: any;
};

const TemplatesModal = ({
  open,
  onOpenChange,
  setMin,
  loadingState,
  inputValue,
}: TemplatesModalProps) => {
const {setTemplateView} = useFilterContext();
const closeModal = () => { 
  setTemplateView(true);
  onOpenChange(false);
  setMin(true);
}
  return (
<Modal isOpen={open} onClose={onOpenChange} className="w-[40vw]">
    {/* DIALOG CONTENT */}
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="relative flex flex-col overflow-hidden w-full">
        {/* CUSTOM CLOSE BUTTON */}
        <div className="absolute right-4 top-4 z-10">
          <Button
            variant="ghost"
            onClick={closeModal}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Hide
          </Button>
        </div>

        {/* HEADER */}
        <div className="px-6 pt-6">
          <div className="tracking-normal font-semibold">Brand Brief Builder</div>
        </div>

        {/* INPUT FIELD + FETCH BUTTON */}
        <div className="flex gap-2 bg-[var(--background-secondary-color)] p-2 mx-6 my-4 rounded">
          <div className="border-[var(--border-color)] rounded-[var(--border-radius-sm)] border flex p-1 w-full hover:border-[#D2D2F3] focus-within:border-[#D2D2F3] transition-all duration-200 bg-[var(--accent-foreground)]">
            <input 
              type="text" 
              value={inputValue}
              placeholder="Enter Web URL" 
              className="border-none outline-none bg-transparent w-full"
            />
            <Button 
              className="w-[100%] sm:w-[25%] bg-[var(--dashboard-brandkit-subtext)] text-white rounded-[var(--border-radius-sm)] flex items-center justify-center gap-2"
            >
              <>
              {loadingState.isCompetitorsLoading && loadingState.isKeywordsLoading && loadingState.isPeopleLoading 
    ? "Fetch" 
    : (
        <>
          Preparing...
        </>
      )
  }
  </>
            </Button>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <ScrollArea className="h-[calc(90vh-160px)] px-6 pb-6">
          <div className="space-y-4">
            <FetchedTracker 
              loadingState={loadingState}
            />
          </div>
        </ScrollArea>
      </div>
    </div>
</Modal>


  );
};

export default TemplatesModal;
