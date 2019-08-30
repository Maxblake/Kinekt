import React, { useEffect } from "react";

const Dropdown = ({ trigger, children, additionalClasses }) => {
  let dropdownTrigger = React.useRef(null);
  let dropdown = React.useRef(null);
  let dropdownContent = React.useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleToggleDropdown);

    return () => {
      document.removeEventListener("click", handleToggleDropdown);
    };
  }, []);

  const handleToggleDropdown = e => {
    if (!dropdown.current) return;

    const clickeddropdownTrigger = dropdownTrigger.current.contains(e.target);
    const clickeddropdownContent = dropdownContent.current.contains(e.target);
    const dropdownActive = dropdown.current.classList.contains("is-active");

    if (dropdownActive && !clickeddropdownContent) {
      dropdown.current.classList.remove("is-active");
    } else if (clickeddropdownTrigger) {
      dropdown.current.classList.add("is-active");
    }
  };

  return (
    <div
      ref={dropdown}
      className={`dropdown is-right ${
        additionalClasses ? additionalClasses : ""
      }`}
    >
      <div ref={dropdownTrigger} className="dropdown-trigger">
        {trigger}
      </div>
      <div className="dropdown-menu" role="menu">
        <div ref={dropdownContent} className="dropdown-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
