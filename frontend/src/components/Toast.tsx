import clsx from "clsx";
import React, { useEffect, useRef } from "react";

import styles from "./Toast.module.css";
import { useToast } from "./ToastProvider";

export const Toast: React.FC = () => {
  const ref = useRef<HTMLInputElement>(null);
  const { visible, showToast, message, background } = useToast();

  const classes = clsx(`bg-${background}`, styles.toast);

  useEffect(() => {
    if (!ref.current) return;

    if (visible) {
      // TODO
      console.log("TODO: show");
    } else if (!visible) {
      // TODO
      console.log("TODO: hide");
    }
    // TODO
    return () => console.log("TODO: hide");
  }, [visible]);

  return (
    <div ref={ref} className={classes} role="alert" aria-live="assertive" aria-atomic="true">
      <div>{message}</div>
      <button type="button" aria-label="Close" onClick={() => showToast(message)} />
    </div>
  );
};
