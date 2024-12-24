import React from 'react'
import styles from './style.module.css'
import { Button } from '@/components/ui/button';
import { MoveRight } from 'lucide-react';
import CoordinateScreenOne from './CoordinateScreenOne';
import CoordinateScreenTwo from './CoordinateScreenTwo';

const CoordinateContainer = () => {

    let container = "big";
    const isEmpty = true;

    return (
        <div className="bg-[var(--background-secondary-color)] border border-[var(--border-color)] rounded-[12px] max-w-[471px]">
            {container === "small" ? <CoordinateScreenOne /> : <CoordinateScreenTwo/>}
        </div>
    )
}

export default CoordinateContainer
