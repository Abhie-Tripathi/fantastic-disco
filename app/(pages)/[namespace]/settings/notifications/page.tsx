"use client";

import React, { useState } from "react";
import {
  Bell,
  Activity,
  Share2,
  Signal,
  LineChart,
  Megaphone,
  Target,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
} from "../../../../../components/ui/card";
import { GeneralNotifications } from "../../../../../components/ui/notifications/GeneralNotifications";
import { SpecificNotifications } from "../../../../../components/ui/notifications/SpecificNotifications";

const TRACKER_BUTTONS = [
  { icon: Activity, label: "Tracker" },
  { icon: Share2, label: "Coordinate" },
  { icon: Signal, label: "Outreach" },
  { icon: LineChart, label: "Trends" },
  { icon: Megaphone, label: "Promote" },
  { icon: Target, label: "Prospect" },
] as const;

export interface NotificationOption {
  id: string;
  description: string;
  inProduct: boolean;
  email: boolean;
}

export interface SubOption extends NotificationOption {}

export interface SpecificOption {
  id: string;
  inProduct: boolean;
  email: boolean;
  title: string;
  subOptions: SubOption[];
}

export interface GeneralSection {
  id: string;
  title: string;
  inProduct: boolean;
  email: boolean;
  options: NotificationOption[];
}

export interface SpecificSection {
  id: string;
  title: string;
  inProduct: boolean;
  email: boolean;
  options: SpecificOption[];
}

export interface NotificationsConfig {
  icon: React.ReactNode;
  title: string;
  description: string;
  general: GeneralSection[];
  specific: SpecificSection[];
}

const trackerNotifications: NotificationsConfig = {
  icon: <Activity className="h-5 w-5" />,
  title: "Tracker Notification Configurations",
  description:
    "Take control of what others see, what modules can access, and how you receive updates and notify.",
  general: [
    {
      id: "general-tracker-notifications",
      title: "General Tracker Notifications",
      inProduct: false,
      email: false,
      options: [
        {
          id: "trackerCreated",
          description: "When a tracker is created",
          inProduct: false,
          email: false,
        },
        {
          id: "trackerDeleted",
          description: "When a tracker is deleted",
          inProduct: false,
          email: false,
        },
        {
          id: "trackerTagged",
          description: "When you're tagged in discussion",
          inProduct: false,
          email: false,
        },
        {
          id: "trackerNameChanged",
          description: "When a tracker name is changed",
          inProduct: false,
          email: false,
        },
      ],
    },
  ],
  specific: [
    {
      id: "tracker-specific-notifications",
      title: "Tracker Specific Notifications",
      inProduct: false,
      email: false,
      options: [
        {
          id: "conference-event-tracker",
          title: "Conference Event Tracker",
          inProduct: false,
          email: false,
          subOptions: [
            {
              id: "newEventAdded",
              description: "When a new event is added",
              inProduct: false,
              email: false,
            },
            {
              id: "eventBookmarked",
              description: "When a event is bookmarked",
              inProduct: false,
              email: false,
            },
            {
              id: "statusChanged",
              description: "When event status is changed",
              inProduct: false,
              email: false,
            },
          ],
        },
        {
          id: "competitor-tracker",
          title: "Competitor Tracker",
          inProduct: false,
          email: false,
          subOptions: [
            {
              id: "newEventAdded",
              description: "When a new event is added",
              inProduct: false,
              email: false,
            },
            {
              id: "eventBookmarked",
              description: "When a event is bookmarked",
              inProduct: false,
              email: false,
            },
            {
              id: "statusChanged",
              description: "When event status is changed",
              inProduct: false,
              email: false,
            },
          ],
        },
        {
          id: "tradeshows-in-bengaluru",
          title: "Tradeshows in Bengaluru",
          inProduct: false,
          email: false,
          subOptions: [
            {
              id: "newEventAdded",
              description: "When a new event is added",
              inProduct: false,
              email: false,
            },
            {
              id: "eventBookmarked",
              description: "When a event is bookmarked",
              inProduct: false,
              email: false,
            },
            {
              id: "statusChanged",
              description: "When event status is changed",
              inProduct: false,
              email: false,
            },
          ],
        },
      ],
    },
  ],
};

const coordinateNotifications: NotificationsConfig = {
  icon: <Share2 className="h-5 w-5" />,
  title: "Coordinate Notification Configurations",
  description:
    "Take control of what others see, what modules can access, and how you receive updates and notify.",
  general: [
    {
      id: "general-coordinate-notifications",
      title: "General Coordinate Notifications",
      inProduct: false,
      email: false,
      options: [
        {
          id: "tagged",
          description: "When You are tagged.",
          inProduct: false,
          email: false,
        },
        {
          id: "assignedForEvent",
          description: "When an owner is assigned for an Event.",
          inProduct: false,
          email: false,
        },
        {
          id: "rejectedOrAccepted",
          description: "When you are rejected/accepted.",
          inProduct: false,
          email: false,
        },
        {
          id: "eventUpdates",
          description: "Updates in event",
          inProduct: false,
          email: false,
        },
      ],
    },
  ],
  specific: [],
};

