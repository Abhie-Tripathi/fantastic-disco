import React, { useMemo } from 'react'
import styles from './leaftheme.style.module.css'
import Image from 'next/image'
import LeafFour from '/public/widgetimages/leaf4.png'
import LeafFive from '/public/widgetimages/leaf5.png'
import LeafSix from '/public/widgetimages/leaf6.png'

interface Props{
    leafCount: number;
}

const LeafTheme = ({leafCount} : Props) => {
    // Generate the leaf properties once using useMemo
    const leaves = useMemo(() => {
        return Array.from({ length: leafCount }).map(() => ({
            // src: Math.random() > 0.5 ? LeafFour : LeafFive,
            src: Math.random() < 0.33 ? LeafFour : Math.random() < 0.5 ? LeafFive : LeafSix,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`,
            width: `${28 + Math.random() * 5}px`,
            height: `${28 + Math.random() * 5}px`,
        }));
    }, []); // The empty dependency array ensures this only runs once

    return (
        <div className={styles.leafContainer}>
            {leaves.map((leaf : any, index: number) => (
                <Image
                    key={index}
                    src={leaf.src}
                    className={styles.leaf}
                    alt={`Leaf ${index + 1}`}
                    style={{
                        left: leaf.left,
                        top: leaf.top,
                        animationDelay: leaf.animationDelay,
                        animationDuration: leaf.animationDuration,
                        width: leaf.width,
                        height: leaf.height,
                    }}
                />
            ))}
        </div>
    );
};

export default LeafTheme