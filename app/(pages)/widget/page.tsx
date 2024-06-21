"use client"
import React, { useState, useEffect } from 'react'
import WidgetCard from '../../components/widgets/WidgetCard'
import More from '/public/more_horiz.svg'
import Styles from './page.module.css'
import Add from '/public/add.svg'
import Image from 'next/image';
import Link from 'next/link'
import SkeletonWidget from '@/app/components/widgets/SkeletonWidget'
import { useTheme } from '@/context'
import LeftArrowIcon from '/public/leftArrow.svg'
import RightArrowIcon from '/public/rightArrow.svg'
import DraftWidgets from "@/app/components/TemplateViews/draftwidgets/DraftWidgets";

interface DraftWidget {
  widgetType: string;
  preview: string;
}

const Widget = () => {

  const [widgets, setWidgets] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const widgetsPerPage = 3;
  const { theme } = useTheme()
  const [deleteId, setDeleteId] = useState("");
  // const [draftWidgets, setDraftWidgets] = useState<DraftWidget[]>([]);
  const [draftwidgetsLength, setDraftwidgetsLength]= useState<number>();
  const [draftModal, setDraftModal] = useState<boolean>(false)

  const iconClass = theme === 'light' ? Styles.icons_light : Styles.icon;
  let totalPages = 1
  if (widgets.length > 0) {
    totalPages = Math.ceil(widgets.length / widgetsPerPage);
  }
  const fetchData = async (type: string): Promise<any[]> => {
    try {
      const response = await fetch(`https://api.eventgeni.com/widgets?type=${type}`);
      const data = await response.json();
      return data.data[type + 'Data'];
    } catch (error) {
      console.error('Error fetching widgets:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchAllWidgets = async () => {
      try {
        const pageWidgets = await fetchData('page');
        const stickyWidgets = await fetchData('sticky');
        const allWidgets = [...pageWidgets, ...stickyWidgets];
        const sortedWidgets = allWidgets.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
        setWidgets(sortedWidgets);
      } catch (error) {
        console.error('Error fetching widgets:', error);
      }
    };
    fetchAllWidgets();
    const storedDraftWidgets = localStorage.getItem('draftWidgets');
    if (storedDraftWidgets) {
      setDraftwidgetsLength(JSON.parse(storedDraftWidgets).length);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0); // To scroll up when ever page changes
  }, [currentPage])

  // Pagination Logic
  const indexOfLastWidget = currentPage * widgetsPerPage;
  const indexOfFirstWidget = indexOfLastWidget - widgetsPerPage;
  const currentWidgets = widgets.slice(indexOfFirstWidget, indexOfLastWidget);

  const handlePrevPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }

  }
  const handleNextPage = () => {
    if (currentPage !== totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }

  }
  // To see the live deletion of widget, else if we use "widget" as dependency array, it will go in infinite loop
  useEffect(() => {
    if (deleteId) {
      window.location.reload(); // Reload the page when deleteId changes
    }
  }, [deleteId])

  return (
    <div className={`${Styles.outerContainer}`}>
      <div className={`${Styles.containerOne} ${theme === 'light' ? Styles.containerOne_light : ""}`}>
        <div className={Styles.c1left}>Widgets <span className={Styles.widgetCount}>{`${widgets.length > 0 ? `(${widgets.length})` : ``}`}</span></div>
        <div className={Styles.c1right}>
          <div className={Styles.threeDots}><Image src={More} alt="more" /></div>
          <div className={Styles.savedDraftsContainer} onClick={() => setDraftModal(true)}>
            <div className={Styles.savedDraftHeading}>Saved Drafts</div>
            <div className={Styles.savedDraftNumber}>{draftwidgetsLength}</div>
          </div>
          <Link className={Styles.addBtn} href={"/widget/add"}>
            <div><Image src={Add} alt="add" className={iconClass} /></div>
            <div>Add Widget</div>
          </Link>
        </div>
      </div>
      {currentWidgets.length > 0 ? (
        currentWidgets.map((item, index) => (
          <div key={index} className={Styles.containerTwo}>
            <WidgetCard data={item} setDeleteId={setDeleteId} />
          </div>
        ))
      ) : (
        <SkeletonWidget />
      )}
      <div className={Styles.paginationContainer}>
        <div className={`${Styles.paginationBtnContainer} ${currentPage === 1 ? Styles.inactivePaginationBtn : ""}`} onClick={handlePrevPage}>
          <Image src={LeftArrowIcon} alt='prev' className={Styles.paginationIcon} />
          <div className={Styles.paginationHeading}>Prev</div>
        </div>
        <div className={Styles.pageNumberContainer}>
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            return (
              <div key={pageNumber} className={`${Styles.pageNumber} ${pageNumber === currentPage ? Styles.activePageNumber : ""}`} onClick={() => setCurrentPage(pageNumber)}>
                {pageNumber}
              </div>
            );
          })}
        </div>
        <div className={`${Styles.paginationBtnContainer} ${currentPage === totalPages ? Styles.inactivePaginationBtn : ""}`} onClick={handleNextPage}>
          <div className={Styles.paginationHeading}>Next</div>
          <Image src={RightArrowIcon} alt='next' className={Styles.paginationIcon} />
        </div>
      </div>
      <div className={`${Styles.draftsModal} ${draftModal ? Styles.open : ''}`}>
        <DraftWidgets setYourWidgetModal={setDraftModal} />
      </div>
    </div>
  )
}

export default Widget