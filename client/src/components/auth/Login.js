import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect, withRouter } from "react-router-dom";

import { login, clearErrorsAndAlerts } from "../../actions/auth";

import PageTitle from "../layout/page/PageTitle";
import Form from "../form/Form";
import FormControl from "../form/FormControl";
import SubmitButton from "../form/SubmitButton";

const Login = ({
  location,
  errors,
  isAuthenticated,
  login,
  clearErrorsAndAlerts
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { email, password } = formData;
  const errEmail = errors.find(error => error.param === "email");
  const errPassword = errors.find(error => error.param === "password");

  // TODO Maybe get rid of this eventually
  useEffect(() => {
    clearErrorsAndAlerts();
  }, []);

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    login(email, password);
  };

  if (isAuthenticated) {
    const from = location && location.state ? location.state.from : undefined;

    if (from !== undefined) {
      return <Redirect to={from} />;
    }
    return <Redirect to="/" />;
  }

  return (
    <section className="Login centeredForm">
      <nav className="level" id="pageNav">
        <PageTitle title="Log in" />
      </nav>

      <Form onSubmit={onSubmit}>
        <FormControl
          label="Email Address"
          name="email"
          value={email}
          onChange={onChange}
          error={errEmail ? errEmail.msg : undefined}
        />
        <FormControl
          label="Password"
          name="password"
          value={password}
          type="password"
          onChange={onChange}
          error={errPassword ? errPassword.msg : undefined}
        />
        <SubmitButton text="Log in" />
      </Form>
    </section>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  clearErrorsAndAlerts: PropTypes.func.isRequired,
  errors: PropTypes.array.isRequired,
  isAuthenticated: PropTypes.bool,
  location: PropTypes.object
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  errors: state.error
});

export default connect(
  mapStateToProps,
  { login, clearErrorsAndAlerts }
)(withRouter(Login));
