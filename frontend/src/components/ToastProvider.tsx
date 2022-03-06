import React, { ReactNode, useContext, useState } from "react";

type Background = "primary" | "danger";

interface ToastProps {
  visible: boolean;
  message: string;
  showToast: (message: string, background?: Background) => void;
  hide: () => void;
  background: Background;
}

const defaultState = {
  // FIXME: revert
  visible: false,
  message: "",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  showToast: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  hide: () => {},
  background: "primary" as Background,
};

const ToastContext = React.createContext<ToastProps>(defaultState);

type ToastProviderProps = {
  children: ReactNode;
};
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [visible, setVisible] = useState(defaultState.visible);
  const [message, setMessage] = useState(defaultState.message);
  const [background, setBackground] = useState(defaultState.background);

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

export const useToast = (): ToastProps => useContext(ToastContext);
