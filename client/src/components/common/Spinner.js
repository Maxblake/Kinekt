import React from "react";

export default ({ isMidpage }) => (
  <div className={`spinner-container ${isMidpage ? "is-midpage" : ""}`}>
    <div className="hexdots-loader">Loading...</div>
  </div>
);
