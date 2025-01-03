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

const SendInvite = () => {
  const [selectedInvitationRole, setSelectedInvitationRole] = useState("admin");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Send Invite</Button>
      </DialogTrigger>
      <DialogContent>
        <h3 className="mb-4 text-lg font-semibold">Invite People</h3>
        <div className="flex items-center gap-2">
          <Input placeholder="Invite others by name or email" />
          <Select
            value={selectedInvitationRole}
            onValueChange={setSelectedInvitationRole}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          <Button>Send Invite</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendInvite;
