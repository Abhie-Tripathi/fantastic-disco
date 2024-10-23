import React from 'react'
import { baseUrl } from '@/constants'
import { notFound } from 'next/navigation';
import DetailPageComponent from '../../components/DetailPage/DetailPageComponent'
import { EventsType } from '@/types/alleventtype';
// export const revalidate = 0;
interface EventProps {
    venue: string;
    latitude: number;
    eventFont: string;
    longitude: number;
    pageBgColor: string;
    pageGradient: string;
    confettiType: string;
    leavesTheme: boolean;
    snowTheme: boolean;
    registerBtnText: string;
    registerMessage: string;
    registerBtnColor: string;
    speaker: any[];
    participationMessage: string;
    name: string;
    format: string;
    logoUrl: string;
    end_date: string;
    end_time: string;
    gmt_time: string;
    start_date: string;
    start_time: string;
    description: string;
    location_city: string;
    location_country: string;
    eventId: string;
    hashtags: string;
    participationType: string;
    parentName: string;
    parentId: string;
    childrenData: EventsType[]
    capacity: number;
    registration: boolean;
    approval: boolean;
    waitlisting: boolean;
    virtualLink: string;
}

const Page = ({snowTheme, venue, latitude, eventFont, longitude, pageBgColor, registerBtnText, registerMessage, registerBtnColor, speaker, participationMessage, name, format, logoUrl, end_date, end_time, gmt_time,
    start_date, start_time, description, location_city, location_country, eventId, hashtags, participationType, childrenData, parentName, parentId, capacity, registration, approval, waitlisting, pageGradient, confettiType, leavesTheme, virtualLink }: EventProps) => {
    return (
        <DetailPageComponent
            snowTheme={snowTheme}
            pageGradient={pageGradient}
            confettiType={confettiType}
            leavesTheme={leavesTheme}
            parentName={parentName}
            parentId={parentId}
            childrenData={childrenData}
            hashtags={hashtags}
            venue={venue}
            latitude={latitude}
            // bannerUrl={logoUrl}
            eventFont={eventFont}
            longitude={longitude}
            pageBgColor={pageBgColor}
            registerBtnText={registerBtnText}
            registerMessage={registerMessage}
            registerBtnColor={registerBtnColor}
            speaker={speaker}
            participationMessage={participationMessage}
            name={name}
            format={format}
            logoUrl={logoUrl}
            end_date={end_date}
            end_time={end_time}
            gmt_time={gmt_time}
            start_date={start_date}
            start_time={start_time}
            description={description}
            location_city={location_city}
            location_country={location_country}
            // widgetId={widgetId}
            eventId={eventId}
            participationType={participationType}
            capacity={capacity}
            registration={registration}
            approval={approval}
            waitlisting={waitlisting}
            virtualLink={virtualLink}
        />
    )
}
const fetchData = async (eventId: string) => {
    try {
        // Manually fetching data instead of using the myFetch hook
        const response = await fetch(`${baseUrl}/public/widget/${eventId}/event?ts=${Date.now()}`, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            },
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        // Check if data is valid
        if (data.data.length === 0) {
            console.log("Invalid widgetId or error encountered");
            notFound();
        }
        console.log("data is : ", data?.data?.event)
        console.log("children data is: ", data.data.event.data.children);
        const event = {
            eventId: data.data.event.id,
            name: data.data.event.name,
            format: data.data.event.data.format,
            logoUrl: data.data.event.data.logoUrl,
            end_date: data.data.event.data.end_date,
            end_time: data.data.event.data.end_time,
            gmt_time: data.data.event.data.gmt_time,
            latitude: data.data.event.data.latitude,
            longitude: data.data.event.data.longitude,
            start_date: data.data.event.data.start_date,
            start_time: data.data.event.data.start_time,
            description: data.data.event.data.description,
            location_city: data.data.event.data.location_city,
            location_country: data.data.event.data.location_country,
            participationType: data.data.event.data.participationType,
            pageBgColor: data.data.event.data.customizationData.pageBgColor,
            pageGradient: data.data.event.data.customizationData.pageGradient,
            confettiType: data.data.event.data.customizationData.confettiType,
            leavesTheme: data.data.event.data.customizationData.leavesTheme,
            snowTheme: data.data.event.data.customizationData.snowTheme,
            eventFont: data.data.event.data.customizationData.eventFont,
            registerBtnColor: data.data.event.data.customizationData.registerBtnColor,
            registerBtnText: data.data.event.data.customizationData.registerBtnText,
            registerMessage: data.data.event.data.customizationData.registerMessage,
            speaker: data.data.event.data.customizationData.speaker,
            participationMessage: data.data.event.data.customizationData.participationMessage,
            venue: data.data.event.data.customizationData.venue,
            hashtags: data.data.event.data.customizationData.hashtags,
            parentName: data.data.event.data.parentData ? data.data.event.data.parentData : data.data.event.parentInfo.name,
            // parentName : data.data.event.parentInfo ? data.data.event.parentInfo.name : data.data.event.data.parentData,
            parentId: data.data.event.parentInfo.id,
            capacity: data?.data?.event?.capacity,
            registration: data?.data?.event?.registration,
            approval: data?.data?.event?.approval,
            waitlisting: data?.data?.event?.waitlisting,
            virtualLink: data?.data?.event?.data?.virtualLink,
            childrenData: data.data.event.data.children.map((child: any) => ({
                eventId: child.id,
                name: child.name,
                format: child.data.format,
                logoUrl: child.data.logoUrl,
                endDate: child.data.end_date,
                endTime: child.data.end_time,
                gmtZone: child.data.gmt_time,
                latitude: child.data.latitude,
                longitude: child.data.longitude,
                startDate: child.data.start_date,
                startTime: child.data.start_time,
                description: child.data.description,
                cityName: child.data.location_city,
                countryName: child.data.location_country,
                participationType: child.data.participationType,
                customizationData: {
                    pageBgColor: child.data.customizationData.pageBgColor,
                    pageGradient: child.data.customizationData.pageGradient,
                    confettiType: child.data.customizationData.confettiType,
                    leavesTheme: child.data.customizationData.leavesTheme,
                    snowTheme: child.data.customizationData.snowTheme,
                    eventFont: child.data.customizationData.eventFont,
                    registerBtnColor: child.data.customizationData.registerBtnColor,
                    registerBtnText: child.data.customizationData.registerBtnText,
                    registerMessage: child.data.customizationData.registerMessage,
                    speaker: child.data.customizationData.speaker,
                    participationMessage: child.data.customizationData.participationMessage,
                    venue: child.data.customizationData.venue,
                    hashtags: child.data.customizationData.hashtags,
                    boothNumber: child.data.customizationData.boothNumber,
                    eventFormat: child.data.customizationData.eventFormat
                }
            }))
        };

        return event;
    } catch (error) {
        console.log("Error fetching data:", error);
        notFound(); // Handle the error by redirecting to a not found page or similar
    }
};

