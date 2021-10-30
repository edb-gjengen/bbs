import { ApolloProvider } from "@apollo/client";
import React from "react";

import styles from "./App.module.css";
import logo from "./assets/brick.svg";
import client from "./client";
import { Register } from "./features/Register";

const App: React.FC = () => (
  <ApolloProvider client={client}>
    <div className={styles.app}>
      <img src={logo} className={styles.logo} alt="logo" />
      <Register />
    </div>
  </ApolloProvider>
);

export default App;
