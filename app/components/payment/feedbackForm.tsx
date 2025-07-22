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
import { featureList } from "./successModal";
import { MembershipPlan } from "@/data/membershipPlans";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const FeedbackForm = ({ open, onOpenChange }: ModalProps) => {
  const { getMembershipData, cancelSubscription } = useProfileServices();
  const { membershipData, setMembershipData } = useAuthContext();
  const currentMembershipPlan = MembershipPlan[membershipData?.membership || 0];
  const [reason, setReason] = useState<string>("");
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
      const formData: CancelSubscriptionFormData = {
        feedback: feedback.trim(),
        qna: {
          "Tell us why you're leaving": reason,
        },
      };
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
      setReason("");
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md mx-auto p-4 sm:p-6 rounded-xl gap-6">
        <div className="text-center pt-2">
          <h2 className="text-xl font-bold mb-1">We're sorry to see you go</h2>

          <p className="text-sm">
            Before you cancel, here's what you'll miss out on:
          </p>
        </div>

        <ul className="list-disc list-inside text-muted-foreground space-y-1 text-base">
          {featureList[currentMembershipPlan].map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>

        {/* <div className="bg-secondary p-3 rounded-lg">
          <p className="font-semibold">✨ New & Improved !</p>
          <p className="text-muted-foreground text-sm">
            We just launched{" "}
            <span className="font-semibold">AI-powered reports</span> and{" "}
            <span className="font-semibold">custom alerts</span>. Want to give
            them a try?
          </p>
        </div> */}

        <form>
          <label htmlFor="reason" className="block font-medium mb-2">
            Tell us why you're leaving
          </label>
          <select
            id="reason"
            className="w-full border bg-accent rounded p-2 mb-3 focus-visible:outline-none"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a reason
            </option>
            <option>Too Expensive</option>
            <option>Missing Features</option>
            <option>Not using it enough</option>
            <option>Switched to another tool</option>
            <option>Other (please specify below)</option>
          </select>
          <textarea
            rows={3}
            placeholder="Your feedback here..."
            className="w-full border focus-visible:outline-none rounded-lg p-2 mb-4 bg-accent"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>

          <div className="flex flex-wrap justify-center gap-4 items-center">
            <Button
              size="sm"
              className="text-red-500 border-red-500 hover:text-white hover:bg-red-500 "
              variant="outline"
              onClick={handleSubmit}
              disabled={
                feedback.trim().length < 50 || isSubmitting || reason === ""
              }
            >
              {isSubmitting ? "Cancelling..." : "Cancel Subscription"}
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={() => onOpenChange(false)}
            >
              Keep My Subscription
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackForm;
