import React, { useEffect, useState } from "react";
import styles from "./audiencespread.module.css";
import CheckboxInput from "../../UI/CheckBoxInput";
import Image from "next/image";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
import searchIcon from '/public/internal/SearchInput.svg'
import { useTheme } from "@/context";


interface Props {
  className?: string;
  selectedCountries: string[];
  setSelectedCountries: any;
  onClose: () => void;
}

const AudienceDes = ({
  className,
  selectedCountries,
  setSelectedCountries,
  onClose,
}: Props) => {

  const [searchUser, setSearchUser] = useState<string>("");

  const [allCountries, setAllCountries] = useState<any>([]);
  const [countries, setCountries] = useState<any>([]);

  const {theme} = useTheme();
  const iconClass = theme === 'light' ? 'icons_light' : 'icon'

  const handleCountrySelect = (countryId: string) => {
    console.log('selectedCountries1', selectedCountries);
    setSelectedCountries((prevSelectedCountries: any[]) => {
        if (prevSelectedCountries?.includes(countryId)) {
            return prevSelectedCountries.filter((id: string) => id !== countryId);
        } else {
            return [...prevSelectedCountries, countryId];
        }
    });
  }

  useEffect(() => {
    console.log('selectedCountries', selectedCountries);
    const fetchData = async () => {
      const { data, error } = await myFetch(
        `${baseUrl}/designation?take=100`
      );
      if (error) {
        console.log(error);
        return;
      }

      if (data) {
        setCountries(data);
        setAllCountries(data);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filterUser = (item: any) => {
        let u_name = item.name.toLowerCase();
        return u_name.includes(searchUser.toLowerCase())
    }

    if (searchUser.trim() !== '') {
        const matches = allCountries.filter(filterUser);
        setCountries(matches);
    } else {
        setCountries(allCountries);
    }
    }, [searchUser]);

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <div>
          Audience Spread
          {/* <InformationFillSmall color="var(--primary-text-color)" /> */}
        </div>
      </div>
      <div className={styles.sub_container}>
        <div className={styles.search_container}>
          <input
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className={styles.searchInput}
            placeholder="Search by designation"
            type="text"
          ></input>
          <Image src={searchIcon} alt="search" className={iconClass} />
        </div>
        <div className={styles.users_list}>
          {countries.map((country: any) => (
            <div key={country.id} className={styles.userItem}>
              <CheckboxInput
                id={"abc"}
                onChange={() => handleCountrySelect(country.id)}
                checked={selectedCountries?.includes(country.id)}
              />
              {/* <Image
                src={`https://img.10times.com/img/flag/${country.countryCode.toLowerCase()}.jpg`}
                alt="flag"
                width={16}
                height={12}
              /> */}
              <label htmlFor={country.id}>{country.name}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudienceDes;
