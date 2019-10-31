import React, { Fragment } from "react";

const FormControl = ({
  label,
  customLabel,
  name,
  value,
  error,
  onChange,
  type,
  placeholder,
  required,
  readonly,
  isSmall,
  iconLeft
}) => {
  return (
    <Fragment>
      {label !== undefined && (
        <label className="label form-label">{`${label}${
          required ? " *" : ""
        }`}</label>
      )}
      {customLabel !== undefined && (
        <label className="label form-label">{customLabel}</label>
      )}
      <div className="field">
        <div
          className={`control ${
            iconLeft !== undefined ? "has-icons-left" : ""
          }`}
        >
          <input
            className={`input ${isSmall ? "small-input" : ""}`}
            name={name}
            value={value}
            onChange={e => onChange(e)}
            type={type ? type : "text"}
            placeholder={
              placeholder ? `${placeholder} ${required ? "*" : ""}` : ""
            }
            readOnly={readonly}
          />
          {iconLeft !== undefined ? iconLeft : null}
        </div>
        {error && <p className="help is-danger">{error}</p>}
      </div>
    </Fragment>
  );
};

export default FormControl;
