import React from 'react'
import LocationTemplate from "@/components/search/locationTemplate"
import DateRangeSelector from "@/components/search/dateRange";
import Image from 'next/image';
import Text from "@/components/new-ui/Text";
import cityStateCountry from "/public/entireCityCountry.svg";
import streetAddressRadius from "/public/streetAddressRadius.svg";
const TeliTemplates = ({type, isMandatory, refs}:any) => {
  return (
    <div className='flex justify-center w-full bg-[var(--background-secondary-color)] h-full p-5'>
       {type==="T_LOCATION" &&
       <div className='flex justify-between h-fit'>
    <div className="flex gap-2 flex-col border w-full md:w-[500px]" ref={refs.templateRef}>
      <LocationTemplate type={type} />
      </div>
      {/* <span
            className="border-2 border-[#ebebeb] rounded-2xl p-3 flex gap-2 flex-col h-[200px]"
          >
       <Image src={cityStateCountry} alt="GEO_JSON" />
            <div className="text-[var(--primary-color)] h-5 font-bold">Entire City, State, Country etc.</div>
            <Text size="small" color="secondary">
              Eg: Bangalore, Karnataka or India
            </Text>
      </span> */}
      </div>
    }
    {type==="T_VENUE" &&
    <div className='flex justify-between'>
    <div className="flex gap-2 flex-col border md:w-[500px]" ref={refs.templateRef}>
      <LocationTemplate type={type} isMandatory={isMandatory}/>
    </div>
     {/* <span
     className="border-2 border-[#ebebeb] rounded-2xl p-3 flex gap-2 flex-col items-start h-[200px]"
       
     >
       <Image src={streetAddressRadius} alt="LOCATION_ID" />
       <div className="text-[var(--primary-color)] h-5 font-bold">Street Address & Radius</div>
       <Text size="small" color="secondary">
         Eg: Stores, Hotels, Restaurants or Office
       </Text>
     </span> */}
     </div>
    }
    {type==="T_GEOTIME" &&

        <div className='flex justify-between w-[100%] gap-2'>
        <div className='flex gap-2 w-[100%] h-fit flex-col md:flex-row' ref={refs.templateRef}>
        <div className="flex gap-2 flex-col border w-[100%] md:w-[40%] h-auto">
        <LocationTemplate type={type}/>
      </div>
      <div className="flex justify-between gap-2 flex-col border w-[100%] md:w-[60%]">
        <DateRangeSelector type={type}/>
      </div>
      </div>
      {/* <span
     className="border-2 border-[#ebebeb] rounded-2xl p-3 flex gap-2 flex-col items-start h-[200px]"
       
     >
       <Image src={streetAddressRadius} alt="LOCATION_ID" />
       <div className="text-[var(--primary-color)] h-5 font-bold">Street Address & Radius</div>
       <Text size="small" color="secondary">
         Eg: Stores, Hotels, Restaurants or Office
       </Text>
     </span> */}
    </div>

    }
    </div>
  )
}

export default TeliTemplates;
