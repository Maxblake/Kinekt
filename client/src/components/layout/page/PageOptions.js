import React from "react";

import Dropdown from "../../common/subcomponents/Dropdown";

const PageOptions = ({ options }) => {
  return (
    <div className="level-right">
      {options.map((option, index) => (
        <div
          key={index}
          className={`level-item is-hidden-touch ${
            index + 1 === options.length ? "is-marginless" : ""
          }`}
        >
          {option}
        </div>
      ))}
      <div className="level-item is-hidden-desktop tab-right">
        <Dropdown
          trigger={
            <div
              className="button is-dark is-medium tab-right-button"
              aria-haspopup="true"
              aria-controls="dropdown-menu"
            >
              <span className="icon is-large">
                <i className="fas fa-cog" aria-hidden="true" />
              </span>
            </div>
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
