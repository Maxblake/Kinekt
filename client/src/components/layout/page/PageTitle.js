import React from "react";

const PageTitle = ({ title, subtitle, hasPageOptions = false }) => {
  return (
    <div className="level-left">
      <div className="level-item">
        <div
          className={`page-title-container ${
            hasPageOptions ? "has-page-options" : ""
          }`}
        >
          <h1 className="title is-spaced is-size-3 is-size-4-mobile page-title">
            {title}
          </h1>
          {subtitle && (
            <div className="subtitle is-size-6 page-subtitle">{subtitle}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageTitle;
