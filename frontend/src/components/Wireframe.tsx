import React from "react";

import styles from "./Wireframe.module.css";

export const Wireframe = () => (
  <div className={styles.wireframe}>
    {[...Array(64)].map((_, idx) => (
      <div key={idx} className={styles.cell} />
    ))}
  </div>
);
