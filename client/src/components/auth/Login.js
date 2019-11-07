import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect, withRouter } from "react-router-dom";

import { login, clearErrors, sendEmailConfirmation } from "../../actions/auth";

import PageTitle from "../layout/page/PageTitle";
import Form from "../form/Form";
import FormControl from "../form/FormControl";
import SubmitButton from "../form/SubmitButton";
import Spinner from "../common/Spinner";

import logo from "../../resources/logo_vertical_md.png";

const Login = ({
  location,
  history,
  errors,
  auth: { isAuthenticated, loading, user, token },
  login,
  sendEmailConfirmation,
  clearErrors
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { email, password } = formData;
  const errEmail = errors.find(error => error.param === "email");
  const errPassword = errors.find(error => error.param === "password");
  const isVerifying = !isAuthenticated && !!token;

  useEffect(() => {
    return () => {
      clearErrors();
    };
  }, []);

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();

    if (isVerifying) {
      sendEmailConfirmation();
    } else {
      login(email, password);
    }
  };

  const onClickSignup = () => {
    history.push("/register");
  };

  if (isAuthenticated && user) {
    const from = location && location.state ? location.state.from : undefined;

    if (from !== undefined) {
      return <Redirect to={from} />;
    }
    return <Redirect to="/" />;
  }

  if (loading) {
    return <Spinner isMidpage />;
  }

  return (
    <section className="centered-form login-form">
      <nav className="level" id="page-nav">
        <PageTitle title="Log in" />
      </nav>

      <Form onSubmit={onSubmit}>
        {isVerifying ? (
          <Fragment>
            <div className="verify-message">
              <h3 className="is-size-4">Halt, dear traveller!</h3>
              <p>
                In order to verify your acount, please click the activation link
                we've emailed you
              </p>
            </div>
            <SubmitButton isFullwidth={true} text="Resend verification email" />{" "}
          </Fragment>
        ) : (
          <Fragment>
            <div className="centered-logo">
              <img src={logo} alt="" />
            </div>
            <FormControl
              placeholder="Email"
              name="email"
              value={email}
              onChange={onChange}
              error={errEmail ? errEmail.msg : undefined}
              iconLeft={
                <span className="icon is-small is-left">
                  <i className="fas fa-envelope"></i>
                </span>
              }
            />
            <FormControl
              placeholder="Password"
              name="password"
              value={password}
              type="password"
              onChange={onChange}
              error={errPassword ? errPassword.msg : undefined}
              iconLeft={
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              }
            />
            <SubmitButton isFullwidth={true} text="Let's go!" />{" "}
          </Fragment>
        )}
      </Form>
      {!isVerifying && (
        <div className="content has-text-centered">
          <p className="">
            Don't have an account yet? You can sign up{" "}
            <span
              className="clickable-text has-text-link"
              onClick={() => onClickSignup()}
            >
              here.
            </span>
          </p>
        </div>
      )}
    </section>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  sendEmailConfirmation: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  errors: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired,
  location: PropTypes.object
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.error
});

export default connect(
  mapStateToProps,
  { login, clearErrors, sendEmailConfirmation }
)(withRouter(Login));
