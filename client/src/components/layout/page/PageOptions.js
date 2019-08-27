import React from "react";

import Dropdown from "../../common/subcomponents/Dropdown";

const PageOptions = ({ options }) => {
  return (
    <div className="level-right">
      {options.map((option, index) => (
        <div key={index} className="level-item is-hidden-touch">
          {option}
        </div>
      ))}
      <div className="level-item is-hidden-desktop">
        <Dropdown
          trigger={
            <button
              className="button is-dark-theme"
              aria-haspopup="true"
              aria-controls="dropdown-menu"
            >
              <span className="icon is-small">
                <i className="fas fa-search" aria-hidden="true" />
              </span>
              <span>Options</span>
            </button>
          }
        >
          {options.reverse().map((option, index) => (
            <div key={index} className="dropdown-item">
              {option}
            </div>
          ))}
        </Dropdown>
      </div>
    </div>
  );
};

export default PageOptions;
