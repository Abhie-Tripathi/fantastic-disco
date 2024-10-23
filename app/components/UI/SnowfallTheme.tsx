import React, { useMemo } from 'react'
import styles from './snowfall.style.module.css'

const SnowfallTheme = () => {
    const snowflakes = useMemo(() => {
        return Array.from({ length: 150 }).map(() => ({
            left: `${Math.random() * 100}%`, // Random horizontal position
            animationDelay: `${Math.random() * 5}s`, // Random delay before animation starts
            animationDuration: `${5 + Math.random() * 10}s`, // Random duration for the falling animation
            size: `${3 + Math.random() * 4}px`, 
            opacity: Math.random() * 0.5 + 0.5, // Random opacity for a more natural effect
        }));
    }, []); // This array is created once when the component mounts
    return (
        <div className={styles.snowfallContainer}>
            {snowflakes.map((flake, index) => (
                <div
                    key={index}
                    className={styles.snowflake}
                    style={{
                        left: flake.left,
                        animationDelay: flake.animationDelay,
                        animationDuration: flake.animationDuration,
                        width: flake.size,
                        height: flake.size,
                        opacity: flake.opacity,
                    }}
                />
            ))}
        </div>
    )
}

export default SnowfallTheme