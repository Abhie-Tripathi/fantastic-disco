'use cleint'
import React, { useState } from 'react'
import Styles from './widgetCard.module.css'
import Analytics from './Analytics'
import Calendar from '/public/vector.svg'
import Image from 'next/image'
import Spinner from '/public/Icon.svg'
import Link from 'next/link'
import Delete from '/public/delete.svg'
import DeleteModal from './DeleteModal'

const WidgetCard = (props: any) => {

  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const handleModal = ()=>{
    setDeleteModal(!deleteModal)
  }

  const data = props.data;
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
            <div className={Styles.activeFlag}></div>
            <div className={Styles.status}>Active</div>
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
        {deleteModal && <DeleteModal type={data.name.toLowerCase()} id={data.id} handleModal = {handleModal} />}
      </div>
    </div>
  )
}

export default WidgetCard
