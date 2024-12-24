import React from 'react'
import styles from './style.module.css'
import { Button } from '@/components/ui/button';
import { MoveRight } from 'lucide-react';
import CoordinateScreenOne from './CoordinateScreenOne';
import CoordinateScreenTwo from './CoordinateScreenTwo';

const CoordinateContainer = () => {

    const values = [{ heading: "Attending", value: 1 },
    { heading: "Sponsors", value: 0 },
    { heading: "Speakers", value: 0 },
    { heading: "Exhibitor", value: 0 },
    ]

    let container = "small";

    return (
        <div className="bg-[var(--background-secondary-color)] border border-[var(--border-color)] rounded-[12px] max-w-[471px]">
            {container === "small" ? <CoordinateScreenOne values={values}/> : <CoordinateScreenTwo values={values}/>}
        </div>
    )
}

export default CoordinateContainer
