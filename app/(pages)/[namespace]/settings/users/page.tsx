"use client";
import React from "react";
import { UserSearch } from "lucide-react";
import { useState } from "react";
import SendInvite from "../../../../../components/ui/SendInvite";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";

export default function UsersPage() {
  const [superAdminSearch, setSuperAdminSearch] = useState("");
  const [usersSearch, setUsersSearch] = useState("");

  const superAdmins = [
    {
      name: "Aryan Khanna",
      role: "Manager of Operations",
      email: "Aryan@radisson.com",
    },
    {
      name: "BalGangadar Kulkarni",
      role: "Managing Director",
      email: "Bgangadar@radisson.com",
    },
  ];

  const users = [
    {
      name: "Abhinav Tripati",
      role: "Managing Director",
      email: "Abhinav@radisson.com",
      userType: "Super Admin",
    },
    {
      name: "BalGangadar Kulkarni",
      role: "Managing Director",
      email: "Bgangadar@radisson.com",
      userType: "Admin",
    },
    {
      name: "Reshma Chaturvedi",
      role: "Marketing Head",
      email: "Reshmak@radisson.com",
      userType: "User",
    },
    {
      name: "Urvashi Druvadi",
      role: "Regional Manager",
      email: "UrvashiD@radisson.com",
      userType: "User",
    },
  ];

  const filteredSuperAdmins = superAdmins.filter((admin) =>
    admin.name.toLowerCase().includes(superAdminSearch.toLowerCase())
  );

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(usersSearch.toLowerCase())
  );

  return (
    <div className="p-6 pt-0">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Manage Users</h1>
          <p className="text-sm text-gray-500">
            Here you can view, manage, and update user accounts.
          </p>
        </div>
        <div className="flex items-center justify-between w-1/2 bg-muted rounded-md p-4">
          <p className="text-sm text-gray-600">
            Invite your team to join and unlock the power of connection
            together!
          </p>
          <SendInvite />
        </div>
      </div>

      <div className="flex justify-between">
        <div className="w-full max-w-md">
          <h2 className="text-lg font-semibold mb-4">Super Admin (1)</h2>
          <div className="space-y-4">
            <Input
              placeholder="Search Members"
              type="search"
              value={superAdminSearch}
              onChange={(e) => setSuperAdminSearch(e.target.value)}
            />
            <div className="space-y-4">
              {filteredSuperAdmins.map((user) => (
                <UserRow
                  email={user.email}
                  name={user.name}
                  role={user.role}
                  key={user.email}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="w-1/2">
          <h2 className="text-lg font-semibold mb-4">Users (12)</h2>
          <div className="space-y-4">
            <Input
              placeholder="Search Members"
              type="search"
              value={usersSearch}
              onChange={(e) => setUsersSearch(e.target.value)}
            />
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <UserRow
                  email={user.email}
                  role={user.role}
                  name={user.name}
                  userType={user.userType}
                  key={user.email}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserRow({
  name,
  role,
  email,
  userType,
}: {
  name: string;
  role: string;
  email: string;
  userType?: string;
}) {
  const [userRole, setUserRole] = useState(userType);
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 bg-gray-100" />
        <div>
          <p className="text-sm font-medium text-gray-900">{name}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">{email}</span>
        {userType && (
          <Select value={userRole} onValueChange={setUserRole}>
            <SelectTrigger className="w-[200px]">
              <SelectValue>{userRole}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Super Admin">Super Admin</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="User">User</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}
