import React, { Fragment } from "react";

const FormControl = ({
  label,
  name,
  value,
  error,
  onChange,
  type,
  placeholder,
  required,
  readonly,
  isSmall
}) => {
  return (
    <Fragment>
      <label className="label form-label">{`${label}${
        required ? " *" : ""
      }`}</label>
      <div className="field">
        <div className="control">
          <input
            className={`input ${isSmall ? "small-input" : ""}`}
            name={name}
            value={value}
            onChange={e => onChange(e)}
            type={type ? type : "text"}
            placeholder={placeholder ? placeholder : ""}
            readOnly={readonly}
          />
        </div>
        {error && <p className="help is-danger">{error}</p>}
      </div>
    </Fragment>
  );
};

export default FormControl;
