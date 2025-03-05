"use client";
import React, { useState } from "react";
import {
  ArrowLeft,
  Buildings,
  Globe,
  Linkedin,
  Location,
  LogoFacebook,
  LogoTwitterX,
} from "geist-icons";
import Image from "next/image";
import Heading from "@/components/new-ui/Heading";
import Text from "@/components/new-ui/Text";
import "react-circular-progressbar/dist/styles.css";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { TTabs } from "@/types/events";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CircleSlash, Factory, MailIcon, PhoneIcon } from "lucide-react";
import { GTMEventPOCDetails } from "@/types/events";
import { SectionHeading } from "@/app/components/prospectDetail/prospectHeading";
import { Button as ButtonUI } from "@/components/ui/button";
import { useCompanyService } from "@/services/companyService";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/Loading";
import { CompanyDetailResponse } from "@/types/prospect";
import { AdvancedDetails } from "@/app/components/prospectUserDetail/advancedDetails";
import NotFound from "@/app/not-found";
import { EventCalendar } from "@/app/components/prospectUserDetail/EventCalendar";


const excludedTags = [
  "Core CRM",
  "All Paid",
  "Billing Company",
  "FLOOR Clients",
  "Complimentary Services",
  "Dead Account",
  "core-crm",
  "all-paid",
  "billing-company",
  "floor-clients",
  "complimentary-services",
  "dead-account",
];

const getCompanyIndustries = (asOrganizer: any[], asExhibitor: any[]) => {
  if (asOrganizer && asOrganizer.length > 0) {
    const topData = asOrganizer
      .sort((a, b) => b.doc_count - a.doc_count)
      .slice(0, 5);

    // const names = [...topData.map(item => item.name), ...companyTag.map(item => '#'+item)];
    return topData.map((item) => item.key);
  } else if (asExhibitor && asExhibitor.length > 0) {
    const topData = asExhibitor
      .sort((a, b) => b.doc_count - a.doc_count)
      .slice(0, 5);

    return topData.map((item) => item.key);
  } else return [];
};

