import React from "react";

export default function Footer() {
  return (
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          Copyright &copy; {new Date().getFullYear()} Kinekt | Current version:
          pre-alpha | Please do not share this content
        </p>
      </div>
    </footer>
  );
}
