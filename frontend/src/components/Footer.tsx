import React from "react";

import Brick from "../assets/brick.svg?react";
import styles from "./Footer.module.css";

export const Footer = (): JSX.Element => {
  return (
    <footer className={styles.footer}>
      Made with <span className={styles.heart}>❤</span> by{" "}
      <span title="EDB-gjengen">
        <Brick className={styles.brick} />
      </span>
    </footer>
  );
};
