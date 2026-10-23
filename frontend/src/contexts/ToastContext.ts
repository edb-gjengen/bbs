import React from "react";

export type Background = "primary" | "danger";

export interface ToastProps {
  visible: boolean;
  message: string;
  showToast: (message: string, background?: Background) => void;
  hide: () => void;
  background: Background;
}

export const defaultToastState: ToastProps = {
  // FIXME: revert
  visible: false,
  message: "",
  showToast: () => {},
  hide: () => {},
  background: "primary",
};

export const ToastContext = React.createContext<ToastProps>(defaultToastState);
