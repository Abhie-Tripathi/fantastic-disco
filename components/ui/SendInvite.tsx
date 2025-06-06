import React, { useState } from "react";
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
import { BASE_URL } from "@/config";

type AccessType = "SUPER_ADMIN" | "ADMIN" | "USER";

interface SendInviteProps {
  customTrigger?: React.ReactNode;
  redirectDomain?: string;
}

const SendInvite = ({ customTrigger, redirectDomain = window.location.origin }: SendInviteProps) => {
  const [email, setEmail] = useState("");
  const [selectedInvitationRole, setSelectedInvitationRole] = useState<AccessType>("USER");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/me/account/users/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          accessType: selectedInvitationRole,
          redirectDomain,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send invitation");
      }

      const data = await response.json();
      toast({
        title: "Success",
        description: data.data.message,
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
    } finally {
      setIsLoading(false);
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
