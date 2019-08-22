import React from "react";

const Form = ({ children, onSubmit }) => {
  return (
    <form className="box" onSubmit={e => onSubmit(e)}>
      {children}
    </form>
  );
};

export default Form;
