import React from "react";

export default function Footer() {
  return (
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          Copyright &copy; {new Date().getFullYear()} Kinekt | Current version:
          0.4 (pre-alpha)
        </p>
      </div>
    </footer>
  );
}
