import React from "react";

import styles from "./Footer.module.css";
import Brick from "../assets/brick.svg?react";

export const Footer = (): React.JSX.Element => {
  return (
    <footer className={styles.footer}>
      Made with <span className={styles.heart}>❤</span> by{" "}
      <span title="EDB-gjengen">
        <Brick className={styles.brick} />
      </span>
    </footer>
  );
};
