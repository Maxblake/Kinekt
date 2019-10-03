import React from "react";

const Form = ({ children, onSubmit }) => {
  return (
    <form className="hs-box" onSubmit={e => onSubmit(e)}>
      {children}
    </form>
  );
};

export default Form;
