import styles from "./progressbar.style.module.css";

interface LoadingProps {
  value: number;
  color?: string;
  label?: string;
}

const ProgressBar = ({ value, color, label }: LoadingProps) => {
    const barColor = {
        backgroundColor: color ? color : 'var(--primary-color)',
        width: value ? `${value}%` : '100%'
    }
    
  return (
    <div className={styles.container}>
      <span className={styles.label}>{label}</span>
      <div className={styles.barContainer}>
        <div className={styles.bar} style={barColor}></div>
      </div>
    </div>
  );
};

export default ProgressBar;