import React from 'react'
import styles from './style.module.css'
import { Button } from '@/components/ui/button';
import { MoveRight } from 'lucide-react';
import CoordinateScreenOne from './CoordinateScreenOne';
import CoordinateScreenTwo from './CoordinateScreenTwo';

interface Props{
    height : string;
    theme: string | null
    // values : {heading : string, value : number}[]
}

const CoordinateContainer = ({height, theme} :Props) => {

    const values = [{ heading: "Attending", value: 0 },
    { heading: "Sponsors", value:1 },
    { heading: "Speakers", value: 0 },
    { heading: "Exhibitor", value: 0 },
    ]

    // let container = "small";

    return (
        <div className={`border border-[var(--border-color)] rounded-[12px] overflow-hidden
        `}>
            {height === "small" ? <CoordinateScreenOne theme={theme} values={values}/> : <CoordinateScreenTwo values={values}/>}
        </div>
    )
}

export default CoordinateContainer
