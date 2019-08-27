import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="content has-text-centered">
        <p>
          Copyright &copy; {new Date().getFullYear()} Kinekt | Current version:
          0.4 (pre-alpha)
        </p>
      </div>
    </footer>
  );
}
