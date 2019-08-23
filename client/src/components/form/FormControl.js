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
      <label class="label">{`${label}${required ? " *" : ""}`}</label>
      <div class="field">
        <div class="control">
          <input
            class="input"
            name={name}
            value={value}
            onChange={e => onChange(e)}
            type={type ? type : "text"}
            placeholder={placeholder ? placeholder : ""}
          />
        </div>
        {error && <p class="help is-danger">{error.msg}</p>}
      </div>
    </Fragment>
  );
};

export default FormControl;
