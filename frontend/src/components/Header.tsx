import React from "react";
import { NavLink } from "react-router-dom";

import { ReactComponent as Logo } from "../assets/brick.svg";
import styles from "./Header.module.css";

const ADMIN_URL = `${import.meta.env.VITE_API_URL}/admin/`;

const navLinkStyles = ({ isActive }: { isActive: boolean }) => (isActive ? "nav-link active" : "nav-link");

export const Header: React.FC = () => {
  return (
    <header>
      <nav>
        <NavLink to="/">
          <span className={styles.logo}>
            <Logo />
          </span>
          Biceps Bar System - BBS
        </NavLink>
        <button type="button" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div id="navbarNav">
          <ul>
            <li>
              <NavLink to="/" className={navLinkStyles} end>
                Kjøp drikke
              </NavLink>
            </li>
            <li>
              <NavLink to="/deposit" className={navLinkStyles}>
                Sett inn penger
              </NavLink>
            </li>
            <li>
              <NavLink to="/log" className={navLinkStyles}>
                Logg
              </NavLink>
            </li>
            <li>
              <NavLink to="/stats" className={navLinkStyles}>
                Statistikk
              </NavLink>
            </li>

            <li>
              <NavLink to="/users" className={navLinkStyles}>
                Folk
              </NavLink>
            </li>
          </ul>
        </div>
        <ul>
          <li>
            <a href={ADMIN_URL}>Admin</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};
