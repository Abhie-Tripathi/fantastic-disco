import React, { useState, useEffect } from "react";
import styles from "./myTrackers.style.module.css";
import Trackers from ".././AllTrackers";
import Image from "next/image";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
import Loading from "@/app/components/UI/Loading";
function AllTrackers({ fillColor }: { fillColor: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="11"
      viewBox="0 0 18 11"
      fill={fillColor}
    >
      <path
        d="M3 6.5H15C15.55 6.5 16 6.05 16 5.5C16 4.95 15.55 4.5 15 4.5H3C2.45 4.5 2 4.95 2 5.5C2 6.05 2.45 6.5 3 6.5ZM1 10.5H13C13.55 10.5 14 10.05 14 9.5C14 8.95 13.55 8.5 13 8.5H1C0.45 8.5 0 8.95 0 9.5C0 10.05 0.45 10.5 1 10.5ZM4 1.5C4 2.05 4.45 2.5 5 2.5H17C17.55 2.5 18 2.05 18 1.5C18 0.95 17.55 0.5 17 0.5H5C4.45 0.5 4 0.95 4 1.5Z"
        fill={fillColor}
      />
    </svg>
  );
}
function CustomeTracker({ fillColor }: { fillColor: string }) {
  return (
    <svg
      width="17"
      height="18"
      viewBox="0 0 17 18"
      fill={fillColor}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4.4668 4.5C4.4668 3.94188 4.57673 3.38923 4.79031 2.87359C5.00389 2.35796 5.31694 1.88945 5.71159 1.4948C6.10624 1.10015 6.57476 0.787094 7.09039 0.573512C7.60603 0.359929 8.15868 0.25 8.7168 0.25C9.27491 0.25 9.82757 0.359929 10.3432 0.573512C10.8588 0.787094 11.3274 1.10015 11.722 1.4948C12.1166 1.88945 12.4297 2.35796 12.6433 2.87359C12.8569 3.38923 12.9668 3.94188 12.9668 4.5C12.9668 5.62717 12.519 6.70817 11.722 7.5052C10.925 8.30223 9.84397 8.75 8.7168 8.75C7.58963 8.75 6.50862 8.30223 5.71159 7.5052C4.91456 6.70817 4.4668 5.62717 4.4668 4.5ZM8.7168 1.75C7.98745 1.75 7.28798 2.03973 6.77225 2.55546C6.25653 3.07118 5.9668 3.77065 5.9668 4.5C5.9668 5.22934 6.25653 5.92882 6.77225 6.44454C7.28798 6.96027 7.98745 7.25 8.7168 7.25C9.44614 7.25 10.1456 6.96027 10.6613 6.44454C11.1771 5.92882 11.4668 5.22934 11.4668 4.5C11.4668 3.77065 11.1771 3.07118 10.6613 2.55546C10.1456 2.03973 9.44614 1.75 8.7168 1.75ZM4.7168 11.75C4.12006 11.75 3.54776 11.9871 3.12581 12.409C2.70385 12.831 2.4668 13.4033 2.4668 14V15.188C2.4668 15.206 2.4798 15.222 2.4978 15.225C6.6168 15.897 10.8178 15.897 14.9358 15.225C14.9445 15.2236 14.9525 15.219 14.9582 15.2122C14.9639 15.2055 14.9669 15.1969 14.9668 15.188V14C14.9668 13.4033 14.7297 12.831 14.3078 12.409C13.8858 11.9871 13.3135 11.75 12.7168 11.75H12.3768C12.35 11.7498 12.3233 11.7538 12.2978 11.762L11.4328 12.045C9.66797 12.6212 7.76562 12.6212 6.0008 12.045L5.1348 11.762C5.10991 11.754 5.08393 11.75 5.0578 11.75H4.7168ZM0.966797 14C0.966797 13.0054 1.36189 12.0516 2.06515 11.3483C2.76841 10.6451 3.72223 10.25 4.7168 10.25H5.0568C5.2418 10.25 5.4258 10.28 5.6008 10.336L6.4668 10.619C7.92884 11.0962 9.50476 11.0962 10.9668 10.619L11.8328 10.336C12.0078 10.279 12.1918 10.25 12.3758 10.25H12.7168C13.7114 10.25 14.6652 10.6451 15.3684 11.3483C16.0717 12.0516 16.4668 13.0054 16.4668 14V15.188C16.4668 15.942 15.9208 16.584 15.1768 16.705C10.8984 17.4034 6.53515 17.4034 2.2568 16.705C1.89672 16.6464 1.56924 16.4616 1.33291 16.1837C1.09657 15.9057 0.966802 15.5528 0.966797 15.188V14Z"
        fill={fillColor}
      />
    </svg>
  );
}
function PremiumTracker({ fillColor }: { fillColor: string }) {
  return (
    <svg
      width="17"
      height="21"
      viewBox="0 0 17 21"
      fill={fillColor}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.16948 11.3996L7.03194 8.54316L4.7623 6.87691H7.5988L8.4668 3.99059L9.3359 6.87691H12.1713L9.89501 8.54206L10.7586 11.3996L8.4668 9.62595L6.16948 11.3996ZM2.93108 20.4616V13.1655C2.22989 12.4754 1.68555 11.6672 1.29805 10.7408C0.910547 9.81675 0.716797 8.82696 0.716797 7.77148C0.716797 5.61108 1.46818 3.7795 2.97094 2.27674C4.4737 0.773973 6.30565 0.022223 8.4668 0.0214849C10.6279 0.0207468 12.4599 0.772127 13.9627 2.27563C15.4654 3.77913 16.2168 5.61108 16.2168 7.77148C16.2168 8.82622 16.023 9.81638 15.6355 10.7419C15.248 11.6675 14.7037 12.4746 14.0025 13.1633V20.4593L8.4668 18.7986L2.93108 20.4616ZM8.4668 14.4143C10.312 14.4143 11.8805 13.7685 13.1722 12.4768C14.4638 11.1852 15.1097 9.61672 15.1097 7.77148C15.1097 5.92625 14.4638 4.35779 13.1722 3.06613C11.8805 1.77446 10.312 1.12863 8.4668 1.12863C6.62156 1.12863 5.05311 1.77446 3.76144 3.06613C2.46977 4.35779 1.82394 5.92625 1.82394 7.77148C1.82394 9.61672 2.46977 11.1852 3.76144 12.4768C5.05311 13.7685 6.62156 14.4143 8.4668 14.4143ZM4.03823 18.8916L8.4668 17.6505L12.8954 18.8916V14.0977C12.2783 14.5516 11.5923 14.9022 10.8372 15.1495C10.0836 15.3975 9.29346 15.5215 8.4668 15.5215C7.64013 15.5215 6.85 15.3979 6.0964 15.1506C5.34281 14.9033 4.65675 14.5524 4.03823 14.0977V18.8916Z"
        fill={fillColor}
      />
    </svg>
  );
}

