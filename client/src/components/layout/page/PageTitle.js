import React from "react";

const PageTitle = ({ title, subtitle }) => {
  return (
    <div className="level-left">
      <div className="level-item">
        <div>
          {subtitle && (
            <div className="subtitle is-spaced is-size-6 pageSubtitle">
              {subtitle}
            </div>
          )}
          <h3 className="title is-size-3 pageTitle">{title}</h3>
        </div>
      </div>
    </div>
  );
};

export default PageTitle;
