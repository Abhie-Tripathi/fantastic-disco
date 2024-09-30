import React, { useState } from 'react'
import styles from './speakermodal.style.module.css'
import ProfileIcon from '/public/profile_Image.jpg'
import Image from 'next/image'
import Link from 'next/link'
import { FormState } from '@/types/Formstate'

interface SpeakerProfileType {
    id: string;
    name: string;
    linkedin: string;
    designation: string;
    // profileImage: string | ArrayBuffer | null;
    profileImage: File | null;
}

interface Props {
    handleChange: (field: keyof FormState, value: any) => void;
    // setSpeakerModal: (value: boolean) => void
    // setSpeakerProfilesData: React.Dispatch<React.SetStateAction<SpeakerProfileType[]>>
    prefilledProfile?: SpeakerProfileType | null;
    deleteSpeaker: (id: string) => void;
    updateSpeaker: (updatedProfile: SpeakerProfileType) => void;
}

const SpeakerModal = ({ handleChange, prefilledProfile, deleteSpeaker, updateSpeaker }: Props) => {
    // const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(prefilledProfile?.profileImage || null);
    const [imageFile, setImageFile] = useState<File | null>(prefilledProfile?.profileImage || null);
    const [name, setName] = useState<string>(prefilledProfile?.name || "");
    const [linkedinurl, setLinkedinurl] = useState<string>(prefilledProfile?.linkedin || "");
    const [designation, setDesignation] = useState<string>(prefilledProfile?.designation || "");

    // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = event.target.files?.[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setImageSrc(reader.result);
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };
    // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     const updatedProfile: SpeakerProfileType = {
    //         id: prefilledProfile?.id || Date.now().toString(), // Use existing id or create a new one
    //         name,
    //         linkedin: linkedinurl,
    //         designation,
    //         profileImage: imageSrc,
    //     };

    //     if (prefilledProfile) {
    //         updateSpeaker(updatedProfile);
    //     } else {
    //         setSpeakerProfilesData((prevData) => [...prevData, updatedProfile]);
    //         setSpeakerModal(false);
    //     }
    // };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
        }
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const updatedProfile: SpeakerProfileType = {
            id: prefilledProfile?.id || Date.now().toString(), // Use existing id or create a new one
            name,
            linkedin: linkedinurl,
            designation,
            profileImage: imageFile, // Store the file
        };

        if (prefilledProfile) {
            updateSpeaker(updatedProfile);
        } else {
            handleChange('speakerProfilesData', (prevData : any) => [...prevData, updatedProfile])
            // setSpeakerProfilesData((prevData) => [...prevData, updatedProfile]);
            handleChange('speakerModal', false)
            // setSpeakerModal(false);
        }
    };

    return (
        <form className={styles.body} onSubmit={handleSubmit}>
            <div className={styles.header}>
                <div className={styles.uploadContainer}>
                    <div className={styles.profileContainer}>
                        {/* {imageSrc ? (
                            <Image src={imageSrc as string} alt="profile" height={63} width={63} />
                        ) : (
                            <Image src={ProfileIcon} alt="profile" height={63} width={63} />
                        )} */}
                        {imageFile ? (
                            <Image src={URL.createObjectURL(imageFile)} alt="profile" height={63} width={63} />
                        ) : (
                            <Image src={ProfileIcon} alt="profile" height={63} width={63} />
                        )}
                    </div>
                    <div className={styles.uploadBtn}>
                        <input type='file' id="upload" onChange={handleFileChange} />
                        <label htmlFor="upload" className={styles.uploadLabel}>Upload</label>
                    </div>
                </div>
                <button type='button' className={styles.closeBtn} onClick={() => handleChange('speakerModal', false)}>Close</button>
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
            {prefilledProfile ? <div className={styles.deletSaveContainer}>
                <button type='button' className={styles.deleteBtn} onClick={() => {
                    if (prefilledProfile?.id) deleteSpeaker(prefilledProfile.id);
                }}><DeleteIcon />Delete</button>
                <button type='submit' className={styles.saveBtn}>Save</button>
            </div> :
                <div className={styles.addBtnContainer}>
                    <button type='submit' className={styles.addBtn}>Add Speaker</button>
                </div>}

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
function DeleteIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.5 3H9.5C9.5 2.60218 9.34196 2.22064 9.06066 1.93934C8.77936 1.65804 8.39782 1.5 8 1.5C7.60218 1.5 7.22064 1.65804 6.93934 1.93934C6.65804 2.22064 6.5 2.60218 6.5 3ZM5.5 3C5.5 2.33696 5.76339 1.70107 6.23223 1.23223C6.70107 0.763392 7.33696 0.5 8 0.5C8.66304 0.5 9.29893 0.763392 9.76777 1.23223C10.2366 1.70107 10.5 2.33696 10.5 3H15.5C15.6326 3 15.7598 3.05268 15.8536 3.14645C15.9473 3.24021 16 3.36739 16 3.5C16 3.63261 15.9473 3.75979 15.8536 3.85355C15.7598 3.94732 15.6326 4 15.5 4H14.446L13.252 14.344C13.1676 15.0752 12.8173 15.7498 12.2679 16.2396C11.7184 16.7293 11.008 16.9999 10.272 17H5.728C4.99195 16.9999 4.28161 16.7293 3.73214 16.2396C3.18266 15.7498 2.8324 15.0752 2.748 14.344L1.554 4H0.5C0.367392 4 0.240215 3.94732 0.146447 3.85355C0.0526785 3.75979 0 3.63261 0 3.5C0 3.36739 0.0526785 3.24021 0.146447 3.14645C0.240215 3.05268 0.367392 3 0.5 3H5.5ZM3.741 14.23C3.79743 14.7174 4.03105 15.167 4.39742 15.4934C4.76379 15.8198 5.23735 16.0001 5.728 16H10.272C10.7627 16.0001 11.2362 15.8198 11.6026 15.4934C11.969 15.167 12.2026 14.7174 12.259 14.23L13.439 4H2.561L3.741 14.23ZM6.5 6.5C6.63261 6.5 6.75979 6.55268 6.85355 6.64645C6.94732 6.74021 7 6.86739 7 7V13C7 13.1326 6.94732 13.2598 6.85355 13.3536C6.75979 13.4473 6.63261 13.5 6.5 13.5C6.36739 13.5 6.24021 13.4473 6.14645 13.3536C6.05268 13.2598 6 13.1326 6 13V7C6 6.86739 6.05268 6.74021 6.14645 6.64645C6.24021 6.55268 6.36739 6.5 6.5 6.5ZM10 7C10 6.86739 9.94732 6.74021 9.85355 6.64645C9.75979 6.55268 9.63261 6.5 9.5 6.5C9.36739 6.5 9.24021 6.55268 9.14645 6.64645C9.05268 6.74021 9 6.86739 9 7V13C9 13.1326 9.05268 13.2598 9.14645 13.3536C9.24021 13.4473 9.36739 13.5 9.5 13.5C9.63261 13.5 9.75979 13.4473 9.85355 13.3536C9.94732 13.2598 10 13.1326 10 13V7Z" fill="#DA2F35" />
        </svg>

    )
}