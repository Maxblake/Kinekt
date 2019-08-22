import React, { Fragment } from "react";

const CustomField = ({ label, children, error, required }) => {
  return (
    <Fragment>
      <label class="label">{`${label}${required ? " *" : ""}`}</label>
      {children}
      {error && <p class="help is-danger">{error}</p>}
    </Fragment>
  );
};

export default CustomField;
