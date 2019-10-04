import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <nav className="level">
        <div className="level-left">
          <div className="level-item">
            <div className="centered-logo">HS</div>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <h3>FAQ</h3>
          </div>
        </div>
      </nav>
      <div className="content has-text-centered">
        <p>
          Copyright &copy; {new Date().getFullYear()} HappenStack | Current
          version: 0.7 (pre-alpha)
        </p>
      </div>
    </footer>
  );
}
