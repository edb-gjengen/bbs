import React, { useState } from "react";
import type { ReactNode } from "react";

import { ToastContext, defaultToastState } from "../contexts/ToastContext";
import type { Background } from "../contexts/ToastContext";

type ToastProviderProps = {
  children: ReactNode;
};

export const ToastProvider = ({ children }: ToastProviderProps): React.JSX.Element => {
  const [visible, setVisible] = useState(defaultToastState.visible);
  const [message, setMessage] = useState(defaultToastState.message);
  const [background, setBackground] = useState(defaultToastState.background);

  const showToast = (newMessage: string, background: Background = "primary") => {
    setMessage(newMessage);
    setBackground(background);
    if (!visible) {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
      }, 3000);
    }
  };
  const hide = () => {
    setVisible(true);
    setMessage("");
  };
  return (
    <ToastContext.Provider value={{ visible, showToast, message, hide, background }}>{children}</ToastContext.Provider>
  );
};
