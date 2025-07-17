import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthContext } from "@/context";
import { useToast } from "@/hooks/use-toast";
import { useProfileServices } from "@/services/profileService";
import { CancelSubscriptionFormData } from "@/types/subscription";
import { useState } from "react";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const FeedbackForm = ({ open, onOpenChange }: ModalProps) => {
  const { getMembershipData, cancelSubscription } = useProfileServices();
  const { setMembershipData } = useAuthContext();
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const updateMembershipData = async () => {
    try {
      const data = await getMembershipData();
      if (data) setMembershipData(data);
    } catch (error) {
      console.error("Error updating membership:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      const formData: CancelSubscriptionFormData = { feedback: feedback.trim() };
      const data = await cancelSubscription(formData);
      if (data && data.cancelled) {
        toast({
          title: "Subscription Cancelled",
          description: "Your subscription has been successfully cancelled.",
        });
        updateMembershipData();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to cancel subscription. Please try again later.",
        });
      }
    } catch (e) {
      console.error("Error cancelling subscription:", e);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel subscription. Please try again later.",
      });
    } finally {
      onOpenChange(false);
      setFeedback("");
      setIsSubmitting(false);
    }
  };
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
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
            placeholder="Your feedback here..."
            rows={4}
          />
        </form>
        <Button
          variant="default"
          onClick={handleSubmit}
          disabled={!feedback.trim() || isSubmitting}
          className="mt-4"
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackForm;
