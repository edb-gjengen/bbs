import { ApolloProvider } from "@apollo/client";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import styles from "./App.module.css";
import { Routes } from "./Routes";
import client from "./client";
import { Header } from "./components/Header";
import { Toast } from "./components/Toast";
import { ToastProvider } from "./components/ToastProvider";

const baseUrl = import.meta.env.BASE_URL;

const App: React.FC = () => (
  <ApolloProvider client={client}>
    <Router basename={baseUrl.replace("/static", "")}>
      <ToastProvider>
        <Header />
        <div className={styles.app}>
          <Routes />
        </div>
        <Toast />
      </ToastProvider>
    </Router>
  </ApolloProvider>
);

export default App;
