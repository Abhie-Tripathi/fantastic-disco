import React, { useEffect, useState } from 'react'
import styles from './toggleBtn.style.module.css'

interface ToggleBtnProps {
    isTrue: boolean;
}

const ToggleBtn: React.FC<ToggleBtnProps> = ({ isTrue }) => {
    const [True, setIsTrue] = useState<boolean>(false);

    useEffect(() => {
        setIsTrue(isTrue);
    }, [isTrue]);

    return (
        <span>
            <label className="w-[30px] h-[17px] relative inline-block">
                <input
                    type="checkbox"
                    defaultChecked
                    disabled
                    className="w-[0] h-[0] opacity-0"
                />
                <span className={`${True ? styles.sliderBranded : styles.slider}`}></span>
            </label>
        </span>
    );
};

export default ToggleBtn;
