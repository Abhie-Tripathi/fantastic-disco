"use client";
import React, { useState } from "react";
import {
  ArrowLeft,
  Buildings,
  Globe,
  Linkedin,
  Location,
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
import { AdvancedDetails } from "@/app/components/prospectDetail/advancedDetails";
import { SectionHeading } from "@/app/components/prospectDetail/prospectHeading";
import { EventCalendar } from "@/app/components/prospectDetail/EventCalendar";
import { Button as ButtonUI } from "@/components/ui/button";
import { useCompanyService } from "@/services/companyService";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/Loading";
import { CompanyDetailResponse } from "@/types/prospect";

const excludedTags = ["Core CRM", "All Paid", "Billing Company", "FLOOR Clients", "Complimentary Services", "Dead Account", "core-crm", "all-paid", "billing-company", "floor-clients", "complimentary-services", "dead-account"];

const getCompanyIndustries = (asOrganizer: any[], asExhibitor: any[]) => {
  if (asOrganizer && asOrganizer.length > 0) {
    const topData = asOrganizer
      .filter((item) => item.isGroup === 1)
      .sort((a, b) => b.eventCount - a.eventCount)
      .slice(0, 5);

    // const names = [...topData.map(item => item.name), ...companyTag.map(item => '#'+item)];
    return topData.map((item) => item.name);
  } else if (asExhibitor && asExhibitor.length > 0) {
    const topData = asExhibitor
      .filter((item) => item.isGroup === 1)
      .sort((a, b) => b.eventCount - a.eventCount)
      .slice(0, 5);

    return topData.map((item) => item.name);
  } else return [];
};

const CompanyDetail = ({ params }: { params: { companyId: string } }) => {
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

  const [eventPOCDetails, setEventPOCDetails] = useState<GTMEventPOCDetails[]>(
    []
  );
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [pastEvents, setPastEvents] = useState<any[]>([]);

  const {
    getCompanyDetailById,
    getCompanyEvents,
    getCompanyPOC,
    unlockPocDetail,
    checkCompanyLogo,
  } = useCompanyService();

  const { data: company, isFetching } = useQuery<any>({
    queryKey: ["companyDetails", params.companyId],
    queryFn: async () => {
      const [
        companyDataResult,
        upcomingEvents,
        pastEvents,
        eventPOCDataResult,
      ] = await Promise.allSettled([
        getCompanyDetailById(params.companyId),
        getCompanyEvents(params.companyId, "upcomming"),
        getCompanyEvents(params.companyId, "past"),
        getCompanyPOC(params.companyId),
      ]);
      const companyResponse =
        companyDataResult.status === "fulfilled"
          ? companyDataResult.value
          : null;
      const upcomingEventRes =
        upcomingEvents.status === "fulfilled" ? upcomingEvents.value : null;
      const pastEventRes =
        pastEvents.status === "fulfilled" ? pastEvents.value : null;
      const eventPOCData =
        eventPOCDataResult.status === "fulfilled"
          ? eventPOCDataResult.value
          : null;
      setEventPOCDetails(eventPOCData?.companyPoc || []);
      setUpcomingEvents(upcomingEventRes.events || []);
      setPastEvents(pastEventRes.events || []);
      if (companyResponse && companyResponse?.companyData.logo !== null) {
        setCompLogo(companyResponse.companyData.logo);
      } else if (
        companyResponse?.companyData.logo === null &&
        companyResponse.companyData.website !== null
      ) {
        const tempLogo = await checkCompanyLogo(
          companyResponse.companyData.website
        );
        if (tempLogo) {
          setCompLogo(
            `https://logo.clearbit.com/${companyResponse.companyData.website}`
          );
        }
      }
      return {
        companyDetails: companyResponse?.companyData,
        upcomingEventsCount: upcomingEventRes.count,
        pastEventsCount: pastEventRes.count,
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

  if (!company) return null;
  const { companyDetails, upcomingEventsCount, pastEventsCount } = company;

  const handleScrollTo = (section: string) => {
    const element = document.querySelector(`.${section}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const unlockPoc = async (pocId: number) => {
    try {
      setEventPOCDetails((prevPocData) =>
        prevPocData.map((poc) =>
          poc.id === pocId ? { ...poc, state: 1 } : poc
        )
      );
      const data = await unlockPocDetail(pocId, params.companyId);
      if (data) {
        setEventPOCDetails((prevPocData) =>
          prevPocData.map((poc) =>
            poc.id === pocId
              ? {
                  ...poc,
                  email: data.email,
                  phoneNumber: data.phoneNumber,
                  state: 2,
                }
              : poc
          )
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const loadMoreEvents = async (type: string) => {
    if (type === "past") {
      const moreEvents = await getCompanyEvents(
        params.companyId,
        "past",
        pastEvents.length
      );
      setPastEvents((prev) => [...prev, ...moreEvents?.events]);
    } else if (type === "upcoming") {
      const moreEvents = await getCompanyEvents(
        params.companyId,
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
          onClick={() => router.back()}
        >
          <ArrowLeft width="14px" height="14px" color="#6750A4" />
          <span className="text-[var(--primary-color)] font-medium">
            Back to Search
          </span>
        </button>

        {compLogo !== null && (
          <div className="flex bg-[#F8F8FA] dark:bg-[var(--heading-background-color)] rounded-md px-6 py-4">
            <img
              src={compLogo}
              alt="eventLogo"
              className="flex h-20 w-20 rounded-xl shadow-lg"
              width={200}
              height={200}
            />
          </div>
        )}

        {companyDetails?.name && (
          <Heading as="h6" variant="titleNoMargin" className="my-4">
            {companyDetails?.name}
          </Heading>
        )}

        {(companyDetails.location?.cityName !== null ||
          companyDetails.location?.countryName !== null) && (
          <div className="flex gap-2 items-center w-fit my-4">
            <Location color="#666666" width="14px" height="14px" />
            <span className="text-[#6E6F89] text-sm">
              {companyDetails.location?.cityName ===
              companyDetails.location?.countryName
                ? companyDetails.location?.cityName
                : [
                    companyDetails.location?.cityName,
                    companyDetails.location?.countryName,
                  ]
                    .filter(Boolean)
                    .join(", ")}
            </span>
          </div>
        )}

        {companyDetails?.industries?.asOrganizer.length > 0 && (
          <div className="flex gap-2 items-center w-fit my-4 flex-wrap">
            <Buildings color="#666666" width="14px" height="14px" />

            {getCompanyIndustries(
              companyDetails?.industries?.asOrganizer,
              companyDetails?.industries?.asExhibitor
            )?.map((item: any) => (
              <span
                key={item}
                className="text-[var(--info-text-color)] dark:border-[#0D3868] bg-[var(--info-background-color)] font-semibold text-xs py-1 px-2 border-[#CCE6FF] border rounded-md whitespace-nowrap"
              >
                {item}
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

        {companyDetails?.companyTag.length > 0 && (
          <div className="flex gap-2 items-center w-fit my-4 flex-wrap">
            <Factory color="#666666" width="14px" height="14px" />
            { companyDetails?.companyTag
              ?.filter((item: any) => !excludedTags.includes(item))
              ?.filter(Boolean)
              .slice(0, 2)
              ?.map((item: any, index: number) => (
              <span
                key={item}
                className="text-[var(--info-text-color)] dark:border-[#0D3868] bg-[var(--info-background-color)] font-semibold text-xs py-1 px-2 border-[#CCE6FF] border rounded-md whitespace-nowrap"
              >
                #{item}
              </span>
            ))}
          </div>
        )}

        {companyDetails?.description &&
          companyDetails?.description?.length > 0 && (
            <Text variant="noMargin" color="secondary">
              {isExpandDescription
                ? companyDetails?.description
                : companyDetails?.description?.slice(0, 200)}
              <span
                className="font-semibold underline cursor-pointer ml-2"
                onClick={() => setisExpandDescription(!isExpandDescription)}
              >
                {companyDetails?.description?.length > 200
                  ? isExpandDescription
                    ? "Show Less"
                    : "Read More"
                  : ""}
              </span>
            </Text>
          )}

        <div className="flex gap-4 my-6">
          {companyDetails?.social?.linkedinId && (
            <Link
              href={companyDetails?.social?.linkedinId}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin color="#0077B5" className="cursor-pointer" />
            </Link>
          )}
          {companyDetails?.social?.twitterId && (
            <Link
              href={companyDetails?.social?.twitterId}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LogoTwitterX color="#666666" className="cursor-pointer" />
            </Link>
          )}
          {companyDetails?.website && (
            <Link
              href={companyDetails?.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Globe color="#666666" className="cursor-pointer" />
            </Link>
          )}
        </div>

        <Accordion
          type="single"
          className="bg-[#FAFAFA] dark:bg-transparent border border-[var(--neutral-light-color)] rounded-sm my-4"
          collapsible
        >
          <AccordionItem value="item-2">
            <AccordionTrigger className="hover:no-underline p-2 font-normal text-sm">
              <p className="flex gap-3 items-center">
                Company POC
                {eventPOCDetails.length > 0 && (
                  <span className="text-[12px] bg-[var(--primary-color)] text-white dark:text-[#131313] py-[1px] px-2 rounded-full">
                    {eventPOCDetails.filter((poc) => poc !== null).length > 0 &&
                    eventPOCDetails.filter((poc) => poc !== null).length < 9
                      ? `0${
                          eventPOCDetails.filter((poc) => poc !== null).length
                        }`
                      : eventPOCDetails.filter((poc) => poc !== null).length}
                  </span>
                )}
              </p>
            </AccordionTrigger>
            <AccordionContent
              className={`${
                companyDetails?.pocData?.length > 1
                  ? "h-36 overflow-y-auto"
                  : "h-fit"
              } pb-1 overflow-x-hidden`}
            >
              {eventPOCDetails && eventPOCDetails.length > 0 ? (
                eventPOCDetails.map((poc: GTMEventPOCDetails | null) => {
                  if (!poc) {
                    return <></>;
                  }
                  const {
                    designation,
                    email,
                    id,
                    phoneNumber,
                    profilePicture,
                    name,
                    state,
                  } = poc;
                  return (
                    <div key={id} className="flex flex-row gap-3 p-2">
                      <img
                        src={
                          profilePicture
                            ? profilePicture
                            : `https://img.10times.com/userimages/${name
                                .charAt(0)
                                .toLowerCase()}.jpg`
                        }
                        alt="POC Logo"
                        className="rounded-lg shadow-md h-10 w-10"
                      />
                      <div className="flex flex-col gap-2 flex-1 flex-wrap">
                        {name && (
                          <Text fontWeight="medium" variant="noMargin">
                            {name}
                          </Text>
                        )}
                        {designation !== null && (
                          <p className="text-[#666666] text-[12px]">
                            <span>{designation}</span>
                          </p>
                        )}
                        {email && (
                          <p className="text-[#666666] flex items-center gap-2 text-[12px]">
                            <MailIcon
                              width="12px"
                              height="12px"
                              className="self-start mt-1"
                            />
                            <span className="break-all">{email}</span>
                          </p>
                        )}
                        {phoneNumber && (
                          <p className="text-[#666666] flex items-center gap-2 text-[12px]">
                            <PhoneIcon width="12px" height="12px" />
                            <span>{phoneNumber}</span>
                          </p>
                        )}
                        {(email || phoneNumber) && (
                          <div>
                            <ButtonUI
                              disabled={
                                state && (state === 1 || state === 2)
                                  ? true
                                  : false
                              }
                              onClick={() => unlockPoc(id)}
                              variant={"outline"}
                              size={"sm"}
                            >
                              Show details
                            </ButtonUI>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-[#666666] text-sm flex items-center gap-2 p-2">
                  <CircleSlash width={15} height={15} />
                  No POC found
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* <div className="flex gap-6 mt-4 justify-center">
          <Button variant="outline" className="p-5 w-1/2 border-[var(--primary-color)] text-[var(--primary-color)]">
            <Bookmark
              width={15}
              height={15}
              className={`w-5 h-5 fill-transparent`}
            />
            Bookmark</Button>
          <Button className="p-5 w-1/2">Connect</Button>
        </div> */}
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
            heading="Company Details"
            scrollSection={tabs[0].path}
            setActiveTab={setActiveTab}
          />
          <AdvancedDetails companyData={companyDetails} />

          {/* <SectionHeading heading="Clients" /> */}

          {/* <CompanyClients /> */}

          <SectionHeading
            heading="Events"
            scrollSection={tabs[1].path}
            setActiveTab={setActiveTab}
          />

          <EventCalendar
            companyId={params.companyId}
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

export default CompanyDetail;
