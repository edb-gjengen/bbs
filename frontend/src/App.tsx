import { ApolloProvider } from "@apollo/client";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import styles from "./App.module.css";
import { Routes } from "./Routes";
import logo from "./assets/brick.svg";
import client from "./client";
import { Header } from "./components/Header";

const App: React.FC = () => (
  <ApolloProvider client={client}>
    <Router>
      <Header />
      <div className={styles.app}>
        <img src={logo} className={styles.logo} alt="logo" />
        <Routes />
      </div>
    </Router>
  </ApolloProvider>
);

export default App;
