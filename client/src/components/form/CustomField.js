import React, { Fragment } from "react";

const CustomField = ({ label, children, error, required }) => {
  return (
    <Fragment>
      <label className="label">{`${label}${required ? " *" : ""}`}</label>
      {children}
      {error && <p className="help is-danger">{error}</p>}
    </Fragment>
  );
};

export default CustomField;
