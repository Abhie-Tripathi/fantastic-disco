'use client'
import Image from "next/image";
import styles from './shareModal.style.module.css';
import crossIcon from "/public/close.svg";
import { useTheme } from '@/context';
import shareImg from '/public/share_banner.png';
import facebookIcon from '/public/facebook_icon.svg';
import instagramIcon from '/public/instagram_icon.svg';
import linkedinIcon from '/public/linkedin_icon.svg';
import xIcon from '/public/x_icon.svg';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";
import Tags from "./Tags";

interface Props {
  handleShareModal: () => void
}

const ShareModal = ({ handleShareModal }: Props) => {

  const closeModal = () => {
    handleShareModal();
  }
  const { theme } = useTheme();

  const urlString = "https://console.eventgeni.com/internal";

  const copyURL = () => {
    navigator.clipboard.writeText(urlString);
    toast.success('Copied!', {
      position: 'top-center',
      autoClose: 2000,
    });
  }

  const getShareLink = (type: string) => {
    let shareLink: string = '';

    switch (type) {
      case 'facebook':
        shareLink = 'https://www.facebook.com/sharer/sharer.php?u=';
        break;
      case 'twitter':
        shareLink = 'https://twitter.com/intent/tweet?&url=';
        break;
      case 'linkedin':
        shareLink = 'https://www.linkedin.com/shareArticle?mini=true&url=';
        break;
      case 'instagram':
        shareLink = "";
        break;
    }

    const finalLink = shareLink + urlString;
    return finalLink;
  }

  return (
    <div className={styles["modalContainer"]} >
      <div className={`${styles["modal"]} ${theme === 'light' ? styles.modal_light : ""}`} >
        <header className={styles["modal_header"]}>
          <div className={styles["modal_header-title"]}>Share Campaign Post</div>
          <button className={styles["close"]} onClick={() => closeModal()} >
            <Image src={crossIcon} alt="clock" width={16} height={16} />
          </button>
        </header>
        <main className={styles["modal_content"]} style={{ padding: "30px 1.8rem" }}>
          <div className={styles["left_container"]} >
            <div className={styles.inputOuterContainer}>
              <div className={styles.inputLabel}>Campaign Name</div>
              <div className={styles.inputInnerContainer}>
                <input
                  type='text'
                  placeholder="Event Promotion"
                />
              </div>
            </div>
            <div className={styles.inputOuterContainer}>
              <div className={styles.inputLabel}>Post Body</div>
              <div className={styles.inputInnerContainer}>
                <textarea
                  placeholder="Lorem ipsum dolor sit amet consectetur. In sit eget non aliquet nisi. Eu dictum sit fermentum lectus."
                  className={styles.textAreaInput}
                  rows={4}></textarea>
              </div>
            </div>
            <div className={styles.inputOuterContainer}>
              <div className={styles.inputLabel}>Tags</div>
              <Tags />
            </div>
            <div className={styles.inputOuterContainer}>
              <div className={styles.inputLabel}>Copy URL</div>
              <div className={styles.inputInnerContainer} style={{ gap: "20px" }} >
                <input
                  type='text'
                  value={urlString}
                />
                <div className={styles.copyBtn} onClick={copyURL}>Copy</div>
              </div>
            </div>
            <div className={styles.inputOuterContainer}>
              <div className={styles.inputLabel}>Share on</div>
              <div className={styles.shareIconContainer}>
                <Link href={getShareLink('facebook')} target="_blank" >
                  <Image src={facebookIcon} alt="clock" width={30} height={30} />
                </Link>
                <Link href={getShareLink('twitter')} target="_blank" >
                  <Image src={xIcon} alt="clock" width={30} height={30} />
                </Link>
                <Link href={getShareLink('linkedin')} target="_blank" >
                  <Image src={linkedinIcon} alt="clock" width={30} height={30} />
                </Link>
                <Link href={getShareLink('instagram')} target="_blank" >
                  <Image src={instagramIcon} alt="clock" width={30} height={30} />
                </Link>
              </div>
            </div>
          </div>
          <div className={styles["right_container"]} >
            <Image src={shareImg} className={styles["share_image"]} alt="image" />
          </div>
        </main>
      </div>
    </div>
  )
}

export default ShareModal