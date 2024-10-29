import React, { useMemo } from 'react'
import styles from './randomtheme.style.module.css'

interface RandomThemeProps {
    uploadedPhoto: File;
}

const RandomTheme = ({uploadedPhoto} : RandomThemeProps) => {
    
    const items = useMemo(() => {
        return Array.from({ length: 50 }).map(() => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${20 + Math.random() * 10}s`,
            size: `${20 + Math.random() * 30}px`,
            rotate: `${Math.random() * 360}deg`,
            scale: `${0.5 + Math.random() * 1.5}`,
        }));
    }, []);
    return (
        <div className={styles.randomThemeContainer}>
            {items.map((item, index) => (
                <div
                    key={index}
                    className={styles.randomItem}
                    style={{
                        left: item.left,
                        top: item.top,
                        animationDelay: item.animationDelay,
                        animationDuration: item.animationDuration,
                        width: item.size,
                        height: item.size,
                        backgroundImage: `url(${URL.createObjectURL(uploadedPhoto)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transform: `rotate(${item.rotate}) scale(${item.scale})`,
                    }}
                />
            ))}
        </div>
    );
}

export default RandomTheme