import React from 'react'
import { baseUrl } from '@/constants'
import { myFetch } from '@/utils/myFetch'
import { notFound } from 'next/navigation';
import DetailPageComponent from '../components/DetailPage/DetailPageComponent'
// export const revalidate = 0;
interface EventProps {
    venue: string;
    latitude: number;
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

const Page = ({ venue, latitude, eventFont, longitude, pageBgColor, registerBtnText, registerMessage, registerBtnColor, speakerProfilesData, participationMessage, name, format, logoUrl, end_date, end_time, gmt_time,
    start_date, start_time, description, location_city, location_country, widgetId, eventId, hashtags,participationType }: EventProps) => {
    return (
        <DetailPageComponent
            hashtags={hashtags}
            venue={venue}
            latitude={latitude}
            bannerUrl={logoUrl}
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
const fetchData = async (widgetId : string,eventId: string) => {
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

        console.log("data is: ", data);
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
            eventFont: data.data.event.data.customizationData.eventFont,
            registerBtnColor: data.data.event.data.customizationData.registerBtnColor,
            registerBtnText: data.data.event.data.customizationData.registerBtnText,
            registerMessage: data.data.event.data.customizationData.registerMessage,
            speakerProfilesData: data.data.event.data.customizationData.speakerProfilesData,
            participationMessage: data.data.event.data.customizationData.participationMessage,
            venue: data.data.event.data.customizationData.venue,
            hashtags: data.data.event.data.customizationData.hashtags,
        };

        return event;
    } catch (error) {
        console.log("Error fetching data:", error);
        notFound(); // Handle the error by redirecting to a not found page or similar
    }
};
const DetailPage = async ({ searchParams }: { searchParams: {widgetId : string, eventId: string } }) => {
    const {widgetId, eventId } = searchParams;
    const data = await fetchData(widgetId,eventId);
    console.log("data is ,", data)
    return <Page {...data} eventId={eventId} widgetId={widgetId}/>;
};
export default DetailPage;

export async function generateMetadata({ searchParams }: { searchParams: {widgetId : string, eventId: string } }) {
    const {widgetId, eventId } = searchParams;
    const data = await fetchData(widgetId,eventId);

    // Check if data is valid, if not return 404 metadata
    if (!data || !data.name || !data.description || !data.logoUrl) {
        return {
            title: "404 - Not Found",
            description: "The page you are looking for does not exist.",
            openGraph: {
                title: "404 - Not Found",
                description: "The page you are looking for does not exist.",
                images: [], // You can include a default 404 image if desired
                url: `https://console.eventgeni.com/detailpage?eventId=${eventId}`,
                type: "website"
            },
        };
    }
    const { name, description, logoUrl } = data;
    return {
        title: name,
        description: description,
        openGraph: {
            title: name,
            description: description,
            images: [logoUrl],
            url: `https://console.eventgeni.com/detailpage?eventId=${eventId}`,
            type: "website"
        },
    };
}

//     const hashtags = await generateHashtags(eventName, description);
//     const { emailSubject, emailBody } = await generateEmailContent(eventName, description)