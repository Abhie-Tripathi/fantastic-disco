'use client'
import React, { useState } from 'react'
import styles from './registerform.style.module.css'
import { baseUrl } from '@/constants'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Props {
    registerMessage: string
    registerBtnText: string
    registerBtnColor: string
    // widgetId: string;
    eventId: string;
    setRegisterSuccess : (value : boolean)=>void
}

const RegisterForm = ({ registerMessage, registerBtnText, registerBtnColor, eventId,setRegisterSuccess }: Props) => {
    const [formData, setFormData] = useState({ firstname: '', lastname: '', email: '' });
    const [emailError, setEmailError] = useState<string | null>(null);
    // Function to convert hex to RGB
    const hexToRgb = (hex: string) => {
        const cleanHex = hex.replace('#', '');
        const bigint = parseInt(cleanHex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b };
    };

    // Function to calculate brightness
    const calculateBrightness = ({ r, g, b }: { r: number, g: number, b: number }) => {
        return (r * 299 + g * 587 + b * 114) / 1000;
    };

    // Determine if the button color is dark or light
    const rgb = hexToRgb(registerBtnColor);
    const brightness = calculateBrightness(rgb);
    const fontColor = brightness > 155 ? '#000000' : '#FFFFFF';
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            email: formData.email,
            firstname: formData.firstname,
            lastname: formData.lastname,
            eventId: eventId,
            interest: "ATTENDEE",
            note: "intend",
            source: "eventgeni",
            // sorceId: widgetId,
        };

        try {
            const response = await fetch(`${baseUrl}/intend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Success:', data);
                setRegisterSuccess(true)
                // toast.success("successfully registred for the event !");
            } else {
                console.error('Error:', response.statusText);
                // toast.error("Error in registration");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <div className={styles.registerContainer} >
            {/* <ToastContainer /> */}
            <div className={styles.header}>
                <div>Join us at the event</div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className={styles.formSubHeading}>{registerMessage}</div>
                <input
                    className={styles.inputField}
                    type="text"
                    name="firstname"
                    placeholder="First Name"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                />
                <input
                    className={styles.inputField}
                    type="text"
                    name="lastname"
                    placeholder="Last Name"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                />
                <input
                    className={styles.inputField}
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <button
                    type="submit"
                    style={{ backgroundColor: registerBtnColor, color: fontColor }}
                    className={styles.submitBtn}
                >
                    {registerBtnText}
                </button>
            </form>
        </div>
    )
}

export default RegisterForm