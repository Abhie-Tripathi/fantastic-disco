import React from 'react'
import styles from './primarybutton.style.module.css'

interface ButtonProps {
    fontSize: string;
    padding: string;
    fontColor: string;
    buttonColor: string;
    borderRadius: string;
    borderColor: string;
    borderWidth: string;
}
const PrimaryButton: React.FC<ButtonProps> = ({
    fontSize,
    padding,
    fontColor,
    buttonColor,
    borderRadius,
    borderColor,
    borderWidth,
}) => {
    return (
        <button
            className={styles.button}
            style={{
                fontSize,
                padding,
                color: fontColor,
                backgroundColor: buttonColor,
                borderRadius,
                borderColor,
                borderWidth,
                borderStyle: 'solid',
            }}
        >
            Primary Button
        </button>
    );
};
export default PrimaryButton