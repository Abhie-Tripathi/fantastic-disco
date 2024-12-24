import React from 'react'
import styles from './style.module.css'
import { Button } from '@/components/ui/button';
import { MoveRight } from 'lucide-react';
import CoordinateEmptyOne from './CoordinateEmptyOne';
import CoordinateEmptyTwo from './CoordinateEmptyTwo';

const CoordinateContainer = () => {

    const container = "small";
    const isEmpty = true;

    return (
        <div className="bg-[var(--background-secondary-color)] border border-[var(--border-color)] rounded-[12px] max-w-[471px]">
            {/* <div className={styles.body}> */}
            {container === "small" ? <CoordinateEmptyOne /> : <CoordinateEmptyTwo />}
        </div>
    )
}

export default CoordinateContainer
