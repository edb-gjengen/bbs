import React from "react";

import { ReactComponent as Brick } from "../assets/brick.svg";
import styles from "./Footer.module.css";

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      Made with <span className={styles.heart}>❤</span> by{" "}
      <span title="EDB-gjengen">
        <Brick className={styles.brick} />
      </span>
    </footer>
  );
};
