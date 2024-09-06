import React, { use, useEffect, useState } from 'react'
import styles from './codewindow.style.module.css'
import CopyIcon from '/public/page.svg'
import Image from 'next/image'
import TickIcon from '/public/tick.svg'
import { useTheme } from '@/context'
import { baseUrl } from '@/constants';
import { myFetch } from '@/utils/myFetch'

interface Props {
    widgetType: string;
    widgetId: string;
}

const CodeWindow = ({ widgetType, widgetId }: Props) => {

    const [copyClick, setCopyClick] = useState(false) //To change the icon if the copy button is clicked
    const [addClicked, setAddClicked] = useState(false) //To change the icon if the copy button is clicked
    const [domains, setDomains] = useState<string[]>([]);
    const [enteredDomain, setEnteredDomain] = useState<string>("");

    useEffect(() => {
        fetchDomain()
    }, [])
    const fetchDomain = async () => {
        const { data, error } = await myFetch(`${baseUrl}/widget/${widgetId}`)
        setDomains(data.domain.split(","))
    }
    const getWidgetTag = (type: string) => {
        switch (type) {
            case 'Section':
                return 'section-widget';
            case 'Page':
                return 'page-widget';
            case 'Pop':
                return 'popup-widget';
            case 'StickyTop':
                return 'sticky-widget';
            default:
                return 'section-widget'; // Default case if widgetType is not one of the specified types
        }
    };
    const widgetTag = getWidgetTag(widgetType);

    const handleCopy = () => {
        setCopyClick(true);
        const widgetTag = getWidgetTag(widgetType);
        const textToCopy = `
            <script src='https://widget-webcomp-nolit.vercel.app/dist/eventgeni.js'></script>
            <${widgetTag} id="${widgetId}"></${widgetTag}>
        `;
        navigator.clipboard.writeText(textToCopy.trim());
    };
    const { theme } = useTheme();

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
        // Check if the entered domain is valid
        if (!urlPattern.test(enteredDomain)) {
            alert("Please enter a valid domain.");
            return;
        }
        // Check if the entered domain is already in the domains list
        if (domains.includes(enteredDomain)) {
            alert("This domain is already whitelisted.");
            return;
        }

        const updatedDomains = [...domains, enteredDomain];
        const formData = new FormData()
        formData.append("widgetId", widgetId)
        formData.append("domain", updatedDomains.join())
        const { data, error } = await myFetch(`${baseUrl}/widget`, {
            method: "POST",
            body: formData,
        })
        if (data) {
            console.log(data)
            setDomains(updatedDomains)
        }
        if (error) {
            console.log(error)
        }
        setEnteredDomain("")
        setAddClicked(false)
    }
    const handleDelete = async (domainToDelete: string) => {
        const updatedDomains = domains.filter(domain => domain !== domainToDelete);
        const formData = new FormData();
        formData.append("widgetId", widgetId);
        formData.append("domain", updatedDomains.join());
        const { data, error } = await myFetch(`${baseUrl}/widget`, {
            method: "POST",
            body: formData,
        });
        if (data) {
            setDomains(updatedDomains);
        }
        if (error) {
            console.log(error);
        }
    };

    return (
        <div className={styles.body}>
            <div className={styles.domainHeader}>Whitelist your Domain</div>
            <div className={styles.line}></div>
            <div className={styles.domainContainer}>
                <div className={styles.domainHeadingContainer}>
                    <div className={styles.iBtn}>i</div>
                    <div className={styles.heading}>Please enter your website host domain to whitelist it on our platform</div>
                </div>
                {domains.slice(0, 1).map((domain, key) => (
                    <div className={styles.inputContainer} key={key}>
                        <span style={{ backgroundColor: theme === "light" ? "#F2F2F2" : "#292929" }}>https://</span>
                        <input placeholder='Your Company' style={{ color: theme === "light" ? "black" : "white" }} value={domain} />
                    </div>
                ))}
                {domains.slice(1, 3).map((domain, key) => (
                    <div className={styles.input_deleteContainer} key={key}>
                        <div className={styles.inputContainer} >
                            <span style={{ backgroundColor: theme === "light" ? "#F2F2F2" : "#292929" }}>https://</span>
                            <input placeholder='Your Company' style={{ color: theme === "light" ? "black" : "white" }} value={domain} />
                        </div>
                        <div className={styles.deleteBtn} onClick={() => handleDelete(domain)}><DeleteIcon /></div>
                    </div>
                ))}
                {addClicked &&
                    <form className={styles.save_inputContainer} onSubmit={handleSave}>
                        <div className={styles.inputContainer}>
                            <span style={{ backgroundColor: theme === "light" ? "#F2F2F2" : "#292929" }}>https://</span>
                            <input placeholder='Your Company' onChange={(e) => setEnteredDomain(e.target.value)} required maxLength={40} style={{ color: theme === "light" ? "black" : "white" }} />
                        </div>
                        <div className={styles.btnContainer}>
                            <button className={styles.saveBtn} type='submit'>Save</button>
                            <button className={styles.cancelBtn} type='button' onClick={() => setAddClicked(false)}>Cancel</button>
                        </div>

                    </form>}
                {(!addClicked && domains.length < 3) && <div className={styles.addBtn} onClick={() => setAddClicked(true)}>+ Add Domain</div>}
            </div>
            <div className={styles.line}></div>
            <div className={styles.codeHeader}>
                <div className={styles.heading}>Widget Code</div>
                <button className={styles.copyBtn} onClick={handleCopy}>
                    {copyClick ? <Image src={TickIcon} alt='tick' width={16} height={18} /> : <Image src={CopyIcon} alt='copy' width={16} height={18} />}
                    <div>Copy Code</div>
                </button>
            </div>
            <div className={styles.line}></div>
            <div className={styles.codeContainer}>
                <div className={styles.codewindow} style={{ backgroundColor: theme == "light" ? "#FAFAFA" : "#1A1A1A" }}>
                    {`<script src='https://widget-webcomp-nolit.vercel.app/dist/eventgeni.js'></script>`}
                    <br />
                    {`<${widgetTag} id= "${widgetId}"></${widgetTag}>`}
                </div>
            </div>

        </div>
    )
}

