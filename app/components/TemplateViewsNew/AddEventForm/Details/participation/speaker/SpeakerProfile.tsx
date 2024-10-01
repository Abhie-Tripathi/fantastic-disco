import React from 'react'
import styles from './speakerprofile.style.module.css'
import EditIcon from '/public/EditIcon.svg'
import Image from 'next/image'
import SpeakerCard from './SpeakerCard';
import { FormState } from '@/types/Formstate';

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
    speakerProfilesData: SpeakerProfileType[]
    handlePrefill : (value : SpeakerProfileType)=>void
}
const SpeakerProfile = ({ speakerProfilesData,handlePrefill,handleChange }: Props) => {
    return (
        <div className={styles.body}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <SpeakerIcon />
                    <span>Add Speaker profiles</span>
                </div>
                <Image onClick={() => handleChange('speakerModal', true)} src={EditIcon} alt='edit' />
            </div>
            {speakerProfilesData.length > 0 && (
                <div className={styles.speakerProfiles}>
                    {speakerProfilesData.map((profile, key) => (
                        <div onClick={()=>handlePrefill(profile)} key={key}>
                            <SpeakerCard linkedin={profile.linkedin} profileImage={profile.profileImage} designation={profile.designation} name={profile.name} key={key}/>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SpeakerProfile

function SpeakerIcon() {
    return (
        <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0.289062C9.18613 0.289062 8.47656 1.07969 8.47656 2.125C8.47656 3.17031 9.18613 3.96094 10 3.96094C10.8139 3.96094 11.5234 3.17031 11.5234 2.125C11.5234 1.07969 10.8139 0.289062 10 0.289062ZM4.30695 1.14586L3.64328 1.47773C4.22598 2.34285 4.9016 3.31418 5.58703 4.17098C6.35684 5.13324 7.14758 5.93066 7.65723 6.18551L7.85156 6.2827V7.8248C8.91133 7.96574 9.66859 8.01941 10.5029 7.98457C10.4771 7.96543 10.4515 7.94629 10.4268 7.92676C10.2348 7.7752 10.0682 7.60621 9.93848 7.42457C9.70918 7.40164 9.52531 7.25371 9.41535 7.08668C9.2957 6.90504 9.23684 6.6866 9.23684 6.45145C9.23684 6.21629 9.2957 5.99785 9.41535 5.81613C9.53504 5.63449 9.74207 5.47488 10 5.47488C10.2579 5.47488 10.465 5.63445 10.5846 5.81613C10.7043 5.99781 10.7632 6.21629 10.7632 6.45145C10.7632 6.6866 10.7043 6.90504 10.5846 7.08672C10.5823 7.09039 10.5796 7.09395 10.5771 7.09754C10.6521 7.18965 10.7465 7.2834 10.8624 7.37488C11.1079 7.56871 11.4375 7.74441 11.8292 7.86941C11.9327 7.85676 12.0388 7.84324 12.1484 7.82879V6.2827L12.3428 6.18551C12.8525 5.93062 13.6432 5.13316 14.413 4.17094C15.0984 3.31414 15.774 2.34281 16.3568 1.4777L15.6931 1.14582C13.8698 2.9618 12.0231 4.66406 10 4.66406C7.97687 4.66406 6.1302 2.9618 4.30695 1.14586ZM5.44344 8.17438L5.91813 10.5479C9.86566 10.9136 10.1343 10.9136 14.0819 10.5479L14.5564 8.17551C10.2564 8.85707 9.74309 8.84594 5.44348 8.17434L5.44344 8.17438ZM6.97641 11.3515L7.49789 15.5234H12.5022L13.0236 11.3515C10.3767 11.5871 9.62332 11.5871 6.97641 11.3515ZM5.35156 16.2266V17.0078H14.6484V16.2266H5.35156ZM0.625 17.6719V18.375H19.375V17.6719H0.625Z" fill="#7D7D7D" />
        </svg>
    )
}
