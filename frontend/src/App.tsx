import { ApolloProvider } from "@apollo/client";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import styles from "./App.module.css";
import { Routes } from "./Routes";
import client from "./client";
import { Header } from "./components/Header";

const App: React.FC = () => (
  <ApolloProvider client={client}>
    <Router>
      <Header />
      <div className={styles.app}>
        <Routes />
      </div>
    </Router>
  </ApolloProvider>
);

export default App;
