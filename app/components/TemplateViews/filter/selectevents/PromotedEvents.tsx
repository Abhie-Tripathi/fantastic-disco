import React, { ChangeEvent, useEffect, useState } from 'react'
import styles from './promoted.style.module.css'
import SearchIcon from "/public/search.svg";
import Image from 'next/image';
import Tag from '@/app/components/widgetadd/Tag';
import useFetch from '@/hooks/useFetch';

interface SelectProps {
    promotedEventOn: boolean;
    promotedEventLimit : number;
}
interface PromotedEvent {
    id: string;
    name: string;
}

const PromotedEvents = ({promotedEventOn,promotedEventLimit} : SelectProps) => {
    const { data } = useFetch("https://api.eventgeni.com/es/find?company=104");
    const [showPromotedInput, setShowPromotedInput] = useState<boolean>(false);
    const [isPromotedDropdownOpen, setIsPromotedDropdownOpen] =
        useState<boolean>(false);
    const [promotedInput, setPromotedInput] = useState<string>("");
    const [matchingPromotedEvents, setMatchingPromotedEvents] = useState<any[]>(
        []
    );
    const [promotedEventTags, setPromotedEventTags] = useState<PromotedEvent[]>(
        []
    );
    const [promotedEvents, setPromotedEvents] = useState<string[]>([]);
    useEffect(() => {
        if (data) {
            const eventData = data.eventData || []; // Ensure eventData is available, default to an empty array if not present
            const matches =
                promotedInput.trim() === ""
                    ? []
                    : eventData.filter((event: any) =>
                        event._source.name
                            .toLowerCase()
                            .includes(promotedInput.toLowerCase())
                    );
            setMatchingPromotedEvents(matches);
            setIsPromotedDropdownOpen(promotedInput.trim() !== ""); // Set dropdown open only if searchInput is not empty
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [promotedInput]);

    // const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    //     setShowPromotedInput(e.target.checked);
    // };
    const handlePromotedEventClick = (event: any) => {
        const id = event._id;
        const name = event._source.name;
        if (!promotedEventTags.includes(event._source.name)) {
            setPromotedEventTags([...promotedEventTags, { id, name }]);
            setPromotedEvents([...promotedEvents, id]);
        }
        setIsPromotedDropdownOpen(false);
    };

    const handleRemovePromotedEventsTag = (tagToRemove: string, id: string) => {
        setPromotedEventTags(
            promotedEventTags.filter((tag) => tag.name !== tagToRemove)
        );
        setPromotedEvents(promotedEvents.filter((tagId) => tagId !== id));
    };

    return (
        <div className={styles.body}>
            <div className={styles.promotedContainer}>
                <div className={styles.promotedHeading}>
                    <div className={styles.heading}>
                        Select Highlighted Events
                    </div>
                    <input
                        type="checkbox"
                        id="check"
                        className={styles.checkboxInput}
                        checked={promotedEventOn}
                    />
                    <label htmlFor="check" className={styles.checkBox}></label>
                    {promotedEventLimit === 0 && <div className={styles.promotedInfoOne}>* If you want Highlighted events, Select a design with Highlighted Event</div>}
                    {promotedEventLimit > 0 && <div className={styles.promotedInfoTwo}>{promotedEventLimit -promotedEventTags.length} Remaining</div>}
                </div>
                {promotedEventTags.length < promotedEventLimit && (
                    <div
                        className={`${styles.promotedInput} ${styles.inputInnerContainer}`}
                    >
                        <Image src={SearchIcon} alt="search" />
                        <input
                            type="text"
                            onChange={(e) => setPromotedInput(e.target.value)}
                            placeholder="Search Events"
                            value={promotedInput}
                            disabled={!promotedEventOn}
                        />
                    </div>)}
                {isPromotedDropdownOpen && (
                    <div className={styles.dropdown}>
                        {matchingPromotedEvents.map((event, index) => (
                            <div
                                key={index}
                                className={styles.dropdownItem}
                                onClick={() => handlePromotedEventClick(event)}
                            >
                                {event._source.name}
                            </div>
                        ))}
                    </div>
                )}
                <div className={styles.tags}>
                    {promotedEventTags.map((tag, index) => (
                        <Tag
                            key={index}
                            name={tag.name}
                            onRemove={() => handleRemovePromotedEventsTag(tag.name, tag.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PromotedEvents