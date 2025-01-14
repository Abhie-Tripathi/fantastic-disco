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
import {
  categoryRank,
  countryCategoryRank,
  countryRank,
  Editions,
  Event,
  GTMEventDetail,
  TTabs,
} from "@/types/events";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Bookmark,
  CircleSlash,
  MailIcon,
  PhoneIcon,
} from "lucide-react";
// import { useEventsService } from "@/services/eventsService";
import { GTMEventPOCDetails } from "@/types/events";
import { Button } from "@/components/ui/button";
import { AdvancedDetails } from "@/app/components/prospectDetail/advancedDetails";
import { SectionHeading } from "@/app/components/prospectDetail/prospectHeading";
import { CompanyClients } from "@/app/components/prospectDetail/CompanyClients";
import { EventCalendar } from "@/app/components/prospectDetail/EventCalendar";
import companyDataJson from "@/public/data/companyData.json";

export interface RankingDetail {
  above5CountryEvent: countryRank[] | [];
  below5CountryEvent: countryRank[] | [];
  above5CategoryEvent: categoryRank[] | [];
  below5CategoryEvent: categoryRank[] | [];
  above5CountryCategoryRankEvent: countryCategoryRank[] | [];
  below5CountryCategoryEvent: countryCategoryRank[] | [];
}
const CompanyDetail = ({ params }: { params: { companyId: string } }) => {

  const [activeTab, setActiveTab] = useState<TTabs>("overview");
  const tabs = [
    { tabName: "Overview", path: "overview" },
    { tabName: "Events", path: "insights" },
  ];

  const getCompanyDetailById = (companyId: string) => {
    const c_data =  companyDataJson.data.filter((item: any) => item.url === companyId);
    if(c_data && c_data.length > 0)
      return c_data[0];
    else
      return [];
  }

  // const {
  //   getEventDetailById,
  //   getEventPOCDetails,
  // } = useEventsService();
  const { data: event } = useQuery<any>({
    queryKey: ["eventDetails"],
    queryFn: async () => {
      const [
        companyDataResult,
      ] = await Promise.allSettled([
        getCompanyDetailById(params.companyId),
      ]);
      const companyData = companyDataResult.status === "fulfilled" ? companyDataResult.value : null;
      return {
        companyDetails: companyData,
      };
    },
  });

  if (!event) return null;
  const {
    companyDetails,
  } = event;

  const handleScrollTo = (section: string) => {
    const element = document.querySelector(`.${section}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="p-6 pt-0">
      <aside className="fixed h-screen w-[24%] pb-24 bg-[var(--primary-foreground)] pt-6 pr-6 overflow-y-auto shadow-[3px_0px_5px_-5px] dark:border-r-2 dark:border-r-[var(--border-color)] max-xl:w-[30%]">
        <button className="flex items-center gap-2 pb-4 text-[#666666] text-sm">
          <ArrowLeft width="14px" height="14px" color="#6750A4" />
          <Link
            className="text-[var(--primary-color)] font-medium"
            href={"/internal/prospect"}
          >
            Back to Search
          </Link>
        </button>

        { companyDetails?.cdn_url &&
          <div className="flex bg-[#F8F8FA] dark:bg-[var(--heading-background-color)] rounded-md px-6 py-4">
            <Image
              src={companyDetails?.cdn_url}
              alt="eventLogo"
              className="flex h-20 w-20 rounded-xl shadow-lg"
              width={200}
              height={200}
            />
          </div>
        }

        {companyDetails?.name && (
          <Heading as="h6" variant="titleNoMargin" className="my-4">
            {companyDetails?.name}
          </Heading>
        )}

        <div className="flex gap-2 items-center w-fit my-4">
          <Location color="#666666" width="14px" height="14px" />
          <span className="text-[#6E6F89] text-sm">{companyDetails?.city}, {companyDetails?.country}</span>
        </div>

        <div className="flex gap-2 items-center w-fit my-4 flex-wrap">
          <Buildings color="#666666" width="14px" height="14px" />

          {companyDetails?.industries?.map((item: string) => (
            <span key={item} className="text-[var(--info-text-color)] dark:border-[#0D3868] bg-[var(--info-background-color)] font-semibold text-xs py-1 px-4 border-[#CCE6FF] border rounded-md whitespace-nowrap">
              {item}
            </span>
          ))}

          {/* <span className="text-[var(--info-text-color)] text-xs font-medium">
            +2 more
          </span> */}
        </div>

        <div className="text-[#707287] text-sm line-clamp-4 my-4">
          Platform that connects verified pharmacy and healthcare manufacturers
          with distributors, sellers, and retailers, to sell business franchises
          and take manufacturing orders. Nutrition products, derma, and
          cosmetic, ayurvedic, common disease medicines, medical equipment,
          pharmacy franchise, animal healthcare medicines, homeopathic, etc.
        </div>

        <div className="flex gap-4 my-6">
          <Linkedin color="#666666" className="cursor-pointer" />
          <LogoTwitterX color="#666666" className="cursor-pointer" />
          <Globe color="#666666" className="cursor-pointer" />
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
                {/* {eventPOCDetails.length > 0 && (
                  <span className="text-[12px] bg-[var(--primary-color)] text-white dark:text-[#131313] py-[1px] px-2 rounded-full">
                    {eventPOCDetails.filter((poc) => poc !== null).length > 0 &&
                    eventPOCDetails.filter((poc) => poc !== null).length < 9
                      ? `0${
                          eventPOCDetails.filter((poc) => poc !== null).length
                        }`
                      : eventPOCDetails.filter((poc) => poc !== null).length}
                  </span>
                )} */}
              </p>
            </AccordionTrigger>
            <AccordionContent
              className={`${
                companyDetails?.pocData?.length > 1 ? "h-36 overflow-y-auto" : "h-fit"
              } pb-1 overflow-x-hidden`}
            >
              {companyDetails?.pocData && companyDetails?.pocData.length > 0 ? (
                companyDetails?.pocData?.map((poc: GTMEventPOCDetails | null) => {
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

        <div className="flex gap-6 mt-4 justify-center">
          <Button variant="outline" className="p-5 w-1/2 border-[var(--primary-color)] text-[var(--primary-color)]">
            <Bookmark
              width={15}
              height={15}
              className={`w-5 h-5 fill-transparent`}
            />
            Bookmark</Button>
          <Button className="p-5 w-1/2">Connect</Button>
        </div>
      </aside>
      <div className="ml-auto w-[70%] max-xl:w-[62%]">
        <ul className="flex flex-row gap-12 justify-between mb-4 z-10 bg-white dark:bg-[var(--heading-background-color)] shadow-md pt-3 items-end w-full">
          <div className="flex gap-12">
            {tabs
              .map((tab) => (
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

        <section className="flex flex-col gap-6 pb-6 h-[calc(100vh-150px)] mt-5 w-full pr-4 overflow-y-auto scroll-smooth">
          <SectionHeading
            heading="Company Details"
            scrollSection={tabs[0].path}
            setActiveTab={setActiveTab}
          />
          <AdvancedDetails
            eventId={params.companyId}
          />

          <SectionHeading heading="Clients" />

          <CompanyClients />

          <SectionHeading
            heading="Events"
            scrollSection={tabs[1].path}
            setActiveTab={setActiveTab}
          />

          <EventCalendar />
        </section>
      </div>
    </div>
  );
};

export default CompanyDetail;
