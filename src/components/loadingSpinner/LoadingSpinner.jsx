import styles from "./loadingSpinner.module.css"

export default function LoadingSpinner({message}){

    return(
        <div className={styles.container}>
            <div className={styles.inner}>
                <div className={styles.spinner}></div>
                <p className={styles.text}>{message}</p>
            </div>
        </div>
    );
}