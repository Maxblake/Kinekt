import React, { Fragment } from "react";

const CustomField = ({ label, children, required }) => {
  return (
    <Fragment>
      <label className="label form-label">{`${label}${
        required ? " *" : ""
      }`}</label>
      {children}
    </Fragment>
  );
};

export default CustomField;
