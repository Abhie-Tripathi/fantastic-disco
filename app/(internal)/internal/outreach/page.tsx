'use client'
import React, { useState } from 'react';
import styles from './page.style.module.css';
import CardTask from '@/app/components/outreach/CardTask';
import EventDetail from '@/app/components/internal/eventdetail/EventDetail';

const Page: React.FC = () => {
    const [shortlistedTasks, setShortlistedTasks] = useState<string[]>(['How to Practice as an International Doctor in Australia?', 'How to Practice as an International Doctor in Usa?', 'How to Practice as an International Doctor in India?', 'How to Practice as an International Doctor in Canada?']);
    const [inProgressTasks, setInProgressTasks] = useState<string[]>([]);
    const [finalisedTasks, setFinalisedTasks] = useState<string[]>([]);
    const [modalOpen, setModalOpen] = useState(false)

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
            } else if (source === 'inProgress') {
                setInProgressTasks(inProgressTasks.filter(task => task !== taskName));
            } else if (source === 'finalised') {
                setFinalisedTasks(finalisedTasks.filter(task => task !== taskName));
            }

            if (target === 'shortlisted') {
                setShortlistedTasks([...shortlistedTasks, taskName])
            } else if (target === 'inProgress') {
                setInProgressTasks([...inProgressTasks, taskName])
            } else if (target === 'finalised') {
                setFinalisedTasks([...finalisedTasks, taskName])
            }
        }

    };

    const handleModal = () => {
        setModalOpen(!modalOpen)
    }

    return (
        <div className={styles.body}>
            <div className={`${styles.taskBody} ${modalOpen ? styles.bodyBlur : ""}`}>
                <div className={styles.shortListedBody}>
                    <div className={styles.heading}>Shortlisted</div>
                    <div className={`${styles.shortListedContainer} ${styles.cardsContainer}`}
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
                    <div className={styles.heading}>In Progress</div>
                    <div className={`${styles.inProgressContainer} ${styles.cardsContainer}`}
                        onDragOver={(event) => handleDragOver(event)}
                        onDragStart={(event) => handleDragContainerStart(event, 'inProgress')}
                        onDrop={(event) => handleDrop(event, 'inProgress')}>
                        {inProgressTasks.map((task, index) => (
                            <div className={styles.cards} key={index}>
                                <CardTask key={index} name={task} draggable={true} onDragStart={(event) => handleDragStart(event, task)} handleModal={handleModal} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.finalisedBody}>
                    <div className={styles.heading}>Finalised</div>
                    <div className={`${styles.finalisedContainer} ${styles.cardsContainer}`}
                        onDragOver={(event) => handleDragOver(event)}
                        onDragStart={(event) => handleDragContainerStart(event, 'finalised')}
                        onDrop={(event) => handleDrop(event, 'finalised')}>
                        {finalisedTasks.map((task, index) => (
                            <div className={styles.cards} key={index}>
                                <CardTask key={index} name={task} draggable={true} onDragStart={(event) => handleDragStart(event, task)} handleModal={handleModal} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={styles.modal}>
                {modalOpen && <EventDetail openEventDetails={false} openOrganiserDetails={true} openPocDetails={true} />}
            </div>
        </div>
    );
};

export default Page;
