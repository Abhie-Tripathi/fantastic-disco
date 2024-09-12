import React from 'react'
import { baseUrl } from '@/constants'
import { myFetch } from '@/utils/myFetch'
import { notFound } from 'next/navigation';
import DetailPageComponent from '../components/DetailPage/DetailPageComponent'

interface EventProps {
    venue: string;
    latitude: number;
    bannerUrl: string;
    eventFont: string;
    longitude: number;
    pageBgColor: string;
    registerBtnText: string;
    registerMessage: string;
    registerBtnColor: string;
    speakerProfilesData: any[];
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
    widgetId: string;
    eventId: string;
    hashtags: string;
    participationType : string;
}

const Page = ({ venue, latitude, bannerUrl, eventFont, longitude, pageBgColor, registerBtnText, registerMessage, registerBtnColor, speakerProfilesData, participationMessage, name, format, logoUrl, end_date, end_time, gmt_time,
    start_date, start_time, description, location_city, location_country, widgetId, eventId, hashtags,participationType }: EventProps) => {
    return (
        <DetailPageComponent
            hashtags={hashtags}
            venue={venue}
            latitude={latitude}
            bannerUrl={bannerUrl}
            eventFont={eventFont}
            longitude={longitude}
            pageBgColor={pageBgColor}
            registerBtnText={registerBtnText}
            registerMessage={registerMessage}
            registerBtnColor={registerBtnColor}
            speakerProfilesData={speakerProfilesData}
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
            widgetId={widgetId}
            eventId={eventId}
            participationType={participationType}
        />
    )
}
const fetchData = async (widgetId: string, eventId: string) => {
    try {
        // Manually fetching data instead of using the myFetch hook
        const response = await fetch(`${baseUrl}/public/widget/${widgetId}`, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            },
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        // Check if data is valid
        if (!data || !data.data.widgetData || !data.data.widgetData.id) {
            console.log("Invalid widgetId or error encountered");
            notFound();
        }

        console.log("data is: ", data);
        console.log("Event data is :", data.data.eventData)
        console.log("event id is: ", eventId);

        // Find the event in otherdata or eventData
        const eventFromOtherData = data.data.widgetData.otherdata?.event.find((event: any) => event.id === eventId);
        const eventFromEventData = data.data.eventData?.find((event: any) => event.id === eventId);

        // If the event is not found in either dataset, return 404
        if (!eventFromOtherData && !eventFromEventData) {
            console.log("Invalid eventId");
            notFound();
        }

        // Merge event data from both sources
        const mergedEventData = {
            ...eventFromOtherData,
            ...eventFromEventData,
        };

        return mergedEventData;
    } catch (error) {
        console.log("Error fetching data:", error);
        notFound(); // Handle the error by redirecting to a not found page or similar
    }
};
const DetailPage = async ({ searchParams }: { searchParams: { widgetId: string; eventId: string } }) => {
    const { widgetId, eventId } = searchParams;
    const data = await fetchData(widgetId, eventId);
    console.log("data is ,", data)
    return <Page {...data} widgetId={widgetId} eventId={eventId} />;
};
export default DetailPage;

export async function generateMetadata({ searchParams }: { searchParams: { widgetId: string; eventId: string } }) {
    const { widgetId, eventId } = searchParams
    const data = await fetchData(widgetId, eventId);

    // Check if data is valid, if not return 404 metadata
    if (!data || !data.name || !data.description || !data.bannerUrl) {
        return {
            title: "404 - Not Found",
            description: "The page you are looking for does not exist.",
            openGraph: {
                title: "404 - Not Found",
                description: "The page you are looking for does not exist.",
                images: [], // You can include a default 404 image if desired
                url: `https://console.eventgeni.com/detailpage?widgetId=${widgetId}&eventId=${eventId}`,
                type: "website"
            },
        };
    }
    const { name, description, bannerUrl } = data;
    return {
        title: name,
        description: description,
        openGraph: {
            title: name,
            description: description,
            images: [bannerUrl],
            url: `https://console.eventgeni.com/detailpage?widgetId=${widgetId}&eventId=${eventId}`,
            type: "website"
        },
    };
}

//     const hashtags = await generateHashtags(eventName, description);
//     const { emailSubject, emailBody } = await generateEmailContent(eventName, description)