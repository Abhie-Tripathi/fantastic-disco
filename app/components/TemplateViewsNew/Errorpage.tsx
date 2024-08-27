'use client'
import React from 'react'
import styles from './error.style.module.css'
import WidgetIdEmptyIcon from '/public/widgetimages/emptyimages/widgetempty.svg'
import WidgetListEmptyIcon from '/public/widgetimages/emptyimages/widgetlistempty.svg'
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Props {
  type: string;
}

const Errorpage = ({ type }: Props) => {
  const router = useRouter()
  const handleRouting = () => {
    if (type === "id") {
      router.push("/widget/list")
    }
    else router.push("/widget/add")
  }
  return (
    <div className={styles.body}>
      {(type === "id" || type === "detail") && <Image src={WidgetIdEmptyIcon} alt="empty" />}
      {type === "list" && <Image src={WidgetListEmptyIcon} alt="empty" />}

      {type === "id" && <div>Page not found</div>}
      {type === "list" && <div>No Widget Added</div>}
      {type === "detail" && <div>Page not found</div>}

      {type === "id" ? (
        <span>We can&apos;t find the widget you&apos;re looking for. It seems the ID might be invalid</span>
      ) : type === "list" ? (
        <span>Start by building your first widget—it&apos;s as easy as drag, drop, and customize.</span>
      ) : (
        <span>We can&apos;t find the page you&apos;re looking for. It seems the ID might be invalid</span>
      )}

      {type === "id" ? (
        <span>Try checking the link, or view the dashboard for details.</span>
      ) : type === "list" ? (
        <span>Your journey to a perfect dashboard begins here!</span>
      ) : (
        <span>Try checking the link.</span>
      )}

      {(type === "id" || type === "list") && (
        <button onClick={handleRouting}>
          {type === "id" ? "Dashboard" : "Create Widget"}
        </button>
      )}
    </div>
);

}

export default Errorpage