import { ApolloProvider } from "@apollo/client";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import styles from "./App.module.css";
import { Routes } from "./Routes";
import client from "./client";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Splash as Splash } from "./components/Splash";
import { Toast } from "./components/Toast";
import { ToastProvider } from "./components/ToastProvider";
import { Wireframe } from "./components/Wireframe";

const App = (): JSX.Element => (
  <ApolloProvider client={client}>
    <Router>
      <ToastProvider>
        <Header />
        <div className={styles.app}>
          <Routes />
          <Wireframe />
        </div>
        <Footer />
        <Toast />
      </ToastProvider>
    </Router>
  </ApolloProvider>
);

export default App;
