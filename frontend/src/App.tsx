import {ApolloProvider} from "@apollo/client";
import React from 'react'

import logo from './assets/brick.svg';
import styles from './App.module.css'
import {Register} from "./features/Register";
import client from "./client";

function App() {
  return (
      <ApolloProvider client={client}>
    <div className={styles.app}>
        <img src={logo} className={styles.logo} alt="logo" />
        <Register />
    </div>
      </ApolloProvider>
  )
}

export default App
