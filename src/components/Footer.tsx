import React from "react";
import "../styles/Footer.css"; // Import CSS file for styling

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="footer-content">
        <p>© {new Date().getFullYear()}. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