const DetailPage = async (context: any) => {
    const eventId = context.params.id;
    // const { widgetId, eventId } = decodeHash(hash as string);
    // console.log("widgetId : ", widgetId)
    const data = await fetchData(eventId);
    console.log("data_new", data)
    return <Page {...data} eventId={eventId} />;
};
export default DetailPage;

function stripHtmlTags(inputString: string) {
    return inputString.replace(/<[^>]*>?/gm, '');
}
const console_url = process.env.NEXT_PUBLIC_CONSOLE_PAGE_DOMAIN
export async function generateMetadata(context: any) {
    const eventId = context.params.id;
    const data = await fetchData(eventId);

    // Check if data is valid, if not return 404 metadata
    if (!data || !data.name || !data.description || !data.logoUrl) {
        return {
            title: "404 - Not Found",
            description: "The page you are looking for does not exist.",
            openGraph: {
                title: "404 - Not Found",
                description: "The page you are looking for does not exist.",
                images: [], // You can include a default 404 image if desired
                url: `${console_url}/detailpage/${eventId}`,
                type: "website"
            },
        };
    }
    const { name, description, logoUrl } = data;
    return {
        title: name,
        description: stripHtmlTags(description),
        openGraph: {
            title: name,
            description: stripHtmlTags(description),
            images: [logoUrl],
            url: `${console_url}/detailpage/${eventId}`,
            type: "website"
        },
    };
}

//     const hashtags = await generateHashtags(eventName, description);
//     const { emailSubject, emailBody } = await generateEmailContent(eventName, description)