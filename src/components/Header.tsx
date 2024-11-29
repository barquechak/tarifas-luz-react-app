import React, { useState } from "react";
import "../styles/Header.css";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <div className="logo">
        <h1>Información de Tarifas Eléctricas</h1>
      </div>
      <button className="menu-toggle" onClick={toggleMenu}>
        &#9776; {/* Hamburger icon */}
      </button>
      <nav className={isMenuOpen ? "open" : ""}>
        <ul>
          <li>
            <a href="#clock">Clock</a>
          </li>
          <li>
            <a href="#cards">Cards</a>
          </li>
          <li>
            <a href="#graph">Graph</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
