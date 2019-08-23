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
              class="button is-black"
              id="grpSettingsBtn"
              aria-haspopup="true"
              aria-controls="dropdown-menu"
            >
              <span>Filter</span>
              <span class="icon is-small">
                <i class="fas fa-cog" aria-hidden="true" />
              </span>
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
