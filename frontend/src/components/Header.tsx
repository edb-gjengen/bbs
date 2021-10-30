import React from "react";
import { Link } from "react-router-dom";

export const Header: React.FC = () => {
  return (
    <header>
      <div>Biceps Bar System - BBS</div>
      <nav>
        <Link to="/">Kjøp drikke</Link>
        <Link to="/deposit">Sett inn penger</Link>
      </nav>
    </header>
  );
};
