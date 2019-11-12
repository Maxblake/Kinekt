import React from "react";
import { Link } from "react-router-dom";

import TermsOfService from "../common/TermsOfService";
import PrivacyPolicy from "../common/PrivacyPolicy";

import logo from "../../resources/logo_horizontal_md.png";

export default function Footer() {
  return (
    <footer className="footer">
      <nav className="columns">
        <div className="column">
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li>
                <TermsOfService trigger="Terms of Use" />
              </li>
              <li>
                <PrivacyPolicy trigger="Privacy Policy" />
              </li>
              <li>
                <Link to="/FAQ">FAQ</Link>
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
            <p>
              Copyright &copy; {new Date().getFullYear()} HappenStack (beta)
            </p>
          </div>
        </div>
      </nav>
    </footer>
  );
}