const UserDetail = ({ params }: { params: { userId: string } }) => {
  const referrer = document.referrer;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TTabs>("overview");
  const tabs = [
    { tabName: "Overview", path: "overview" },
    { tabName: "Events", path: "insights" },
  ];

  const [isExpandDescription, setisExpandDescription] =
    useState<boolean>(false);

  const [compLogo, setCompLogo] = useState<string | null>(null);

  // const [isExpandIndustry, setisExpandIndustry] = useState<boolean>(false);
  //   const filteredData = data.userData.filter(user => user.user_id === givenUserId);

  const [eventPOCDetails, setEventPOCDetails] = useState<GTMEventPOCDetails[]>(
    []
  );
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [pastEvents, setPastEvents] = useState<any[]>([]);

  const { getUserDetailById, getUserEvents } = useCompanyService();

  const { data: user, isFetching } = useQuery<any>({
    queryKey: ["companyDetails", params.userId],
    queryFn: async () => {
      const [
        userDataResult,
        upcomingEvents,
        pastEvents,
        // eventPOCDataResult,
      ] = await Promise.allSettled([
        getUserDetailById(params.userId),
        getUserEvents(params.userId, "upcomming"),
        getUserEvents(params.userId, "past"),
        // getCompanyPOC(params.companyId),
      ]);
      const userResponse =
        userDataResult.status === "fulfilled" ? userDataResult.value : null;
        const upcomingEventRes =
          upcomingEvents.status === "fulfilled" ? upcomingEvents.value : null;
        const pastEventRes =
          pastEvents.status === "fulfilled" ? pastEvents.value : null;

        setUpcomingEvents(upcomingEventRes?.events || []);
        setPastEvents(pastEventRes?.events || []);

      return {
        userDetails: userResponse?.userData,
        upcomingEventsCount: upcomingEventRes?.count,
        pastEventsCount: pastEventRes?.count,
      };
    },
    refetchOnWindowFocus: false,
    gcTime: 300000,
    staleTime: 300000,
  });

  if (isFetching) {
    return (
      <div className="p-8">
        <Loading />
      </div>
    );
  }

  const { userDetails, upcomingEventsCount, pastEventsCount } = user;

  if (!userDetails) {
    return <NotFound />;
  }

  const handleScrollTo = (section: string) => {
    const element = document.querySelector(`.${section}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const loadMoreEvents = async (type: string) => {
    if (type === "past") {
      const moreEvents = await getUserEvents(
        params.userId,
        "past",
        pastEvents.length
      );
      setPastEvents((prev) => [...prev, ...moreEvents?.events]);
    } else if (type === "upcoming") {
      const moreEvents = await getUserEvents(
        params.userId,
        "upcomming",
        upcomingEvents.length
      );
      setUpcomingEvents((prev) => [...prev, ...moreEvents?.events]);
    }
  };

  return (
    <div className="p-6 pt-0">
      <aside className="fixed h-screen w-[24%] pb-24 bg-[var(--primary-foreground)] pt-6 pr-6 overflow-y-auto shadow-[3px_0px_5px_-5px] dark:border-r-2 dark:border-r-[var(--border-color)] max-xl:w-[30%]">
        <button
          className="flex items-center gap-2 pb-4 text-[#666666] text-sm"
          onClick={() => (referrer ? router.push(referrer) : router.back())}
        >
          <ArrowLeft width="14px" height="14px" color="#6750A4" />
          <span className="text-[var(--primary-color)] font-medium">
            Back to Search
          </span>
        </button>

        {userDetails?.user_profilePicture !== null && (
          <div className="flex bg-[#F8F8FA] dark:bg-[var(--heading-background-color)] rounded-md px-6 py-4">
            <img
              src={userDetails.user_profilePicture}
              alt="eventLogo"
              className="flex h-20 w-20 rounded-xl shadow-lg"
              width={200}
              height={200}
            />
          </div>
        )}

        {userDetails?.user_name && (
          <Heading as="h6" variant="titleNoMargin" className="my-4">
            {userDetails?.user_name}
          </Heading>
        )}

        <div className="text-[#6E6F89] text-sm font-medium">
          {userDetails?.user_designationName}
          {userDetails?.user_companyName !== null && (
            <>, {userDetails?.user_companyName}</>
          )}
        </div>

        {(userDetails?.user_city !== null ||
          userDetails?.user_country !== null) && (
          <div className="flex gap-2 items-center w-fit my-4">
            <Location color="#666666" width="14px" height="14px" />
            <span className="text-[#6E6F89] text-sm">
              {userDetails?.user_city === userDetails?.user_country
                ? userDetails?.user_city
                : [userDetails?.user_city, userDetails?.user_country]
                    .filter(Boolean)
                    .join(", ")}
            </span>
          </div>
        )}

        {userDetails?.top_event_categories.length > 0 && (
          <div className="flex gap-2 items-center w-fit my-4 flex-wrap">
            <Buildings color="#666666" width="14px" height="14px" />

            {userDetails?.top_event_categories?.map((item: any) => (
              <span
                key={item.key}
                className="text-[var(--info-text-color)] dark:border-[#0D3868] bg-[var(--info-background-color)] font-semibold text-xs py-1 px-2 border-[#CCE6FF] border rounded-md whitespace-nowrap"
              >
                {item.key}
              </span>
            ))}

            {/* <span
            className="text-[var(--info-text-color)] text-xs font-medium cursor-pointer"
            onClick={() => setisExpandIndustry(!isExpandIndustry)}
          >
            { (companyDetails?.industries?.asOrganizer?.length + companyDetails?.companyTag?.length) > 2
              ? isExpandIndustry
                ? "Show Less"
                : `+${(companyDetails?.industries?.asOrganizer?.length + companyDetails?.companyTag?.length) -2} more`
              : ""}
          </span> */}
          </div>
        )}

        {userDetails?.top_event_tags.length > 0 && (
          <div className="flex gap-2 items-center w-fit my-4 flex-wrap">
            <Factory color="#666666" width="14px" height="14px" />
            {userDetails?.top_event_tags?.map((item: any, index: number) => (
              <span
                key={item.key}
                className="text-[var(--info-text-color)] dark:border-[#0D3868] bg-[var(--info-background-color)] font-semibold text-xs py-1 px-2 border-[#CCE6FF] border rounded-md whitespace-nowrap"
              >
                #{item.key}
              </span>
            ))}
          </div>
        )}

        {userDetails?.about && userDetails?.about?.length > 0 && (
          <Text variant="noMargin" color="secondary">
            {isExpandDescription
              ? userDetails?.about
              : userDetails?.about?.slice(0, 200)}
            <span
              className="font-semibold underline cursor-pointer ml-2"
              onClick={() => setisExpandDescription(!isExpandDescription)}
            >
              {userDetails?.about?.length > 200
                ? isExpandDescription
                  ? "Show Less"
                  : "Read More"
                : ""}
            </span>
          </Text>
        )}

        <div className="flex gap-4 my-6">
          {userDetails?.user_linkedin && (
            <Link
              href={userDetails?.user_linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin color="#0077B5" className="cursor-pointer" />
            </Link>
          )}
          {userDetails?.user_twitterId && (
            <Link
              href={userDetails?.user_twitterId}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LogoTwitterX color="#666666" className="cursor-pointer" />
            </Link>
          )}
          {userDetails?.user_facebookId && (
            <Link
              href={userDetails?.user_facebookId}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LogoFacebook color="#316FF6" className="cursor-pointer" />
            </Link>
          )}
        </div>
      </aside>
      <div className="ml-auto w-[70%] max-xl:w-[62%]">
        <ul className="flex flex-row gap-12 justify-between mb-4 z-10 bg-white dark:bg-[var(--heading-background-color)] shadow-md pt-3 items-end w-full">
          <div className="flex gap-12">
            {tabs.map((tab) => (
              <div
                key={tab.tabName}
                onClick={() => {
                  handleScrollTo(tab.path);
                }}
                className={`relative font-semibold cursor-pointer pb-3 ${
                  activeTab === tab.path
                    ? "text-[var(--primary-color)] border-b-2 border-b-[var(--primary-color)]"
                    : "text-[var(--tertiary-text-color)]"
                }`}
              >
                {tab.tabName}
              </div>
            ))}
          </div>
        </ul>

        <section className="flex flex-col gap-6 pb-6 h-[calc(100vh-180px)] mt-5 w-full pr-4 overflow-y-auto scroll-smooth">
          <SectionHeading
            heading="User Details"
            scrollSection={tabs[0].path}
            setActiveTab={setActiveTab}
          />
          <AdvancedDetails companyData={userDetails} />

          <SectionHeading
            heading="Events"
            scrollSection={tabs[1].path}
            setActiveTab={setActiveTab}
          />

          <EventCalendar
            companyId={params.userId}
            upcomingEvents={upcomingEvents}
            upcomingEventsCount={upcomingEventsCount}
            pastEvents={pastEvents}
            pastEventsCount={pastEventsCount}
            loadMoreEvents={loadMoreEvents}
          />
        </section>
      </div>
    </div>
  );
};

export default UserDetail;
