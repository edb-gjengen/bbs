import React, { ReactNode, useContext, useState } from "react";

interface ToastProps {
  visible: boolean;
  message: string;
  showToast: (message: string) => void;
  hide: () => void;
}

const defaultState = {
  visible: false,
  message: "",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  showToast: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  hide: () => {},
};

const ToastContext = React.createContext<ToastProps>(defaultState);

type ToastProviderProps = {
  children: ReactNode;
};
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [visible, setVisible] = useState(defaultState.visible);
  const [message, setMessage] = useState("");

  const showToast = (newMessage: string) => {
    setMessage(newMessage);
    if (!visible) {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
        setMessage("");
      }, 3000);
    }
  };
  const hide = () => {
    setVisible(true);
    setMessage("");
  };
  return <ToastContext.Provider value={{ visible, showToast, message, hide }}>{children}</ToastContext.Provider>;
};

export const useToast = (): ToastProps => useContext(ToastContext);