import React from "react";

import logo from "../../resources/logo_horizontal_md.png";

export default function Footer() {
  return (
    <footer className="footer">
      <nav className="columns">
        <div className="column">
          <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="column">
          <div className="centered-logo">
            <img src={logo} alt="" />
          </div>
        </div>
        <div className="column">
          <div className="content has-text-centered">
            <p>Copyright &copy; {new Date().getFullYear()} HappenStack</p>
          </div>
        </div>
      </nav>
    </footer>
  );
}
