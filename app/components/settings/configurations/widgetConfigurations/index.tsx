import React,{useEffect, useState} from "react";
import styles from "./widgetConfig.module.css";
import StickyTopWigitCard from "./StickyTopwigitCard";
import PageWigitCard from './PageWigetCard'
const index = () => {
  const [widgets, setWidgets] = useState<any>();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsePage = await fetch('https://api.eventgeni.com/widgets?type=page');
        const responseSticky = await fetch('https://api.eventgeni.com/widgets?type=sticky');
        const dataPage = await responsePage.json();
        const dataSticky = await responseSticky.json();
        const allWidgets = [...dataPage, ...dataSticky];
        setWidgets(allWidgets);
      } catch (error) {
        console.error('Error fetching widgets:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div  className={`${styles.container} ${styles.deleteModal ? styles.blur : ""}`}>
   
      <div className={styles.gradient_border}>Wigets Configurations</div>
      <div className={styles.textContainer}>
        You can manage and configure all the widgets currently enabled here{" "}
      </div>

      <div className={styles.wigitCard_container}>

      {widgets?.length > 0 ? (
        widgets.map((item : any, index : number) => (
          <div key={index}>
           <StickyTopWigitCard data={item}/>  
          </div>
        ))
      ) : (
        "No widgets Added"
      )}
        {/* <StickyTopWigitCard />
        <PageWigitCard/> */}
      </div>
    </div>
  );
};

export default index;
