import { EventTableType } from '@/types/ListViewTable';
import { ArrowUpRight } from 'geist-icons';
import Link from 'next/link';
import React,{useState, useEffect} from 'react'
interface SavedEvents{
        result:any,
        count: number,
    
}
interface SavedEventWidgetProps{
  savedEvents: { result: EventTableType[]; count: number } | undefined;
    redirectUrl:string
}
const SavedEventWidget = ({ savedEvents, redirectUrl }: SavedEventWidgetProps) => {
  console.log(savedEvents?.count);
  console.log(redirectUrl);

  return (
    redirectUrl.length > 0 ? (
      <Link 
        href={redirectUrl} 
        className="flex flex-col gap-2 border rounded-[12px] p-4 w-[100%] border-[var(--border-color)] bg-[var(--primary-foreground)]"
      >
        <EventContent savedEvents={savedEvents} />
      </Link>
    ) : (
      <div className="flex flex-col gap-2 border rounded-[12px] p-4 w-[100%] border-[var(--border-color)] bg-[var(--primary-foreground)]">
        <EventContent savedEvents={savedEvents} />
      </div>
    )
  );
};

const EventContent = ({ savedEvents }: { savedEvents: { result: EventTableType[]; count: number } | undefined }) => (
  <>
    <div className='flex items-center gap-2' style={{ color: "var(--primary-color)" }}>
      {savedEvents && savedEvents.count > 0 && (
        <div 
          className="flex items-center justify-center w-7 h-5 rounded-full font-medium text-sm" 
          style={{ backgroundColor: "var(--primary-light-color)" }}
        >
          {savedEvents?.count}
        </div>
      )}
      <div className='font-semibold'>Bookmarked Events</div>
    </div>
    {savedEvents && savedEvents.count > 0 ? (
      savedEvents?.result?.map((item: any) => (
        <div 
          className='flex p-2 flex-col border rounded gap-2' 
          style={{ border: "1px solid var(--border-color)" }} 
          key={item.id}
        >
          <div className='flex justify-between items-center w-[100%]'>
            <div className='text-[12px] font-semibold'>
              {item?.name?.length > 61 ? `${item.name.substring(0, 61)}...` : item?.name}
            </div>
            <ArrowUpRight width="16px" height='16px' color='var(--primary-color)' />
          </div>
          <div className="text-[12px]" style={{ color: "var(--secondary-text-color)" }}>
            {(item.location?.cityName && item.location?.countryName) ?
              (item.location.cityName !== item.location?.countryName ?
                item.location.cityName + ', ' + item.location?.countryName :
                item.location.countryName) :
              item.location.countryName}
          </div>
        </div>
      ))
    ) : (
      <div className='text-[var(--secondary-text-color)] text-sm'>
        Stay informed about the latest industry events and save them to stay updated on event updates.
      </div>
    )}
  </>
);

export default SavedEventWidget;