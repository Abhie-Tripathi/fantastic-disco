import styles from "./usercard.module.css";

const UserCard = () => {
  return (
    <div className={styles.container}>
      <div className={styles.profilePic}></div>
      <div className={styles.userDetails}>
        <div className={styles.userInfo}>
          <span>Ashwani Maddheshiya</span>
          <span style={{ fontSize: "13px" }}>Software Developer</span>
        </div>
        <div className={styles.emailInfo}>ashwani@10times.com</div>
      </div>
    </div>
  );
};

export default UserCard;
