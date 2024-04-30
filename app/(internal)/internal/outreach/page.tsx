'use client'
import React, { useState } from 'react';
import styles from './page.style.module.css';
import CardTask from '@/app/components/outreach/CardTask';
import EventDetail from '@/app/components/internal/eventdetail/EventDetail';
import { useTheme } from '@/context';

const Page: React.FC = () => {
    const [shortlistedTasks, setShortlistedTasks] = useState<string[]>(['How to Practice as an International Doctor in Australia?', 'How to Practice as an International Doctor in Usa?', 'How to Practice as an International Doctor in India?', 'How to Practice as an International Doctor in Canada?']);
    const [outreachTasks, setOutreachTasks] = useState<string[]>([]);
    const [preFinalisedTasks, setPreFinalisedTasks] = useState<string[]>([]);
    const [modalOpen, setModalOpen] = useState(false)
    const {theme} = useTheme()

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, taskName: string) => {
        event.dataTransfer.setData('taskName', taskName);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDragContainerStart = (event: React.DragEvent<HTMLDivElement>, source: string) => {
        event.dataTransfer.setData('source_container', source);
    }

    const handleDrop = (event: React.DragEvent<HTMLDivElement>, target: string) => {
        event.preventDefault()
        const taskName = event.dataTransfer.getData('taskName');
        const source = event.dataTransfer.getData('source_container')
        
        // To prevent adding the task into the same container
        if (target !== source) {
            if (source === 'shortlisted') {
                setShortlistedTasks(shortlistedTasks.filter(task => task !== taskName));
            } else if (source === 'outreach') {
                setOutreachTasks(outreachTasks.filter(task => task !== taskName));
            } else if (source === 'prefinalised') {
                setPreFinalisedTasks(preFinalisedTasks.filter(task => task !== taskName));
            }

            if (target === 'shortlisted') {
                setShortlistedTasks([...shortlistedTasks, taskName])
            } else if (target === 'outreach') {
                setOutreachTasks([...outreachTasks, taskName])
            } else if (target === 'prefinalised') {
                setPreFinalisedTasks([...preFinalisedTasks, taskName])
            }
        }

    };

    const handleModal = () => {
        setModalOpen(!modalOpen)
    }

    return (
        <div className={`${theme === 'light' ? styles.bodyContainer_light : styles.bodyContainer}`}  style={{ paddingTop: "70px"}}>
        <div className={styles.body} >
            <div className={`${styles.taskBody}`}>
                <div className={styles.shortListedBody}>
                    <div className={`${styles.heading} ${theme === 'light' ? styles.heading_light : ""}`}>Shortlisted <span className={styles.eventSize}>{shortlistedTasks.length}</span></div>
                    <div className={`${styles.shortListedContainer} ${styles.cardsContainer} ${theme === 'light' ? styles.cardsContainer_light : ""}`}
                        onDragOver={(event) => handleDragOver(event)}
                        onDragStart={(event) => handleDragContainerStart(event, 'shortlisted')}
                        onDrop={(event) => handleDrop(event, 'shortlisted')}>
                        {shortlistedTasks.map((task, index) => (
                            <div className={styles.cards} key={index}>
                                <CardTask key={index} name={task} draggable={true} onDragStart={(event) => handleDragStart(event, task)} handleModal={handleModal} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.inProgressBody}>
                    <div  className={`${styles.heading} ${theme === 'light' ? styles.heading_light : ""}`}>Out Reach <span className={styles.eventSize}>{outreachTasks.length}</span></div>
                    <div className={`${styles.inProgressContainer} ${styles.cardsContainer} ${theme === 'light' ? styles.cardsContainer_light : ""}`}
                        onDragOver={(event) => handleDragOver(event)}
                        onDragStart={(event) => handleDragContainerStart(event, 'outreach')}
                        onDrop={(event) => handleDrop(event, 'outreach')}>
                        {outreachTasks.map((task, index) => (
                            <div className={styles.cards} key={index}>
                                <CardTask key={index} name={task} draggable={true} onDragStart={(event) => handleDragStart(event, task)} handleModal={handleModal} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.finalisedBody}>
                    <div  className={`${styles.heading} ${theme === 'light' ? styles.heading_light : ""}`}>Pre Finalised <span className={styles.eventSize}>{preFinalisedTasks.length}</span></div>
                    <div className={`${styles.finalisedContainer} ${styles.cardsContainer} ${theme === 'light' ? styles.cardsContainer_light : ""}`}
                        onDragOver={(event) => handleDragOver(event)}
                        onDragStart={(event) => handleDragContainerStart(event, 'prefinalised')}
                        onDrop={(event) => handleDrop(event, 'prefinalised')}>
                        {preFinalisedTasks.map((task, index) => (
                            <div className={styles.cards} key={index}>
                                <CardTask key={index} name={task} draggable={true} onDragStart={(event) => handleDragStart(event, task)} handleModal={handleModal} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {modalOpen && <div className={`${styles.modal} ${theme === 'light' ? styles.modal_light :""}`}>
                <EventDetail openEventDetails={false} openOrganiserDetails={true} openPocDetails={true} closeBtn = {true} handleModal={handleModal} />
            </div>}
        </div>
        </div>
    );
};

export default Page;
