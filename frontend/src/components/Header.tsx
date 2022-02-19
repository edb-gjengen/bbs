import { ReactComponent as BarChart } from "bootstrap-icons/icons/bar-chart.svg";
import { ReactComponent as CardList } from "bootstrap-icons/icons/card-list.svg";
import { ReactComponent as House } from "bootstrap-icons/icons/house.svg";
import { ReactComponent as PeopleIcon } from "bootstrap-icons/icons/people.svg";
import React from "react";
import { NavLink } from "react-router-dom";

import { ReactComponent as Logo } from "../assets/brick.svg";
import styles from "./Header.module.css";

const ADMIN_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/admin`
  : "http://localhost:8000/admin/";

const navLinkStyles = ({ isActive }: { isActive: boolean }) => (isActive ? "nav-link active" : "nav-link");

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
              <NavLink to="/" className={navLinkStyles} end>
                <span className={styles.navIcon}>
                  <House />
                </span>{" "}
                Kjøp drikke
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/deposit" className={navLinkStyles}>
                Sett inn penger
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/log" className={navLinkStyles}>
                <span className={styles.navIcon}>
                  <CardList />
                </span>{" "}
                Logg
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/stats" className={navLinkStyles}>
                <span className={styles.navIcon}>
                  <BarChart />
                </span>{" "}
                Statistikk
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/users" className={navLinkStyles}>
                <span className={styles.navIcon}>
                  <PeopleIcon />
                </span>{" "}
                Folk
              </NavLink>
            </li>
          </ul>
        </div>
        <ul className="navbar-nav">
          <li className="nav-item">
            <a href={ADMIN_URL} className="nav-link">
              Admin
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};
