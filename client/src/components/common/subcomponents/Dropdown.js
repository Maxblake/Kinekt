import React, { useEffect } from "react";

const Dropdown = ({ trigger, children }) => {
  let dropdownTrigger, dropdown, dropdownContent;

  useEffect(() => {
    document.addEventListener("click", handleToggleDropdown);

    dropdownTrigger = document.querySelector(".dropdown-trigger");
    dropdown = document.querySelector(".dropdown");
    dropdownContent = document.querySelector(".dropdown-content");

    return () => {
      document.removeEventListener("click", handleToggleDropdown);
    };
  }, []);

  const handleToggleDropdown = e => {
    const clickeddropdownTrigger = dropdownTrigger.contains(e.target);
    const clickeddropdownContent = dropdownContent.contains(e.target);
    const dropdownActive = dropdown.classList.contains("is-active");

    if (dropdownActive && !clickeddropdownContent) {
      dropdown.classList.remove("is-active");
    } else if (clickeddropdownTrigger) {
      dropdown.classList.add("is-active");
    }
  };

  return (
    <div className="dropdown is-right">
      <div className="dropdown-trigger">{trigger}</div>
      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">{children}</div>
      </div>
    </div>
  );
};

export default Dropdown;
