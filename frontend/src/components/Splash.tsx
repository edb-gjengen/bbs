import clsx from "clsx";
import React from "react";

import styles from "./Splash.module.css";

interface SplashProps {
  brandText?: string;
  noOverlay?: boolean;
}

export const Splash = ({ brandText = "BBS", noOverlay = false }: SplashProps): JSX.Element => (
  <div className={clsx(styles.splash, { [styles.overlay]: !noOverlay })}>
    <div className={styles.wrap}>
      <div className={styles.sun}></div>
      <div className={styles.brand}>{brandText}</div>
      <div className={styles.subtitle}>Biceps Bar System</div>
    </div>
  </div>
);