const outreachNotifications: NotificationsConfig = {
  icon: <Signal className="w-5 h-5" />,
  title: "Outreach Notification Configurations",
  description:
    "Take control of what others see, what modules can access, and how you receive updates and notify.",
  general: [
    {
      id: "general-coordinate-notifications",
      title: "General Coordinate Notifications",
      inProduct: false,
      email: false,
      options: [
        {
          id: "tagged",
          description: "When You are tagged.",
          inProduct: false,
          email: false,
        },
        {
          id: "assignedForEvent",
          description: "When an owner is assigned for an Event.",
          inProduct: false,
          email: false,
        },
        {
          id: "rejectedOrAccepted",
          description: "When you are rejected/accepted.",
          inProduct: false,
          email: false,
        },
        {
          id: "eventUpdates",
          description: "Updates in event",
          inProduct: false,
          email: false,
        },
      ],
    },
  ],
  specific: [],
};

const trendsNotifications: NotificationsConfig = {
  icon: <LineChart className="w-5 h-5" />,
  title: "Trends Notification Configurations",
  description:
    "Take control of what others see, what modules can access, and how you receive updates and notify.",
  general: [],
  specific: [],
};

const promoteNotifications: NotificationsConfig = {
  icon: <Megaphone className="w-5 h-5" />,
  title: "Promote Notification Configurations",
  description:
    "Take control of what others see, what modules can access, and how you receive updates and notify.",
  general: [],
  specific: [],
};

const prospectNotifications: NotificationsConfig = {
  icon: <Target className="w-5 h-5" />,
  title: "Prospect Notification Configurations",
  description:
    "Take control of what others see, what modules can access, and how you receive updates and notify.",
  general: [],
  specific: [],
};

const configs = {
  Tracker: trackerNotifications,
  Coordinate: coordinateNotifications,
  Outreach: outreachNotifications,
  Trends: trendsNotifications,
  Promote: promoteNotifications,
  Prospect: prospectNotifications,
};

export default function NotificationSettings() {
  const [activeTab, setActiveTab] = useState("Tracker");
  const [notificationConfig, setNotificationConfig] = useState(
    configs[activeTab as keyof typeof configs]
  );

  const handleGeneralCheckboxChange = (
    sectionId: string,
    optionId: string,
    type: "inProduct" | "email"
  ) => {
    setNotificationConfig((prev) => {
      const newConfig = { ...prev };
      const section = newConfig.general.find((s) => s.id === sectionId);

      if (section) {
        const option = section.options.find((o) => o.id === optionId);
        if (option) {
          option[type] = !option[type];
        }
      }

      return newConfig;
    });
  };

  const handleSpecificCheckboxChange = (
    sectionId: string,
    optionId: string,
    subOptionId: string | null,
    type: "inProduct" | "email"
  ) => {
    setNotificationConfig((prev) => {
      const newConfig = { ...prev };
      const section = newConfig.specific.find((s) => s.id === sectionId);

      if (section) {
        const option = section.options.find((o) => o.id === optionId);
        if (option) {
          if (subOptionId) {
            const subOption = option.subOptions.find(
              (so) => so.id === subOptionId
            );
            if (subOption) {
              subOption[type] = !subOption[type];
              option[type] = option.subOptions.every((so) => so[type]);
            }
          } else {
            option[type] = !option[type];
            option.subOptions.forEach((so) => {
              so[type] = option[type];
            });
          }
          section[type] = section.options.every((o) => o[type]);
        }
      }

      return newConfig;
    });
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        const activeConfig = configs[value as keyof typeof configs];
        setActiveTab(value);
        setNotificationConfig(activeConfig);
      }}
      className="mb-8"
    >
      <TabsList className="grid grid-cols-6 mx-12">
        {TRACKER_BUTTONS.map(({ icon: Icon, label }) => (
          <TabsTrigger
            key={label}
            value={label}
            className="flex items-center gap-2"
          >
            <Icon className="h-4 w-4" />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      {TRACKER_BUTTONS.map(({ label }) => (
        <TabsContent value={label} key={label}>
          <NotificationConfigurationCard
            notificationCofiguration={notificationConfig}
            handleGeneralCheckboxChange={handleGeneralCheckboxChange}
            handleSpecificCheckboxChange={handleSpecificCheckboxChange}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

interface NotificationConfigurationCard {
  notificationCofiguration: NotificationsConfig;
  handleGeneralCheckboxChange: (
    sectionId: string,
    optionId: string,
    type: "inProduct" | "email"
  ) => void;
  handleSpecificCheckboxChange: (
    sectionId: string,
    optionId: string,
    subOptionId: string | null,
    type: "inProduct" | "email"
  ) => void;
}

const NotificationConfigurationCard = ({
  notificationCofiguration,
  handleGeneralCheckboxChange,
  handleSpecificCheckboxChange,
}: NotificationConfigurationCard) => {
  return (
    <Card className="border-none shadow-none">
      <div className="flex gap-3 items-center p-6">
        <span className="p-3 border rounded-md ">
          {notificationCofiguration.icon}
        </span>
        <div className="flex flex-col justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            {notificationCofiguration.title}
          </h1>
          <CardDescription>
            {notificationCofiguration.description}
          </CardDescription>
        </div>
      </div>
      <CardContent className="space-y-8">
        {notificationCofiguration.general.map((generalNotification) => (
          <GeneralNotifications
            key={generalNotification.id}
            generalNotification={generalNotification}
            handleGeneralCheckboxChange={handleGeneralCheckboxChange}
          />
        ))}
        {notificationCofiguration.specific.map((specificNotification) => (
          <SpecificNotifications
            key={specificNotification.id}
            specificNotifications={specificNotification}
            handleSpecificCheckboxChange={handleSpecificCheckboxChange}
          />
        ))}
      </CardContent>
    </Card>
  );
};
