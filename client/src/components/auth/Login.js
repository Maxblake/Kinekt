import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect, withRouter } from "react-router-dom";

import { login, clearErrorsAndAlerts } from "../../actions/auth";

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
        <div className="level-left">
          <div className="level-item">
            <h3 className="title is-size-3 pageTitle">Log in</h3>
          </div>
        </div>
      </nav>

      <form className="box" onSubmit={e => onSubmit(e)}>
        <label class="label">Email Address</label>
        <div class="field">
          <div class="control">
            <input
              class="input"
              name="email"
              value={email}
              onChange={e => onChange(e)}
            />
          </div>
          {errEmail && <p class="help is-danger">{errEmail.msg}</p>}
        </div>
        <label class="label">Password</label>
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="password"
              name="password"
              value={password}
              onChange={e => onChange(e)}
            />
          </div>
          {errPassword && <p class="help is-danger">{errPassword.msg}</p>}
        </div>

        <div class="field is-grouped is-grouped-right">
          <div class="control">
            <button class="button is-primary" type="submit">
              Log in
            </button>
          </div>
        </div>
      </form>
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
