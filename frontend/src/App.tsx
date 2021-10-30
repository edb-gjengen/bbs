import React from 'react'

import logo from './assets/brick.svg';

import styles from './App.module.css'

function App() {
  return (
    <div className={styles.app}>
        <img src={logo} className={styles.logo} alt="logo" />
    </div>
  )
}

export default App