export default CodeWindow
function DeleteIcon() {
    return (
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.5 3H9.5C9.5 2.60218 9.34196 2.22064 9.06066 1.93934C8.77936 1.65804 8.39782 1.5 8 1.5C7.60218 1.5 7.22064 1.65804 6.93934 1.93934C6.65804 2.22064 6.5 2.60218 6.5 3ZM5.5 3C5.5 2.33696 5.76339 1.70107 6.23223 1.23223C6.70107 0.763392 7.33696 0.5 8 0.5C8.66304 0.5 9.29893 0.763392 9.76777 1.23223C10.2366 1.70107 10.5 2.33696 10.5 3H15.5C15.6326 3 15.7598 3.05268 15.8536 3.14645C15.9473 3.24021 16 3.36739 16 3.5C16 3.63261 15.9473 3.75979 15.8536 3.85355C15.7598 3.94732 15.6326 4 15.5 4H14.446L13.252 14.344C13.1676 15.0752 12.8173 15.7498 12.2679 16.2396C11.7184 16.7293 11.008 16.9999 10.272 17H5.728C4.99195 16.9999 4.28161 16.7293 3.73214 16.2396C3.18266 15.7498 2.8324 15.0752 2.748 14.344L1.554 4H0.5C0.367392 4 0.240215 3.94732 0.146447 3.85355C0.0526785 3.75979 0 3.63261 0 3.5C0 3.36739 0.0526785 3.24021 0.146447 3.14645C0.240215 3.05268 0.367392 3 0.5 3H5.5ZM3.741 14.23C3.79743 14.7174 4.03105 15.167 4.39742 15.4934C4.76379 15.8198 5.23735 16.0001 5.728 16H10.272C10.7627 16.0001 11.2362 15.8198 11.6026 15.4934C11.969 15.167 12.2026 14.7174 12.259 14.23L13.439 4H2.561L3.741 14.23ZM6.5 6.5C6.63261 6.5 6.75979 6.55268 6.85355 6.64645C6.94732 6.74021 7 6.86739 7 7V13C7 13.1326 6.94732 13.2598 6.85355 13.3536C6.75979 13.4473 6.63261 13.5 6.5 13.5C6.36739 13.5 6.24021 13.4473 6.14645 13.3536C6.05268 13.2598 6 13.1326 6 13V7C6 6.86739 6.05268 6.74021 6.14645 6.64645C6.24021 6.55268 6.36739 6.5 6.5 6.5ZM10 7C10 6.86739 9.94732 6.74021 9.85355 6.64645C9.75979 6.55268 9.63261 6.5 9.5 6.5C9.36739 6.5 9.24021 6.55268 9.14645 6.64645C9.05268 6.74021 9 6.86739 9 7V13C9 13.1326 9.05268 13.2598 9.14645 13.3536C9.24021 13.4473 9.36739 13.5 9.5 13.5C9.63261 13.5 9.75979 13.4473 9.85355 13.3536C9.94732 13.2598 10 13.1326 10 13V7Z" fill="#DA2F35" />
        </svg>
    )
}