"use client";
import styles from "./page.module.css";
export default function Error() {
  return (
    <h1 className={styles.error}>
      Uh,oh! You broke it <span>🤷‍♂️</span>
    </h1>
  );
}
