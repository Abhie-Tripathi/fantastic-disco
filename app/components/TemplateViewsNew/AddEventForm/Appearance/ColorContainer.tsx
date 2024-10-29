import React, { useEffect, useState } from 'react'
import styles from './colors.style.module.css'
import { SketchPicker } from 'react-color';
import { baseUrl, useTheme } from '@/context';
import useOutsideClick from '@/hooks/useOutsideClick';
import { myFetch } from '@/utils/myFetch';

interface Props {
    setUploadedPhoto : (value : File | undefined) => void
    setSnowTheme: (value: boolean) => void
    setLeavesTheme: (value: boolean) => void
    confettiType: string;
    setFormTheme: (value: string) => void
    pageBgColor: string;
    setPageBgColor: (value: string) => void
    setPageGradient: (value: string) => void
    setConfettiType: (value: string) => void
}

const ColorContainer = ({ setUploadedPhoto,setSnowTheme, setLeavesTheme, confettiType, setPageBgColor, pageBgColor, setPageGradient, setConfettiType, setFormTheme }: Props) => {
    const { theme } = useTheme()

    const [selectedTheme, setSelectedTheme] = useState<string>("")
    const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false)
    const [extractedColors, setExtractedColors] = useState<string[]>(["#843DF8", "#424FDF", "#1A56F3", "#3097F5", "#0785A2"])
    const colorPickerRef = useOutsideClick(() => setDisplayColorPicker(false));
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const [color, setColor] = useState('#2c68f6');
    const clickable = true
    const handleChange = (color: any) => {
        const colorWithOpacity = addOpacityToHex(color.hex, 0.1); // 0.1 for 10% opacity
        setPageBgColor(colorWithOpacity);
        setPageGradient("")
    }
    const handleColorClick = (color: any, index: any, theme: string, formTheme: string) => {
        setFormTheme(formTheme)
        if (theme === "minimal") {
            setSelectedColorIndex(index)
            const colorWithOpacity = addOpacityToHex(color, 0.1); // 0.1 for 10% opacity
            setPageBgColor(colorWithOpacity);
            setPageGradient("")
        } else if (theme === "gradient") {
            setPageBgColor("")
            setPageGradient(color)
        }
    }
    const addOpacityToHex = (hexColor: string, opacity: number) => {
        // Remove the '#' if it's there
        const cleanHex = hexColor.replace("#", "");

        // Convert the opacity percentage (0 to 1) to a 2-digit hex value
        const alphaHex = Math.round(opacity * 255).toString(16).padStart(2, "0");

        // Append the opacity to the hex color
        return `#${cleanHex}${alphaHex}`;
    }


    // const hexToRgba = (hex: string, opacity: number) => {
    //     let r = 0, g = 0, b = 0;

    //     // 3 digits
    //     if (hex.length === 4) {
    //         r = parseInt(hex[1] + hex[1], 16);
    //         g = parseInt(hex[2] + hex[2], 16);
    //         b = parseInt(hex[3] + hex[3], 16);

    //         // 6 digits
    //     } else if (hex.length === 7) {
    //         r = parseInt(hex[1] + hex[2], 16);
    //         g = parseInt(hex[3] + hex[4], 16);
    //         b = parseInt(hex[5] + hex[6], 16);
    //     }

    //     return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    // }

    const rgbToHex = (r: number, g: number, b: number) => {
        const componentToHex = (c: number) => {
            const hex = c.toString(16);
            return hex.length === 1 ? `0${hex}` : hex;
        };

        return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
    };

    const formatColor = (color: string) => {
        if (color.startsWith("rgb")) {
            const rgb = color.match(/\d+/g);
            if (rgb) {
                return rgbToHex(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]));
            }
        }
        return color;
    };

    const fetchBrandkit = async () => {
        const { data, error } = await myFetch(`${baseUrl}/kit`)
        if (error) {
            console.error('Error fetching brand kit:', error);
            return;
        }

        const cleanedFonts: string[] = Array.from(new Set(data.fontFamily.map((font: string) => font.trim().replace(/['"]+/g, ''))));
        setExtractedColors(data.color)
    }

    useEffect(() => {
        fetchBrandkit()
    }, [])

    useEffect(() => {
        if (clickable) {
            setColor(extractedColors[selectedColorIndex]);
        }
    }, [selectedColorIndex])

    const handleEffectClick = (type: string) => {
        if (type === "leaf") {
            setLeavesTheme(true)
            setConfettiType("")
            setSnowTheme(false)
        } else if (type === "snow") {
            setSnowTheme(true)
            setConfettiType("")
            setLeavesTheme(false)
        }
        else {
            setConfettiType(type)
            setLeavesTheme(false)
            setSnowTheme(false)
        }
        setUploadedPhoto(undefined)
    }
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfettiType("")
        setLeavesTheme(false)
        setSnowTheme(false)
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setUploadedPhoto(file)
        }
      };
    const formattedPageBgColor = formatColor(pageBgColor);
    return (
        <div className={styles.body}>
            <div className={styles.header}>
                <ColorIcon color={theme === "light" ? "black" : "white"} />
                <span>THEMES</span>
            </div>
            <div className={styles.editContainer} >
                <div className={`${styles.bgContainer} ${theme == "light" ? styles.bgLightContainer : styles.bgDarkContainer}`} onClick={() => setSelectedTheme("minimal")}><PaintIcon /> <span>Minimal</span></div>
                {selectedTheme === "minimal" && <div className={styles.minimalThemeContainer}>
                    <div className={styles.colorPickerContainer} style={{ backgroundColor: theme === "light" ? "#f2f2f2" : "#1a1a1a" }}>
                        <span>{formattedPageBgColor}</span>
                        {displayColorPicker && <div ref={colorPickerRef} className={styles.sketchPicker}>
                            <SketchPicker
                                color={pageBgColor}
                                onChange={handleChange}
                                presetColors={extractedColors}
                            /></div>}
                    </div>
                    <div className={styles.extractedColors}>
                        <div className={styles.colorList}>
                            {extractedColors.map((color, key) => (
                                <div
                                    key={key}
                                    className={`${styles.extractedColorOutter} ${key === selectedColorIndex ? styles.activeColor : ''}`}
                                    style={{
                                        backgroundColor: key === selectedColorIndex ? 'transparent' : color,
                                        borderColor: key === selectedColorIndex ? color : 'transparent',
                                    }}
                                    onClick={() => handleColorClick(color, key, "minimal", "light")}
                                >
                                    {key === selectedColorIndex && (
                                        <div className={styles.extractedColorInner} style={{ backgroundColor: color }}></div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className={styles.plusIconOuter} style={{ borderColor: pageBgColor }} onClick={() => setDisplayColorPicker(!displayColorPicker)}>
                            <PlusIcon />
                        </div>
                    </div>
                </div>}
                <div className={`${styles.bgContainer} ${theme == "light" ? styles.bgLightContainer : styles.bgDarkContainer}`} onClick={() => setSelectedTheme("gradient")}><PaintIcon /> <span>Light Gradient</span></div>
                {selectedTheme === "gradient" && <div className={styles.gradientThemeContainer}>
                    <div onClick={() => handleColorClick("greenmint", 0, "gradient", "light")} className={styles.gradientCircle} style={{ background: 'linear-gradient(273deg, rgba(228,202,246,1) 0%, rgba(220,255,180,1) 0%, rgba(197,231,207,1) 52%, rgba(169,231,224,1) 93%)' }}></div>
                    <div onClick={() => handleColorClick("candy", 0, "gradient", "light")} className={styles.gradientCircle} style={{ background: 'radial-gradient(circle, rgba(228,202,246,1) 0%, rgba(240,194,206,1) 0%, rgba(252,206,210,1) 46%, rgba(246,186,239,1) 93%)' }}></div>
                    <div onClick={() => handleColorClick("orange", 0, "gradient", "light")} className={styles.gradientCircle} style={{ background: 'radial-gradient(circle, rgba(228,202,246,1) 0%, rgba(255,196,147,1) 0%, rgba(255,168,122,1) 46%, rgba(235,205,171,1) 93%)' }}></div>
                    <div onClick={() => handleColorClick("purblue", 0, "gradient", "light")} className={styles.gradientCircle} style={{ background: 'radial-gradient(circle, rgba(149,166,251,1) 0%, rgba(152,169,214,1) 25%, rgba(129,159,201,1) 52%, rgba(173,155,197,1) 78%, rgba(254,152,173,1) 100%)' }}></div>
                    <div onClick={() => handleColorClick("watermelon", 0, "gradient", "light")} className={styles.gradientCircle} style={{ background: 'linear-gradient(90deg, rgba(228, 202, 246, 1) 0%, rgba(246, 223, 255, 1) 0%, rgba(246, 177, 177, 1) 49%, rgba(193, 249, 227, 1) 100%)' }}></div>
                </div>}
                <div className={`${styles.bgContainer} ${theme == "light" ? styles.bgLightContainer : styles.bgDarkContainer}`} onClick={() => setSelectedTheme("darkgradient")}><PaintIcon /> <span>Dark Gradient</span></div>
                {selectedTheme === "darkgradient" && <div className={styles.gradientThemeContainer}>
                    <div onClick={() => handleColorClick("darkgreenmint", 0, "gradient", "dark")} className={styles.gradientCircle} style={{ background: 'linear-gradient(273deg, rgba(228,202,246,1) 0%, rgba(143,186,93,1) 0%, rgba(131,193,148,1) 52%, rgba(121,182,176,1) 93%)' }}></div>
                    <div onClick={() => handleColorClick("darkcandy", 0, "gradient", "dark")} className={styles.gradientCircle} style={{ background: 'radial-gradient(circle, rgba(228,202,246,1) 0%, rgba(240,143,168,1) 0%, rgba(201,133,138,1) 46%, rgba(191,142,186,1) 93%)' }}></div>
                    <div onClick={() => handleColorClick("darkorange", 0, "gradient", "dark")} className={styles.gradientCircle} style={{ background: 'radial-gradient(circle, rgba(228,202,246,1) 0%, rgba(189,132,85,1) 0%, rgba(190,101,53,1) 46%, rgba(221,169,111,1) 93%)' }}></div>
                    <div onClick={() => handleColorClick("darkpurblue", 0, "gradient", "dark")} className={styles.gradientCircle} style={{ background: 'radial-gradient(circle, rgba(89,114,241,1) 0%, rgba(92,131,235,1) 25%, rgba(111,137,173,1) 52%, rgba(173,155,197,1) 78%, rgba(186,114,129,1) 100%)' }}></div>
                    <div onClick={() => handleColorClick("darkwatermelon", 0, "gradient", "dark")} className={styles.gradientCircle} style={{ background: 'linear-gradient(90deg, rgba(228,202,246,1) 0%, rgba(194,150,212,1) 0%, rgba(200,117,117,1) 49%, rgba(130,199,172,1) 100%)' }}></div>
                    <div onClick={() => handleColorClick("darkmix", 0, "gradient", "dark")} className={styles.gradientCircle} style={{ background: 'radial-gradient(circle, rgba(228,202,246,1) 0%, rgba(62,54,65,1) 0%, rgba(56,45,54,1) 27%, rgba(73,69,69,1) 67%, rgba(24,45,37,1) 100%)' }}></div>
                </div>}
                <div className={`${styles.bgContainer} ${theme == "light" ? styles.bgLightContainer : styles.bgDarkContainer}`} onClick={() => setSelectedTheme("effects")}><PaintIcon /><span>Effects</span></div>

                {selectedTheme === "effects" &&
                    <div className={styles.effectsContainer}>
                        <div className={`${styles.themeContainer} ${styles.leafThemeContainer}`} onClick={() => handleEffectClick("")}>
                            <span>None</span>
                        </div>
                        <div className={styles.themeContainer} onClick={() => handleEffectClick("party")}>
                            <span>Confetti</span>
                            {/* <div className={styles.dropDownContainer} onClick={() => setConfettiDropdown(!confettiDropdown)}>
                                <span>{confettiType === "" ? "None" : confettiType.toUpperCase()}</span>
                                <DownArrow />
                                {confettiDropdown && <div className={styles.confettiDropdown}>
      
                                    <div onClick={() => handleEffectClick("party")}>Party</div>
                                    <div onClick={() => handleEffectClick("circle")}>Circle</div>
                                    <div onClick={() => handleEffectClick("star")}>Star</div>
                                </div>}
                            </div> */}
                        </div>
                        <div className={`${styles.themeContainer} ${styles.leafThemeContainer}`} onClick={() => handleEffectClick("leaf")}>
                            <span>Leaves</span>
                        </div>
                        <div className={`${styles.themeContainer} ${styles.leafThemeContainer}`} onClick={() => handleEffectClick("snow")}>
                            <span>Snowfall</span>
                        </div>
                        <label className={`${styles.themeContainer} ${styles.leafThemeContainer}`} htmlFor='upload'>
                            <span>Upload</span>
                        </label>
                        <input onChange={handleFileChange} accept="image/*" style={{ display: "none" }} type="file" name="" id="upload" />
                    </div>
                }
            </div>
        </div >
    )
}

export default ColorContainer

interface IconProps {
    color: string;
}

function ColorIcon({ color }: IconProps) {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.85627 0.333984C8.90568 0.333984 11.3786 2.53075 11.3786 5.24275C11.3778 6.0562 11.0543 6.83613 10.4791 7.41128C9.90382 7.98643 9.12384 8.30979 8.31038 8.31038H7.2247C6.71554 8.31038 6.30413 8.72179 6.30413 9.23094C6.30413 9.46398 6.39635 9.6788 6.53717 9.83839C6.68462 10.0041 6.77684 10.2189 6.77684 10.458C6.77684 10.9677 6.35328 11.3786 5.85627 11.3786C2.80686 11.3786 0.333984 8.90568 0.333984 5.85627C0.333984 2.80686 2.80686 0.333984 5.85627 0.333984ZM5.19967 9.23094C5.19945 8.96495 5.25168 8.70153 5.35337 8.45574C5.45506 8.20996 5.60422 7.98663 5.7923 7.79855C5.98039 7.61047 6.20371 7.46131 6.44949 7.35962C6.69528 7.25793 6.9587 7.2057 7.2247 7.20592H8.31038C8.83082 7.20534 9.32979 6.99841 9.69791 6.6305C10.066 6.2626 10.2732 5.76374 10.2741 5.2433C10.2741 3.17189 8.32363 1.43844 5.85627 1.43844C4.71624 1.4374 3.61994 1.87711 2.79658 2.66563C1.97323 3.45416 1.48657 4.53044 1.43836 5.66946C1.39016 6.80847 1.78413 7.92203 2.53791 8.7773C3.29169 9.63258 4.34692 10.1633 5.48297 10.2586C5.29811 9.94787 5.20026 9.59254 5.19967 9.23094ZM3.37124 5.85627C3.15155 5.85627 2.94086 5.769 2.78552 5.61366C2.63017 5.45831 2.5429 5.24762 2.5429 5.02793C2.5429 4.80824 2.63017 4.59755 2.78552 4.4422C2.94086 4.28686 3.15155 4.19959 3.37124 4.19959C3.59093 4.19959 3.80163 4.28686 3.95697 4.4422C4.11231 4.59755 4.19959 4.80824 4.19959 5.02793C4.19959 5.24762 4.11231 5.45831 3.95697 5.61366C3.80163 5.769 3.59093 5.85627 3.37124 5.85627ZM8.3413 5.85627C8.12161 5.85627 7.91092 5.769 7.75557 5.61366C7.60023 5.45831 7.51296 5.24762 7.51296 5.02793C7.51296 4.80824 7.60023 4.59755 7.75557 4.4422C7.91092 4.28686 8.12161 4.19959 8.3413 4.19959C8.56099 4.19959 8.77168 4.28686 8.92703 4.4422C9.08237 4.59755 9.16965 4.80824 9.16965 5.02793C9.16965 5.24762 9.08237 5.45831 8.92703 5.61366C8.77168 5.769 8.56099 5.85627 8.3413 5.85627ZM5.85627 4.19959C5.63658 4.19959 5.42589 4.11231 5.27055 3.95697C5.1152 3.80163 5.02793 3.59093 5.02793 3.37124C5.02793 3.15155 5.1152 2.94086 5.27055 2.78552C5.42589 2.63017 5.63658 2.5429 5.85627 2.5429C6.07596 2.5429 6.28665 2.63017 6.442 2.78552C6.59734 2.94086 6.68462 3.15155 6.68462 3.37124C6.68462 3.59093 6.59734 3.80163 6.442 3.95697C6.28665 4.11231 6.07596 4.19959 5.85627 4.19959Z" fill={color} />
        </svg>
    )
}
function PaintIcon() {
    return (
        <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.2499 8.625C12.2499 8.625 10.7499 10.2525 10.7499 11.25C10.7499 11.6478 10.908 12.0294 11.1893 12.3107C11.4706 12.592 11.8521 12.75 12.2499 12.75C12.6477 12.75 13.0293 12.592 13.3106 12.3107C13.5919 12.0294 13.7499 11.6478 13.7499 11.25C13.7499 10.2525 12.2499 8.625 12.2499 8.625ZM1.90742 7.5L5.49992 3.9075L9.09242 7.5M10.4199 6.705L3.71492 0L2.65742 1.0575L4.44242 2.8425L0.579922 6.705C0.137422 7.125 0.137422 7.8525 0.579922 8.295L4.70492 12.42C4.92242 12.6375 5.21492 12.75 5.49992 12.75C5.78492 12.75 6.07742 12.6375 6.29492 12.42L10.4199 8.295C10.8624 7.8525 10.8624 7.125 10.4199 6.705Z" fill="#7D7D7D" />
        </svg>
    )
}

function PlusIcon() {
    return (
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.221 5.16439H5.25814V8.12725C5.25814 8.45316 4.99149 8.71982 4.66557 8.71982C4.33966 8.71982 4.073 8.45316 4.073 8.12725V5.16439H1.11015C0.784235 5.16439 0.517578 4.89774 0.517578 4.57182C0.517578 4.24591 0.784235 3.97925 1.11015 3.97925H4.073V1.0164C4.073 0.690485 4.33966 0.423828 4.66557 0.423828C4.99149 0.423828 5.25814 0.690485 5.25814 1.0164V3.97925H8.221C8.54691 3.97925 8.81357 4.24591 8.81357 4.57182C8.81357 4.89774 8.54691 5.16439 8.221 5.16439Z" fill="black" />
        </svg>

    )
}
function DownArrow() {
    return (
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.47124 5.47026C5.34622 5.59524 5.17668 5.66545 4.9999 5.66545C4.82313 5.66545 4.65359 5.59524 4.52857 5.47026L0.757237 1.69893C0.693563 1.63743 0.642775 1.56387 0.607836 1.48253C0.572896 1.40119 0.554505 1.31371 0.553736 1.22519C0.552967 1.13667 0.569835 1.04889 0.603355 0.966957C0.636876 0.885027 0.686378 0.810592 0.748973 0.747996C0.811568 0.685401 0.886003 0.635899 0.967934 0.602379C1.04986 0.568858 1.13765 0.55199 1.22617 0.55276C1.31469 0.553529 1.40217 0.57192 1.48351 0.606859C1.56484 0.641798 1.63841 0.692586 1.6999 0.75626L4.9999 4.05626L8.2999 0.75626C8.42564 0.634821 8.59404 0.567625 8.76884 0.569144C8.94363 0.570663 9.11084 0.640775 9.23445 0.76438C9.35805 0.887986 9.42817 1.05519 9.42969 1.22999C9.43121 1.40479 9.36401 1.57319 9.24257 1.69893L5.47124 5.47026Z" fill="currentColor" />
        </svg>

    )
}