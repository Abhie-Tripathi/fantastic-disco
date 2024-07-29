'use client'
import React, { useEffect, useState } from 'react'
import styles from './globalsearch.style.module.css'
import { baseUrl } from '@/constants';
import { myFetch } from '@/utils/myFetch';

const GlobalSearch = () => {

    const [searchValue, setSearchValue] = useState<string>("")
    const [dataDropdown, setDatadropdown] = useState<boolean>(false)
    const [searchData, setSearchData] = useState<any[]>([])

    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            handleSearchInput(searchValue);
        }, 500);
        return () => clearTimeout(debounceTimeout);
    }, [searchValue]);

    const handleSearchInput = async (text: string) => {
        if (text) {
            const { data, error } = await myFetch(
                `${baseUrl}/event/search?eventName=${text}&max=5`
            );
            if (error) {
                console.log(error);
                return;
            }

            if (data) {
                console.log(data);
                setDatadropdown(true)
                setSearchData(data.events);
            }
        } else {
            setSearchData([]);
            setDatadropdown(false)
        }
    };


    return (
        <div className={styles.searchContainer}>
            <input type="text" placeholder='Search for events' onChange={(e) => setSearchValue(e.target.value)} />
            {dataDropdown &&
                <div className={styles.dropdownContainer}>
                    {searchData.length > 0 ? searchData.map((event) => (
                        <div className={styles.dropdownEvent} key={event.id}>
                            <span className={styles.dropeventName}>{event.name}</span>
                            <span className={styles.dropeventLocation}>{event.location.cityName}</span>
                        </div>
                    )) :
                        <div className={styles.noevent}>No events Found with this search</div>
                    }

                </div>}
        </div>
    )
}

export default GlobalSearch