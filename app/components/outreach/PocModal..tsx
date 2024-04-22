
import React, { useRef, useState, useEffect, ChangeEvent } from "react";
import styles from "./pocmodal.style.module.css";
// import commonStyle from "@/app/common.module.css";
import { LoadingButton } from "./LoadingButton";
import { pocType } from "@/types/pocType";

interface PocModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<{
      isPocModalOpen: boolean;
      eventTitle: string;
      eventId: string | number;
  }>>;
  eventTitle: string;
  eventId: string | number;
  pocModalContent: {
      isPocModalOpen: boolean;
      eventTitle: string;
      eventId: string | number;
  };
}

function getEventDate(startDate: string, endDate: string): string {
  let startDateObj = new Date(startDate);
  let endDateObj = new Date(endDate);
  let result: string = '';

  if (endDate === null) {
      endDateObj = startDateObj;
  }

  if (startDateObj.getFullYear() === endDateObj.getFullYear()) {
      if (startDateObj.getMonth() === endDateObj.getMonth()) {
          if (startDateObj.getDate() === endDateObj.getDate()) {
              result = startDateObj.getDate() + ' ' +
                  startDateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          } else {
              result = startDateObj.getDate() + ' - ' +
                  endDateObj.getDate() + ' ' +
                  endDateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          }
      } else {
          result = startDateObj.getDate() + ' ' +
              startDateObj.toLocaleDateString('en-US', { month: 'short' }) + ' - ' +
              endDateObj.getDate() + ' ' +
              endDateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }
  } else {
      result = startDateObj.getDate() + ' ' +
          startDateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) + ' - ' +
          endDateObj.getDate() + ' ' +
          endDateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
  return result;
}

function isWithinLast6Months(dateString: string): boolean {
  const parts: number[] = dateString.split(/[- :]/).map(part => parseInt(part, 10));
  const date: Date = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
  const currentDate: Date = new Date();
  const sixMonthsAgo: Date = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return date >= sixMonthsAgo && date <= currentDate;
}

