import React, { Fragment } from "react";

const FormControl = ({
  label,
  name,
  value,
  error,
  onChange,
  type,
  placeholder,
  required
}) => {
  return (
    <Fragment>
      <label className="label">{`${label}${required ? " *" : ""}`}</label>
      <div className="field">
        <div className="control">
          <input
            className="input"
            name={name}
            value={value}
            onChange={e => onChange(e)}
            type={type ? type : "text"}
            placeholder={placeholder ? placeholder : ""}
          />
        </div>
        {error && <p className="help is-danger">{error}</p>}
      </div>
    </Fragment>
  );
};

export default FormControl;
