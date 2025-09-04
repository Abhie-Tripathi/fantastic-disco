import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "../ui/select";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAccessManagementService, AccessType } from "@/services/accessManagementService";



interface SendInviteProps {
  customTrigger?: React.ReactNode;
  redirectDomain?: string;
}

const SendInvite = ({ customTrigger, redirectDomain }: SendInviteProps) => {
  const [email, setEmail] = useState("");
  const [selectedInvitationRole, setSelectedInvitationRole] = useState<AccessType>("USER");
  const { toast } = useToast();
  const { inviteUser, isLoading } = useAccessManagementService();

  const actualRedirectDomain = redirectDomain ?? (typeof window !== "undefined" ? window.location.origin : "");

  const handleSubmit = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await inviteUser({
        email,
        accessType: selectedInvitationRole,
        redirectDomain: actualRedirectDomain,
      });

      toast({
        title: "Success",
        description: response?.message || "Invitation sent successfully!",
      });
      
      // Reset form
      setEmail("");
      setSelectedInvitationRole("USER");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {customTrigger || (
          <Button variant="ghost" size="icon" className="relative">
            <UserPlus className="h-5 w-5" />
            <span className="sr-only">Invite</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <h3 className="mb-4 text-lg font-semibold">Invite People</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Invite others by email" 
              className="flex-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <Select
              value={selectedInvitationRole}
              onValueChange={(value: AccessType) => setSelectedInvitationRole(value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="USER">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Invite"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendInvite;
