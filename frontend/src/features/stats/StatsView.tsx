import clsx from "clsx";
import React from "react";
import { NavLink } from "react-router-dom";

import styles from "./Stats.module.css";

const navLinkStyles = ({ isActive }: { isActive: boolean }) => clsx(styles.navLink, { [styles.active]: isActive });

export const StatsNav = () => (
  <nav className={styles.statsNav}>
    <ul>
      <li>
        <NavLink className={navLinkStyles} to="/stats" end>
          Oversikt
        </NavLink>
      </li>
      <li>
        <NavLink className={navLinkStyles} to="/stats/products">
          Produkter
        </NavLink>
      </li>
      <li>
        <NavLink className={navLinkStyles} to="/stats/orders">
          Ordre
        </NavLink>
      </li>
      <li>
        <NavLink className="disabled" to="/stats/users" title="TODO" hidden={true}>
          Folk
        </NavLink>
      </li>
    </ul>
  </nav>
);

export const StatsView = ({ children, loading }: { children: React.ReactNode; loading: boolean }) => (
  <div className={styles.stats}>
    <h2>Statistikk</h2>
    <StatsNav />
    {loading && <div>Loading...</div>}
    {!loading && children}
  </div>
);
