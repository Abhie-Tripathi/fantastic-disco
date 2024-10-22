import React, { useEffect, useState } from "react";
import styles from "./guestlist.style.module.css";
import SortIcon from "/public/filter.svg";
import Image from "next/image";
import useOutsideClick from "@/hooks/useOutsideClick";
import DownloadIcon from "/public/downloadIcon.svg";
import { useEventContext } from "@/context/eventcontext";
import { baseUrl } from "@/constants";
import { myFetch } from "@/utils/myFetch";
import StatusModal from "./StatusModal";
import { mkConfig, generateCsv, download } from "export-to-csv";
import * as XLSX from "xlsx";
import { showToast } from "@/utils/showToast";
// import { ToastContainer, toast } from "react-toastify";

interface Props {
  eventId: string;
  statusModal: boolean;
  setStatusModal: (value: boolean) => void
}

const GuestList = ({ eventId, statusModal, setStatusModal }: Props) => {

  const [activeFilterBtn, setActiveFilterBtn] = useState<string>("All Guests")
  const [activeSortBtn, setActiveSortBtn] = useState<string>("Register Time")
  const [filterDropdown, setFilterdropdown] = useState<boolean>(false)
  const [sortDropdown, setSortDropdown] = useState<boolean>(false)
  const filterDropdownRef = useOutsideClick(() => setFilterdropdown(false))
  const sortDropdownRef = useOutsideClick(() => setSortDropdown(false))

  const [statusValue, setStatusValue] = useState<string>("")
  const [interestId, setInterestId] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [mail, setMail] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("")
  const [filterStatus, setFilterStatus] = useState<string>("")
  const [inputName, setInputName] = useState<string>("")

  const statusModalRef = useOutsideClick(() => setStatusModal(false));

  const [guests, setGuests] = useState<any[]>(
    [
      // { name: "Walter White", email: "killguss@yahoo.com", status: "Going" }, { name: "Sheldon Cooper", email: "bazinga.buzz@gmail.com", status: "Waitlist" }, { name: "Joey Trib", email: "howyoudoin@gmail.com", status: "Not Going" }
    ]
  )
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();

    // Get the day suffix
    const daySuffix =
      day === 1 || day === 21 || day === 31 ? "st" :
        day === 2 || day === 22 ? "nd" :
          day === 3 || day === 23 ? "rd" : "th";

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day}${daySuffix} ${month} ${year}`;
  };

  // Debouncing
  const [debouncedInputName, setDebouncedInputName] = useState<string>(""); 
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInputName(inputName);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [inputName]);

  const fetchGuests = async () => {
    let fetchUrl = `${baseUrl}/intend/users?eventId=${eventId}&sortType=asc`;

    if (sortBy.length > 0) {
      fetchUrl += `&sortBy=${sortBy}`;
    }

    if (filterStatus.length > 0) {
      fetchUrl += `&status=${filterStatus}`;
    }
    if (debouncedInputName) {
      fetchUrl += `&name=${debouncedInputName}`;
    }
    const { data, error } = await myFetch(`${fetchUrl}`)

    if (error) {
      console.log("error is : ", error);
    } else {
      const fetchedGuests = data.users.map((user: any) => ({
        name: `${user.firstname} ${user.lastname}`,
        email: user.email,
        status: user.status,
        interestId: user.interestId,
        date: formatDate(user.created)
      }));
      setGuests(fetchedGuests);
    }
  };

  useEffect(() => {
    fetchGuests()
  }, [sortBy, filterStatus, debouncedInputName])

  const handleSortBy = (sort: string) => {
    if (sort === "firstname") {
      setActiveSortBtn("Name")
    } else if (sort === "email") {
      setActiveSortBtn("Email")
    } else {
      setActiveSortBtn("Register Time")
    }
    setSortBy(sort)
  }
  const handleFilterBy = (filter: string) => {
    setActiveFilterBtn(filter)
    if (filter === "All Guests") {
      setFilterStatus("")
    } else if (filter === "Going") {
      setFilterStatus("CONFIRMED")
    } else if (filter === "Not going") {
      setFilterStatus("REJECTED")
    } else if (filter === "Waitlist") {
      setFilterStatus("WAITLISTING")
    } else if (filter === "Pending") {
      setFilterStatus("PENDING")
    }
  }

  const handleStatusClick = (
    interestId: string,
    status: string,
    name: string,
    mail: string
  ) => {
    setStatusModal(true);
    setName(name);
    setMail(mail);
    setInterestId(interestId);
    setStatusValue(status);
  };

  // Function to export the data in csv
  const downloadCsv = () => {
    if (guests.length === 0) {
      // toast.warn("No guests available to download.", {
      //   position: "bottom-right",
      //   autoClose: 3000,
      // });
      showToast("warning", "No guests available to download.")
      return;
    }

    // toast.info("Downloading...", {
    //   position: "bottom-right",
    //   autoClose: 2000,
    // });
    showToast("info", "Downloading...")
    const csvConfig = mkConfig({ useKeysAsHeaders: true });
    const csv = generateCsv(csvConfig)(guests);
    download(csvConfig)(csv);
  };

  const downloadExcel = () => {
    if (guests.length === 0) {
      // toast.warn("No guests available to download.", {
      //   position: "bottom-right",
      //   autoClose: 3000,
      // });
      showToast("warning", "No guests available to download.")
      return;
    }

    showToast("info", "Downloading...")
    // toast.info("Downloading...", {
    //   position: "bottom-right",
    //   autoClose: 2000,
    // });

    // Map guests while excluding interestId
    const mappedGuests = guests.map(({ interestId, ...guest }) => ({
      ...guest,
      status: getStatusLabel(guest.status),
    }));

    const worksheet = XLSX.utils.json_to_sheet(mappedGuests);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Guests");
    XLSX.writeFile(workbook, "GuestList.xlsx");
  };

  const getStatusLabel = (status: string) => {
    return status === "PENDING"
      ? "Pending"
      : status === "CONFIRMED"
        ? "Going"
        : status === "WAITLISTING"
          ? "Waitlist"
          : status === "FOLLOWING"
            ? "Following"
            : "Not going";
  };

  return (
    <div className={styles.body}>
      <div className={styles.header}>
        <div className={styles.heading}>Guest List</div>
        <div className={styles.downloadBtn} onClick={downloadExcel}>
          <Image src={DownloadIcon} alt="download" />
        </div>
      </div>

      <div className={styles.inputContainer}>
        <SearchIcon />
        <input
          type="text"
          className={styles.inputSearch}
          placeholder="Search Guests"
          onChange={(e)=>setInputName(e.target.value)}
        />
      </div>
      <div className={styles.filterSortingContainer}>
        <div className={styles.filterBtnContainer}>
          <button
            className={styles.dropBtn}
            onClick={() => setFilterdropdown(!filterDropdown)}
          >
            <FilterIcon />
            {activeFilterBtn}</button>
          {filterDropdown && <div className={styles.dropdown} ref={filterDropdownRef}>
            <li onClick={() => handleFilterBy("All Guests")}>{activeFilterBtn === "All Guests" && <TickIcon />}All Guests</li>
            <li onClick={() => handleFilterBy("Going")}>{activeFilterBtn === "Going" && <TickIcon />}Going<span>2</span></li>
            <li onClick={() => handleFilterBy("Invited")}>{activeFilterBtn === "Invited" && <TickIcon />}Invited <span>0</span></li>
            <li onClick={() => handleFilterBy("Pending")}>{activeFilterBtn === "Pending" && <TickIcon />}Pending <span>0</span></li>
            <li onClick={() => handleFilterBy("Waitlist")}>{activeFilterBtn === "Waitlist" && <TickIcon />}Waitlist <span>1</span></li>
            <li onClick={() => handleFilterBy("Not going")}>{activeFilterBtn === "Not going" && <TickIcon />}Not going <span>0</span></li>
          </div>}
        </div>
        <div className={styles.sortBtnContainer}>
          <button className={styles.dropBtn} onClick={() => setSortDropdown(!sortDropdown)}><Image src={SortIcon} alt='filter' />{activeSortBtn}</button>
          {sortDropdown && <div className={styles.dropdown} ref={sortDropdownRef}>
            <li onClick={() => handleSortBy("firstname")}>{activeSortBtn === "Name" && <TickIcon />}Name</li>
            <li onClick={() => handleSortBy("email")}>{activeSortBtn === "Email" && <TickIcon />}Email</li>
            <li onClick={() => handleSortBy("")}>{activeSortBtn === "Register Time" && <TickIcon />}Register Time</li>
          </div>}
        </div>
      </div>
      <div className={styles.guestListContainer}>
        {guests.length > 0 ? (guests.map((guest, key) => (
          <div className={styles.guest} key={key} onClick={() => handleStatusClick(guest.interestId, guest.status, guest.name, guest.email)} >
            <div className={styles.nameMailContainer}>
              <div className={styles.guestName}>{guest.name}</div>
              <div className={styles.guestEmail}>{guest.email}</div>
            </div>
            <div className={styles.guestDateContainer}>
              <div className={`${styles.guestStatus} 
            ${guest.status === "PENDING" ? styles.pending :
                  guest.status === "CONFIRMED" ? styles.going :
                    guest.status === "WAITLISTING" ? styles.waitlist :
                      guest.status === "FOLLOWING" ? styles.following : styles.notgoing
                }
            `}>
                {guest.status === "PENDING" ? "Pending" : guest.status === "CONFIRMED" ? "Going" : guest.status === "WAITLISTING" ? "Waitlist" : guest.status === "FOLLOWING" ? "Following" : "Not Going"}
              </div>
              <div className={styles.date}>{guest.date}</div>
            </div>
          </div>
        ))) : (
          <div className={styles.emptyList}>No guest registered yet. Start by inviting</div>
        )}
      </div>
      {statusModal && <div className={styles.modal} ref={statusModalRef}><StatusModal setStatusModal={setStatusModal} fetchGuests={fetchGuests} eventId={eventId} interestId={interestId} mail={mail} name={name} statusValue={statusValue} setStatusValue={setStatusValue} /></div>}
    </div>
  );
};

export default GuestList;

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24"
      width="24"
      viewBox="0 -960 960 960"
    >
      <path
        d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"
        fill="#666666"
      />
    </svg>
  );
}
function TickIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="14"
      viewBox="0 -960 960 960"
      width="14"
    >
      <path
        d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"
        fill="#0072F5"
      />
    </svg>
  );
}
function FilterIcon() {
  return (
    <svg
      width="16"
      height="14"
      viewBox="0 0 18 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.99967 14.1663L5.49967 14.9997V7.91634L1.76634 3.80967C1.48755 3.50295 1.33305 3.10334 1.33301 2.68884V0.833008H14.6663V2.64301C14.6662 3.085 14.4906 3.50885 14.178 3.82134L10.4997 7.49967V9.16634M13.833 15.833V10.833M13.833 10.833L16.333 13.333M13.833 10.833L11.333 13.333"
        stroke="#ffffff"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
