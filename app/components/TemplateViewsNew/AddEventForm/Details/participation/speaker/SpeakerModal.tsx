import React, { useState } from 'react'
import styles from './speakermodal.style.module.css'
import ProfileIcon from '/public/profile_Image.jpg'
import Image from 'next/image'
import Link from 'next/link'

interface SpeakerProfileType {
    id: string;
    name: string;
    linkedin: string;
    designation: string;
    profileImage: string | ArrayBuffer | null;
}

interface Props {
    setSpeakerModal: (value: boolean) => void
    setSpeakerProfilesData: React.Dispatch<React.SetStateAction<SpeakerProfileType[]>>
    prefilledProfile?: SpeakerProfileType | null;
    deleteSpeaker: (id: string) => void;
    updateSpeaker: (updatedProfile: SpeakerProfileType) => void;
}

const SpeakerModal = ({ setSpeakerModal, setSpeakerProfilesData, prefilledProfile, deleteSpeaker, updateSpeaker }: Props) => {
    const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(prefilledProfile?.profileImage || null);
    const [name, setName] = useState<string>(prefilledProfile?.name || "");
    const [linkedinurl, setLinkedinurl] = useState<string>(prefilledProfile?.linkedin || "");
    const [designation, setDesignation] = useState<string>(prefilledProfile?.designation || "");
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const updatedProfile: SpeakerProfileType = {
            id: prefilledProfile?.id || Date.now().toString(), // Use existing id or create a new one
            name,
            linkedin: linkedinurl,
            designation,
            profileImage: imageSrc,
        };

        if (prefilledProfile) {
            updateSpeaker(updatedProfile);
        } else {
            setSpeakerProfilesData((prevData) => [...prevData, updatedProfile]);
            setSpeakerModal(false);
        }
    };

    return (
        <form className={styles.body} onSubmit={handleSubmit}>
            <div className={styles.header}>
                <div className={styles.uploadContainer}>
                    <div className={styles.profileContainer}>
                        {imageSrc ? (
                            <Image src={imageSrc as string} alt="profile" height={63} width={63} />
                        ) : (
                            <Image src={ProfileIcon} alt="profile" height={63} width={63} />
                        )}
                    </div>
                    <div className={styles.uploadBtn}>
                        <input type='file' id="upload" onChange={handleFileChange} />
                        <label htmlFor="upload" className={styles.uploadLabel}>Upload</label>
                    </div>
                </div>
                {!prefilledProfile ? (
                    <div className={styles.headerBtns}>
                        <button type='submit' className={styles.addBtn}>Add Speaker</button>
                        <span onClick={() => setSpeakerModal(false)}>Close</span>
                    </div>
                ) : (
                    <div className={styles.headerBtns}>
                        <span className={styles.deleteBtn} onClick={() => {
                            if (prefilledProfile?.id) deleteSpeaker(prefilledProfile.id);
                        }}>Delete</span>
                        <button type='submit' className={styles.addBtn}>Save</button>
                    </div>
                )}
            </div>
            <div className={styles.infoContainer}><span className={styles.infoBtn}>i</span><span className={styles.info}>Upload speaker profile photo</span></div>
            <div className={styles.inputContainers}>
                <input type="text" required onChange={(e) => setName(e.target.value)} placeholder='Enter Speaker Name' value={name} />
                <input type="text" required onChange={(e) => setDesignation(e.target.value)} placeholder='Enter Department and Designation ' value={designation} />
                <div className={styles.linkedinInput}>
                    <Link href={linkedinurl}><LinkedinIcon /></Link>
                    <input required onChange={(e) => setLinkedinurl(e.target.value)} type="text" value={linkedinurl} />
                </div>
            </div>
        </form>
    )
}

export default SpeakerModal
function LinkedinIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.25 0C1.00736 0 0 1.00736 0 2.25V15.75C0 16.9927 1.00736 18 2.25 18H15.75C16.9927 18 18 16.9927 18 15.75V2.25C18 1.00736 16.9927 0 15.75 0H2.25ZM5.625 7.59375V14.625H3.375V7.59375H5.625ZM5.625 5.06259C5.625 5.68748 5.19085 6.1875 4.49334 6.1875H4.4803C3.80905 6.1875 3.375 5.68748 3.375 5.06259C3.375 4.42365 3.82236 3.9375 4.50657 3.9375C5.19085 3.9375 5.61201 4.42365 5.625 5.06259ZM9.5625 14.625H7.3125C7.3125 14.625 7.34825 8.36127 7.31258 7.59375H9.5625V8.75667C9.5625 8.75667 10.125 7.59375 11.8125 7.59375C13.5 7.59375 14.625 8.54755 14.625 11.06V14.625H12.375V11.3741C12.375 11.3741 12.375 9.52443 10.9531 9.52443C9.53123 9.52443 9.5625 11.1822 9.5625 11.1822V14.625Z" fill="#A1A1A1" />
        </svg>

    )
}