import React from 'react'
import { Button } from '@/components/ui/button';
import { MoveRight } from 'lucide-react';
import CoordinateScreenOne from './CoordinateScreenOne';
import CoordinateScreenTwo from './CoordinateScreenTwo';

interface Props{
    height : string;
    theme: string | null
    coordinateData :{heading : string, value : number}[]
    // values : 
}

const CoordinateContainer = ({height, theme, coordinateData} :Props) => {

    // const values = [{ heading: "Attending", value: 0 },
    // { heading: "Sponsors", value:2 },
    // { heading: "Speakers", value: 0 },
    // { heading: "Exhibitor", value: 0 },
    // ]

    // let container = "small";

    return (
        <div className={`border border-[var(--border-color)] rounded-[12px] overflow-hidden
        `}>
            {height === "small" ? <CoordinateScreenOne theme={theme} values={coordinateData}/> : <CoordinateScreenTwo values={coordinateData}/>}
        </div>
    )
}

export default CoordinateContainer
