import React from "react";

const PageTitle = ({ title, subtitle, hasPageOptions = false }) => {
  return (
    <div className="level-left">
      <div className="level-item">
        <div
          className={`title is-spaced is-size-3 page-title-container ${
            hasPageOptions ? "has-page-options" : ""
          }`}
        >
          <h3 className="title is-spaced is-size-3 page-title">{title}</h3>
          {subtitle && (
            <div className="subtitle is-size-6 page-subtitle">{subtitle}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageTitle;
