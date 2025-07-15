import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const FeedbackForm = ({ open, onOpenChange }: ModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-2xl mx-auto p-4 sm:p-6 rounded-xl">
        <DialogHeader className="pt-6">
          <DialogTitle className="tracking-normal">
            Cancel Subscription
          </DialogTitle>
          <DialogDescription>
            We are sorry to see you go! Please let us know why you are canceling
            your subscription.
          </DialogDescription>
        </DialogHeader>
        <form className="mt-4">
          <textarea
            className="w-full p-2 border rounded-md"
            placeholder="Your feedback here..."
            rows={4}
          />
        </form>
        <Button variant="default" onClick={() => onOpenChange(false)}>
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackForm;