export default function PocModal( props: PocModalProps ) {
  // let eventTitle = props.pocModalContent.eventTitle;
  let visible = props.pocModalContent.isPocModalOpen;
  let setVisible = props.setVisible;
  let eventId = props.pocModalContent.eventId;

  const [pocData, setPocData] = useState<pocType[]>([]);
  const [isPocLoading, setPocLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    companySearch:'',
    designationSearch:''
  });
  const [page, setPage] = useState(0);
  const [hideloadmore, setHideloadmore] = useState(false);
  const abortController = new AbortController();

  const [buttonStatus, setButtonStatus] = useState({
    searchButton:false,
    loadMore:false,
  });

  const modalRef = useRef<HTMLDivElement>(null);

  const closePocModal = () =>{
    abortController.abort();
    setVisible({...props.pocModalContent, 'isPocModalOpen':false});
    setPocData([]);
    setPage(0);
    setFormData({companySearch: '', designationSearch: ''});
    setButtonStatus({'searchButton': false, 'loadMore': false});
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
    setPage(0);
  };

  const handleLoadMore = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setButtonStatus({...buttonStatus, 'loadMore': true});
    setPage(page+1);
  }

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if(typeof(formData?.companySearch) === undefined && typeof(formData?.designationSearch) == undefined) return;
    setPage(1);
    setButtonStatus({...buttonStatus, 'searchButton': true});
  }

  const handleSubmit = async() => {
    // e.preventDefault();
    try {
      const response = await fetch(
        `/api/coordinate/outreach/searchPoc?companySearch=${formData.companySearch?formData.companySearch:''}&designationSearch=${formData.designationSearch?formData.designationSearch:''}&page=${page}`, { signal: abortController.signal }
      );
      const apiResponse = await response.json();
      if(page == 1)
        setPocData(apiResponse.data);
      else if(page > 1)
        setPocData(pocData1 => [...pocData, ...apiResponse.data]);

      if(apiResponse.data.length == 0 || apiResponse.data.length < 20){
        setHideloadmore(true);
      }else
        setHideloadmore(false);
    } catch (err) {
      console.log('ERROR SAVING DATA');
      setPage(0);
    } finally{
      setButtonStatus({'searchButton': false, 'loadMore': false});
    }
  };

  useEffect(() => {
    if(page >= 1)
      handleSubmit();
  }, [page]);

  return (
    <>
      {visible ? (
        <div
          onClick={(e) => {
            if (modalRef.current && modalRef.current.contains(e.target as Node)) {
              return;
            }
            closePocModal();
          }}
        >
          <div className={styles["modalContainer"]} ref={modalRef}>
            <div className={styles["modal"]} >
                <header className={styles["modal_header"]}>
                    <div className={styles["modal_header-title"]}>Search new contacts</div>
                    <button className={styles["close"]} onClick={() => closePocModal()} >
                    <img src="/close.svg" alt="close" />
                    </button>
                </header>
                <main className={styles["modal_content"]} style={{padding:"0 1rem"}}>
                    <div className={styles["poc_filters"]} style={{overflow:"auto"}}>
                      <input 
                        placeholder="Organization Name / Website"
                        type="text"
                        name="companySearch"
                        className={styles.company_input}
                        onChange={handleChange}
                      />
                      <input
                        placeholder="Designation"
                        type="text"
                        name="designationSearch"
                        className={styles.company_input}
                        onChange={handleChange}
                      />
                      {/* <button className={styles.poc_search_btn} onClick={handleSubmit} >Search</button> */}
                      { buttonStatus.searchButton ? (
                          <LoadingButton height={'10px'} width={'20px'} text={'Loading'} />
                        ) : (
                          <button className={styles.poc_search_btn} onClick={handleSearch} >Search</button>
                        ) }
                    </div>
                    <div className={styles["poc_results"]} style={{overflow:"auto", maxHeight:"40vh"}}>
                    { (pocData && pocData.length > 0) ?
                        (<>
                        <table className={styles["poc-table"]} cellPadding="0" cellSpacing="0" border={0}>
                            <thead>
                            <tr>
                                <th>Person</th>
                                <th>Phone</th>
                                <th>Email</th>
                            </tr>
                            </thead>
                            <tbody className="poc-table-content">
                            { 
                                pocData.map((item) =>(
                                  item.name ?
                                    (<tr key={item.id} >
                                        <td className="table-user" style={{ alignItems: "center", display: "flex" }}>
                                        <img
                                          src={item.profilePicture?item.profilePicture:'https://c1.10times.com/board/images/default_user.png'}
                                          alt="table-user"
                                          className={styles["poc-img"]}
                                          style={{ width: 40, height: 40 }}
                                          referrerPolicy="no-referrer"
                                        />
                                        <div>
                                            {item.name}
                                            <div className={styles["designation"]}>{item.designation}</div>
                                        </div>
                                        </td>
                                        <td>
                                          <button className={styles.view_infoBtn} >View Phone</button>
                                        </td>
                                        <td>
                                          <button className={styles.view_infoBtn} >View Email</button>
                                          { ( item.unsubscribe != 1 && item.unsubscribe != 4 ) &&
                                            // <span title="Email Unsubscribe" className={styles["red-dot"]}></span>
                                            <></>
                                          }
                                          { item.lastActive &&
                                            <div className={styles["designation"]}>(Last Active: {getEventDate(item.lastActive, '')})</div>
                                          }
                                        </td>
                                    </tr>)
                                    :<></>
                                ))
                            }
                            </tbody>
                        </table>
                        <div style={{textAlign: "center",marginTop: "1rem"}}>
                          {hideloadmore?
                            <></>:
                            (
                              buttonStatus.loadMore ? (
                                <LoadingButton height={'10px'} width={'20px'} text={'Loading'} />
                              ) : (
                                <button onClick={handleLoadMore} className={styles.load_more_btn} >Load More</button>
                              )
                            )
                          }
                        </div>
                        </>
                        ) 
                        :(
                        <p style={{ padding: "0.8rem 0" }}>Find new person by organization / designation.</p>
                        )
                    }
                    </div>
                </main>
                {/* <footer className={styles["modal_footer"]}>
                    <button className={styles["modal-close"]} onClick={() => closePocModal()} >Close</button>
                </footer> */}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}