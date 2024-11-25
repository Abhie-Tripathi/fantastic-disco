"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/axios";

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export function NotificationPopup() {
  const [open, setOpen] = useState(false);

  // const {
  //   data: notifications,
  //   isLoading,
  //   error,
  // } = useQuery<Notification[]>({
  //   queryKey: ["notifications"],
  //   queryFn: () => fetcher(""),
  // });

  const isLoading = false;
  const error = null;
  const notifications = [] as Notification[];

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Notifications</h3>
          <Button variant="ghost" size="sm" className="text-sm">
            Mark all as read
          </Button>
        </div>
        <Separator />
        <ScrollArea className="h-[300px] overflow-y-auto">
          {isLoading ? (
            <p className="text-center py-4">Loading notifications...</p>
          ) : error ? (
            <p className="text-center py-4 text-red-500">
              Error loading notifications
            </p>
          ) : notifications && notifications.length > 0 ? (
            <ul className="space-y-2">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <h4 className="font-medium">{notification.title}</h4>
                  <p className="text-sm text-gray-600">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center py-4">No notifications</p>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
