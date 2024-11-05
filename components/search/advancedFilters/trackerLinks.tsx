import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Target,
  Users,
  UserSearch,
  Volume2,
  LayoutTemplate,
} from "lucide-react";
import trackerLinkVector from "/public/trackerLinkVector.svg";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const templates = [
  {
    icon: Users,
    category: "Human Resources",
    title: "Recruitment",
    description:
      "Input designations and keywords, and upload job descriptions to identify relevant events effortlessly.",
  },
  {
    icon: UserSearch,
    category: "Marketing / Strategy",
    title: "People Finder",
    description:
      "Track experts, influencers and where they might be participating in various events.",
  },
  {
    icon: Target,
    category: "Sales",
    title: "Competitor",
    description:
      "Track your competitor experts, influencers and where they might be participating in various events.",
  },
  {
    icon: Volume2,
    category: "Marketing/Sales",
    title: "Speaking Opportunity",
    description:
      "Input team members and their details to keep track of the events with speaking opportunities.",
  },
];

const TrackerLinks = () => {
  return (
    <div>
      <div className="flex justify-end">
        <Button variant="link" className="pr-6">
          View All
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-3 pb-6 border-b place-items-center">
        {templates.map((template, index) => (
          <TrackerLink key={index} {...template} />
        ))}
      </div>
    </div>
  );
};

export default TrackerLinks;

function TrackerLink({
  icon: Icon,
  category,
  title,
  description,
}: {
  icon: React.ElementType;
  category: string;
  title: string;
  description: string;
}) {
  return (
    <Card className="w-[300px] bg-white shadow-md">
      <CardHeader className="p-4 pb-2">
        <div className="bg-[#F9F9FF] rounded-md flex items-center justify-between mb-2 px-4">
          <Icon className="w-6 h-6 text-primary" />
          <Image src={trackerLinkVector} alt="trackerlinkvector" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs">
            <LayoutTemplate className="w-4 h-4 mr-2" />
            Template
          </div>
          <Badge>{category}</Badge>
        </div>
        <CardTitle className="text-lg font-semibold text-gray-800">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}
