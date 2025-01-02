'use client'
import React, { useEffect, useState,useRef } from 'react'
import styles from './page.style.module.css'
import InputComponent from '@/app/components/TemplateViewsNew/WidgetDashboard/InputComponent'
import DashboardBrandkit from '@/app/components/TemplateViewsNew/WidgetDashboard/DashboardBrandkit'
import DashboardWidgets from '@/app/components/TemplateViewsNew/WidgetDashboard/DashboardWidgets'
import DashboardEvents from '@/app/components/TemplateViewsNew/WidgetDashboard/DashboardEvents'
import { myFetch } from '@/utils/myFetch'
import { baseUrl } from '@/constants'
import { useBrandKitServices } from '@/services/geniservices/brandkitService'
import  { Step } from "react-joyride";
import Tooltip from '@/app/components/internal/walkthrough/Tooltip'
import dynamic from "next/dynamic";
const Page = () => {

  const [fetchedBoolean, setFetchedBoolean] = useState<boolean>(false); // To check if atleast once the user has fetched the brandkit
  const [brandkitLoadingState, setBrandkitLoadingState] = useState<boolean>(true)
  const [polling, setPolling] = useState<boolean>(true);
  const [fetchedDomain, setFetchedDomain] = useState<string>("")
  const [brandkitFetched, setBrandkitFetched] = useState<boolean>(true)
  const [runJoyride, setRunJoyride] = useState<boolean>(false);
  const [removeCalled, setRemoveCalled] = useState<boolean>(false) // This is a variable so that when ever a widget is deleted we can call the function in input container to make the button disbaled 
  const { getBrandkit } = useBrandKitServices()

  const [steps, setSteps] = useState<Step[]>([]);
  const Joyride = dynamic(() => import("react-joyride"), { ssr: false });
  const dashboardRef = useRef(null);
  const widgetRef = useRef(null);
  // const dashboardRef = useRef(null);
  // const dashboardRef = useRef(null);
  // This is to see if the brandkit was used atleast once by user
  // const checkBrandkit = async()=>{
  //   const {data,error} = await myFetch(`${baseUrl}/kit`)
  //   if(error){
  //     console.log(error);
  //     return
  //   }
  //   if(data.domain.domain){
  //     setFetchedBoolean(true)
  //   }
  // }
  const checkBrandkit = async () => {
    try {
      const res: any = await getBrandkit();
      console.log("domain________", res)
        //  if (!res?.domain?.domain || !Object.keys(res?.otherData || {}).length) {
        //   // if (res?.domain?.domain ) {
        //     setRunJoyride(true);
        //     const newSteps: Step[] = [];
        //     if (dashboardRef.current) {
        //       newSteps.push({
        //         target: dashboardRef.current,
        //         title: "Brandkit",
        //         content:
        //          "You can fetch your brandkit here.",
        //         disableBeacon: true,
        //         placement: "auto",
        //         spotlightPadding: 10,
        //       });
             
        //     }
        //     // if (widgetRef.current) {
        //     //   newSteps.push({
        //     //     target: widgetRef.current,
        //     //     title: "Widget",
        //     //     content: "You can create new widget from here.",
        //     //     disableBeacon: true,
        //     //     placement: "auto",
        //     //     spotlightPadding: 10,
        //     //   });
        //     // }
        //     setSteps(newSteps)
        //   }
      if (res.domain.domain) {
        setFetchedBoolean(true)
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }

 

  // useEffect(() => {
  //   if (runJoyride) {
  //     const newSteps: Step[] = [];
  //     if (dashboardRef.current) {
  //       newSteps.push({
  //         target: dashboardRef.current,
  //         title: 'Brandkit',
  //         content: 'You can fetch your brandkit from here.',
  //         disableBeacon: true,
  //         placement: 'auto',
  //         spotlightPadding: 10,
  //       });
  //     }
  //     if (widgetRef.current) {
  //       newSteps.push({
  //         target: widgetRef.current,
  //         title: 'Widget',
  //         content: 'You can create new widget from here.',
  //         disableBeacon: true,
  //         placement: 'auto',
  //         spotlightPadding: 10,
  //       });
  //     }
  //     setSteps(newSteps);
  //   }
  // }, [runJoyride, fetchedBoolean]);

  
  useEffect(() => {
    checkBrandkit()
  }, [])

  return (
    <div className={styles.body}>
      {/* <Joyride
             tooltipComponent={(props) => (
                <Tooltip {...props} totalSteps={steps.length} />
              )}
        steps={steps}
        run={runJoyride}
        continuous
        showProgress
        showSkipButton
        styles={{
          options: {
            arrowColor: "#fff",
            backgroundColor: "#ffffff",
            overlayColor: "rgba(0, 0, 0, 0.5)",
            primaryColor: "#000",
            textColor: "#000",
            zIndex: 2000,
          },
        }}
        callback={(data) => {
          if (data.status === "finished" || data.status === "skipped" ) {
            setRunJoyride(false);
          }
        }}
      /> */}
      <div  className={fetchedBoolean ? styles.fetchedInputScreen : styles.inputScreen}>
          <InputComponent ref={dashboardRef} removeCalled={removeCalled} setBrandkitFetched={setBrandkitFetched} fetchedDomain={fetchedDomain} setFetchedDomain={setFetchedDomain} setPolling={setPolling} setBrandkitLoadingState={setBrandkitLoadingState} setFetchedBoolean={setFetchedBoolean} fetched={fetchedBoolean} />
      </div>
      {fetchedBoolean && <div className={styles.container}>
        <div className={styles.brandKitContainer}><DashboardBrandkit setBrandkitFetched={setBrandkitFetched} brandkitFetched={brandkitFetched} setFetchedDomain={setFetchedDomain} polling={polling} setPolling={setPolling} setBrandkitLoadingState={setBrandkitLoadingState} brandkitLoadingState={brandkitLoadingState} /></div>
        <div className={styles.widgetEventsContainer}>
          <div className={styles.widgetContainer}><DashboardWidgets ref={widgetRef} removeCalled={removeCalled} setRemoveCalled={setRemoveCalled} /></div>
          <div className={styles.eventContainer}><DashboardEvents /></div>
        </div>
      </div>}
    </div>
  )
}

export default Page