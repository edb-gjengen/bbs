import clsx from "clsx";
import React from "react";
import { NavLink } from "react-router-dom";

import { ReactComponent as Logo } from "../assets/brick.svg";
import styles from "./Header.module.css";

const ADMIN_URL = `${import.meta.env.VITE_API_URL}/admin/`;

const navLinkStyles = ({ isActive }: { isActive: boolean }) => clsx(styles.navLink, { [styles.active]: isActive });

export const Header: React.FC = () => {
  return (
    <header>
      <nav className={styles.nav}>
        <NavLink to="/" className={styles.logoNav}>
          <div className={styles.brand}>BBS</div>
          <div className={styles.subtitle}>Biceps Bar System</div>
        </NavLink>
        <ul className={styles.navItems}>
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
          <li>
            <a href={ADMIN_URL} className={styles.navLink}>
              Admin
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};
