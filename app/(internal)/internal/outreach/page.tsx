'use client';
import { useEffect, useState } from "react";
import styles from "./page.style.module.css";
import ShortListedItem from "@/app/components/outreach/ShortListedItem";
import PocModal from "@/app/components/outreach/PocModal.";
// import DetailModal from "@/components/coordinate/notes/detailModal";
import { enquiryType } from '@/types/outreachEnquiryTypes'

export default function Page() {
    const customStyle = {
        s1: {
          marginBottom: "0.75rem",
          padding: "1.4rem",
          fontWeight: "400",
        },
        s2: {
            height: "calc(70vh - 60px)",
            overflowY: "auto",
        },
        s3: {
            marginBottom: "1rem",
        }
    };

    const [enquiryCount, setEnquiryCount] = useState({
        shortlist:0,
        process:0,
        final:0,
    });

    const [statusChange, setStatusChange] = useState<boolean>(false);

    const dataCount = [
        { name: 'SHORTLISTED', value: 0, intentStatus:1 },
        { name: 'IN PROCESS', value: 0, intentStatus:2 },
        { name: 'FINALIZED', value: 0, intentStatus:10 }
    ];

    const [pocModalContent, setPocModalContent] = useState<{
        isPocModalOpen: boolean;
        eventTitle: string;
        eventId: string | number;
    }>({
        isPocModalOpen: false,
        eventTitle: '',
        eventId: '',
    });

    const openPocModal = (id: string | number, name: string) =>{
        setPocModalContent({...pocModalContent, 'isPocModalOpen':true, 'eventTitle':name, eventId: id});
    }

    const handleStatusChange = () =>{
        setStatusChange(!statusChange);
    }

    // notes modal
    const [notesModalContent, setNotesModalContent] = useState<{
        isModalOpen: boolean;
        eventTitle: string;
        eventId: string | number;
        eventDetail: enquiryType| null;
        enquiryStatus: null | string;
    }>({
        isModalOpen: false,
        eventTitle: '',
        eventId: '',
        eventDetail: null,
        enquiryStatus: null,
    });

    const openNotesModal = (id: number, name: string, enquiryStatus: string, item: enquiryType) => {
        setNotesModalContent({...notesModalContent, 'eventTitle':name, eventId: id, eventDetail: item , 'isModalOpen':true, 'enquiryStatus':enquiryStatus });
    };
    // notes modal

    return (
        <div className={styles.main}>
            <div className={styles.grid}>
                {dataCount.map((item) => (
                    <ShortListedItem key={item.name} listType={item.name} intentStatus={item.intentStatus} statusChange={statusChange} openNotesModal={openNotesModal} />
                ))}
            </div>
            <PocModal visible={pocModalContent.isPocModalOpen} setVisible={setPocModalContent} eventTitle={pocModalContent.eventTitle} eventId={pocModalContent.eventId} pocModalContent={pocModalContent} />
            {/* <DetailModal setNotesModalContent={setNotesModalContent} notesModalContent={notesModalContent} openPocModal={openPocModal} statusChange={statusChange} handleStatusChange={handleStatusChange} /> */}
        </div>
    );
}