import { Toast as BSToast } from "bootstrap";
import clsx from "clsx";
import React, { useEffect, useRef } from "react";

import styles from "./Toast.module.css";
import { useToast } from "./ToastProvider";

export const Toast: React.FC = () => {
  const ref = useRef<HTMLInputElement>(null);
  const { visible, showToast, message } = useToast();

  const classes = clsx("toast align-items-center text-white bg-primary border-0", styles.toast);

  useEffect(() => {
    if (!ref.current) return;
    const bsToast = BSToast.getInstance(ref.current) || new BSToast(ref.current);

    if (visible) {
      bsToast?.show();
    } else if (!visible) {
      bsToast?.hide();
    }
    return () => bsToast?.hide();
  }, [visible]);

  return (
    <div ref={ref} className={classes} role="alert" aria-live="assertive" aria-atomic="true">
      <div className="d-flex">
        <div className="toast-body">{message}</div>
        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
          onClick={() => showToast(message)}
        />
      </div>
    </div>
  );
};
