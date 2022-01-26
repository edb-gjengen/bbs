import BarChart from "bootstrap-icons/icons/bar-chart.svg";
import CardList from "bootstrap-icons/icons/card-list.svg";
import House from "bootstrap-icons/icons/house.svg";
import React from "react";
import { NavLink } from "react-router-dom";

import Logo from "../assets/brick.svg";
import styles from "./Header.module.css";

export const Header: React.FC = () => {
  return (
    <header>
      <nav className="navbar navbar-dark bg-dark navbar-expand-md">
        <NavLink to="/" className="navbar-brand">
          <span className={styles.logo}>
            <Logo />
          </span>
          Biceps Bar System - BBS
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink to="/" className="nav-link" activeClassName="active" exact>
                <span className={styles.navIcon}>
                  <House />
                </span>{" "}
                Kjøp drikke
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/deposit" className="nav-link" activeClassName="active">
                Sett inn penger
              </NavLink>
            </li>
            <li className="nav-item">
              <a href="/log" className="nav-link">
                <span className={styles.navIcon}>
                  <CardList />
                </span>{" "}
                Logg
              </a>
            </li>
            <li className="nav-item">
              <a href="/stats" className="nav-link">
                <span className={styles.navIcon}>
                  <BarChart />
                </span>{" "}
                Statistikk
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};