const Index = ({setDataPresent}:{setDataPresent:any}) => {
  const [trackerType, setTrackerType] = useState("All Trackers");
  const [allTracker, setAllTracker] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [page, setPage] = useState(0);
  const [trackerPerPage, setTrackerPerPage] = useState(4);
  const [totalPage, setTotalPage] = useState<number>(0);

  // Replace with your actual base URL

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await myFetch(
        `${baseUrl}/tracker?offset=${
          page * trackerPerPage
        }&limit=${trackerPerPage}`
      );

      if (error) {
        setError("Create your first tracker!");
        setLoading(false);
        console.log(error);
        <div>error</div>;
        return;
      } else if (data) {
        if(data.trackerData.length===0)  setDataPresent(false);
        setAllTracker(data.trackerData);
        setTotalPage(Math.ceil(data.totalCount / trackerPerPage));
        setLoading(false);
      } else {
        // setError('Nothing to show, create a tracker!');
        setLoading(false);
      }
    };

    fetchData();
  }, [page, trackerPerPage]);

  const handleNextPage = () => {
    if (page < totalPage - 1) {
      setPage(page + 1);
      setAllTracker([]);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
      setAllTracker([]);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.containerLeft}>
        {/* <div className={styles.leftContainer}>
          <div className={`${styles.heading} ${trackerType === "All Trackers" ? styles.active : ""}`} onClick={() => setTrackerType("All Trackers")}>
            <AllTrackers fillColor={trackerType === "All Trackers" ? "#6750A4" : "#696B83"} /> All Trackers
          </div>
          <div
            className={`${styles.heading} ${
              trackerType === "Custom Trackers" ? styles.active : ""
            }`}
            onClick={() => setTrackerType("Custom Trackers")}
          >
            <CustomeTracker
              fillColor={
                trackerType === "Custom Trackers" ? "#6750A4" : "#696B83"
              }
            />{" "}
            Custom Trackers
          </div>
          <div className={`${styles.heading} ${trackerType === "Premium Trackers" ? styles.active : ""}`} onClick={() => setTrackerType("Premium Trackers")}>
            <PremiumTracker fillColor={trackerType === "Premium Trackers" ? "#6750A4" : "#696B83"} /> Premium Trackers
          </div>       
           </div> */}
      </div>
      <div style={{ width: "100%" }}>
      {loading && <Loading/>}
        <div className={styles.containerRight}>
          
          {error && <div>{error}</div>}
          {allTracker.length > 0 &&
            (trackerType === "All Trackers" ||
              trackerType === "Custom Trackers") &&
            allTracker.map((item, id) => <Trackers key={id} item={item} />)}
          {allTracker.length === 0 && !loading && (
            <div>Create your first tracker!</div>
          )}
          {/* {trackerType === "Premium Trackers" && <div>Create your first tracker!</div>} */}
        </div>
        {totalPage > 1 &&
          (trackerType === "All Trackers" ||
            trackerType === "Custom Trackers") &&
          !loading && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "15px",
              }}
            >
              <div className={styles.btn} onClick={handlePrevPage}>
                Prev
              </div>
              <div className={styles.btn} onClick={handleNextPage}>
                Next
              </div>
            </div>
          )}
      </div>
    </div>
  );
};
export default Index;
