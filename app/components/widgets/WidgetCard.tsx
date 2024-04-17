'use client'
import React, { useEffect, useState } from 'react'
import Styles from './widgetCard.module.css'
import Analytics from './Analytics'
import Calendar from '/public/vector.svg'
import Image from 'next/image'
import Spinner from '/public/Icon.svg'
import Link from 'next/link'
import Delete from '/public/delete.svg'
import DeleteModal from './DeleteModal'
import useFetch from '@/hooks/useFetch'

const WidgetCard = (props: any) => {

  const data = props.data;
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [activeState, setActiveState] = useState("")

  const handleModal = () => {
    setDeleteModal(!deleteModal)
  }

  useEffect(() => {
    const fetchWidgetData = async () => {
      try {
        const response = await fetch(`https://api.eventgeni.com/widgets/${data.id}?type=page`);
        const widgetData = await response.json();
        const formBody = JSON.parse(widgetData.body)

        if (formBody.active) {
          setActiveState("Active")
        } else {
          setActiveState("Inactive")
        }

        if (!response.ok) {
          throw new Error('Failed to fetch widget data');
        }
      } catch (error) {
        console.error('Error fetching widget data:', error);
      }
    };
    fetchWidgetData();
  }, [])


  return (
    <div className={Styles.container}>
      <div className={`${Styles.card} ${deleteModal ? Styles.blur : ''}`}>
        <div className={Styles.cardSec1}>
          <div className={Styles.iconCircle}><Image src={Spinner} alt="icon" /></div>
          <div className={Styles.eventDetail}>
            <div style={{ display: "flex" }}><Image src={Calendar} alt="calendar" /></div>
            <div className={Styles.date}>1st Apr 2024</div>
            <div>-</div>
            <div className={Styles.date}>30th Apr 2024</div>
          </div>
          <Link className={Styles.configure} href={`/widget/${data.id}`}>Configure</Link>
          <Image src={Delete} alt='delete' className={Styles.delete} onClick={handleModal} />
          <div className={Styles.statusBtn}>
            <div className={`${Styles.activeFlag} ${activeState === "Inactive" ? Styles.inactiveFlag : ''}`}></div>
            <div className={`${Styles.status} ${activeState === "Inactive" ? Styles.inactiveStatus : ''}`}>{activeState}</div>
          </div>
        </div>
        <div className={Styles.cardSec2}>
          <div className={Styles.type}>
            <div className={Styles.typeHead}>Widget Type</div>
            <div className={Styles.typeBtn}>{data.name.toUpperCase()}</div>
          </div>
          <div className={Styles.line}></div>
          <div className={Styles.type}>
            <div className={Styles.typeHead}>Geography</div>
            <div className={Styles.typeBtn}>India</div>
          </div>
          <div className={Styles.line}></div>
          <div className={Styles.type}>
            <div className={Styles.typeHead}>Event Category</div>
            <div className={Styles.allTypeBtn}>
              <div className={Styles.typeBtn}>Hospitality</div>
              <div className={Styles.typeBtn}>Festivals</div>
            </div>
          </div>
          <div className={Styles.line}></div>
          <div className={Styles.type}>
            <div className={Styles.typeHead}>Event Type</div>
            <div className={Styles.allTypeBtn}>
              <div className={Styles.typeBtn}>Seminar</div>
            </div>
          </div>
          <div className={Styles.line}></div>
          <div className={Styles.type}>
            <div className={Styles.typeHead}>Event Format</div>
            <div className={Styles.allTypeBtn}>
              <div className={Styles.typeBtn}>Exhibition</div>
            </div>
          </div>
          <div className={Styles.line}></div>
          <div className={Styles.type}>
            <div className={Styles.typeHead}>Mode of Participation</div>
            <div className={Styles.allTypeBtn}>
              <div className={Styles.typeBtn}>Virtual</div>
            </div>
          </div>
        </div>
        <div className={Styles.cardSec3}>
          <Analytics />
        </div>
      </div>
      <div className={Styles.deleteModal}>
        {deleteModal && <DeleteModal type={data.name.toLowerCase()} id={data.id} handleModal={handleModal} />}
      </div>
    </div>
  )
}

export default WidgetCard
