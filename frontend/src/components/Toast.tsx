import clsx from "clsx";
import React from "react";

import styles from "./Toast.module.css";
import { useToast } from "./ToastProvider";

export const Toast: React.FC = () => {
  const { showToast, message, background, visible } = useToast();

  const classes = clsx([styles[background], styles.toast], { [styles.visible]: visible });

  return (
    <div className={classes} role="alert" aria-live="assertive" aria-atomic="true">
      <div>{message}</div>
      <button type="button" aria-label="Close" onClick={() => showToast(message)} className={styles.close} />
    </div>
  );
};
