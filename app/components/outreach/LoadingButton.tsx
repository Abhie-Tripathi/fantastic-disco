import styles from './loadingbutton.style.module.css'

interface Props {
    height?: string,
    width?: string,
    text?: string,
}


export const LoadingButton = (props: Props) => {
    const customStyle = {
        s1: {
            // height: props.height,
            // width: props.width,
            // padding: "10px 20px"
        }
    };


    return (
        <button className={styles.load_btn} style={customStyle.s1} disabled={true} >
            <img className={styles.spinner} src="/spinner.svg" ></img>
            &nbsp;{props.text}
        </button>
    );
}