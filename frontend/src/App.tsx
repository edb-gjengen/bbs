import { ApolloProvider } from "@apollo/client";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import styles from "./App.module.css";
import { Routes } from "./Routes";
import client from "./client";
import { Header } from "./components/Header";
import { Splash as Splash } from "./components/Splash";
import { Toast } from "./components/Toast";
import { ToastProvider } from "./components/ToastProvider";

const App: React.FC = () => (
  <ApolloProvider client={client}>
    <Router>
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
