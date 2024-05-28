import React, { useState } from 'react'
import styles from './editmodal.style.module.css'
import EditableCard from './EditableCard'

const EditModal = () => {
    const [cardRadius, setCardRadius] = useState<number>(10);
    const [cardBgColor, setCardBgColor] = useState<string>('#ffffff');
    const [eventNameColor, setEventNameColor] = useState<string>('#000000');
    const [eventNameSize, setEventNameSize] = useState<number>(18);
    const [typeBgColor, setTypeBgColor] = useState<string>('#eeeeee');
    const [typeFontSize, setTypeFontSize] = useState<number>(14);
    const [dateLocationColor, setDateLocationColor] = useState<string>('#333333');
    const [btnBgColor, setBtnBgColor] = useState<string>('#0000ff');
    const [btnFontColor, setBtnFontColor] = useState<string>('#ffffff');
    const [btnBorderWidth, setBtnBorderWidth] = useState<number>(1);
    const [btnBorderColor, setBtnBorderColor] = useState<string>('#000000');
    const [btnRadius, setBtnRadius] = useState<number>(5);

    return (
        <div className={styles.body}>
            <div className={styles.editSettings}>
                <label>
                    Card Radius:
                    <input
                        type="range"    
                        min="0"
                        max="50"
                        value={cardRadius}
                        onChange={(e) => setCardRadius(Number(e.target.value))}
                    />
                    <span>{cardRadius}px</span>
                </label>
                <label>
                    Card Background Color:
                    <input
                        type="color"
                        value={cardBgColor}
                        onChange={(e) => setCardBgColor(e.target.value)}
                    />
                </label>
                <label>
                    Event Name Color:
                    <input
                        type="color"
                        value={eventNameColor}
                        onChange={(e) => setEventNameColor(e.target.value)}
                    />
                </label>
                <label>
                    Event Name Size:
                    <input
                        type="range"
                        min="10"
                        max="50"
                        value={eventNameSize}
                        onChange={(e) => setEventNameSize(Number(e.target.value))}
                    />
                    <span>{eventNameSize}px</span>
                </label>
                <label>
                    Type Background Color:
                    <input
                        type="color"
                        value={typeBgColor}
                        onChange={(e) => setTypeBgColor(e.target.value)}
                    />
                </label>
                <label>
                    Type Font Size:
                    <input
                        type="range"
                        min="10"
                        max="30"
                        value={typeFontSize}
                        onChange={(e) => setTypeFontSize(Number(e.target.value))}
                    />
                    <span>{typeFontSize}px</span>
                </label>
                <label>
                    Date and Location Color:
                    <input
                        type="color"
                        value={dateLocationColor}
                        onChange={(e) => setDateLocationColor(e.target.value)}
                    />
                </label>
                <label>
                    Button Background Color:
                    <input
                        type="color"
                        value={btnBgColor}
                        onChange={(e) => setBtnBgColor(e.target.value)}
                    />
                </label>
                <label>
                    Button Font Color:
                    <input
                        type="color"
                        value={btnFontColor}
                        onChange={(e) => setBtnFontColor(e.target.value)}
                    />
                </label>
                <label>
                    Button Border Width:
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={btnBorderWidth}
                        onChange={(e) => setBtnBorderWidth(Number(e.target.value))}
                    />
                    <span>{btnBorderWidth}px</span>
                </label>
                <label>
                    Button Border Color:
                    <input
                        type="color"
                        value={btnBorderColor}
                        onChange={(e) => setBtnBorderColor(e.target.value)}
                    />
                </label>
                <label>
                    Button Radius:
                    <input
                        type="range"
                        min="0"
                        max="30"
                        value={btnRadius}
                        onChange={(e) => setBtnRadius(Number(e.target.value))}
                    />
                    <span>{btnRadius}px</span>
                </label>
            </div>
            <div className={styles.editCard}>
                <EditableCard
                    cardRadius={cardRadius}
                    cardBgColor={cardBgColor}
                    eventNameColor={eventNameColor}
                    eventNameSize={eventNameSize}
                    typeBgColor={typeBgColor}
                    typeFontSize={typeFontSize}
                    dateLocationColor={dateLocationColor}
                    btnBgColor={btnBgColor}
                    btnFontColor={btnFontColor}
                    btnBorderWidth={btnBorderWidth}
                    btnBorderColor={btnBorderColor}
                    btnRadius={btnRadius}
                />
            </div>
        </div>
    )
}

export default EditModal