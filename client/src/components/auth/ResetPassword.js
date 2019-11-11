import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect, withRouter } from "react-router-dom";

import {
  resetPassword,
  sendResetInstructions,
  clearErrors
} from "../../actions/auth";

import PageTitle from "../layout/page/PageTitle";
import Form from "../form/Form";
import FormControl from "../form/FormControl";
import SubmitButton from "../form/SubmitButton";
import Spinner from "../common/Spinner";

import logo from "../../resources/logo_vertical_md.png";

const ResetPassword = ({
  location,
  history,
  errors,
  auth: { loading },
  resetPassword,
  sendResetInstructions,
  clearErrors,
  match
}) => {
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  const { email, newPassword, confirmNewPassword } = formData;
  const errEmail = errors.find(error => error.param === "email");
  const errNewPassword = errors.find(error => error.param === "newPassword");
  const errConfirmNewPassword = errors.find(
    error => error.param === "confirmNewPassword"
  );

  useEffect(() => {
    return () => {
      clearErrors();
    };
  }, []);

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();

    if (!!match.params.verificationToken) {
      resetPassword(
        email,
        newPassword,
        confirmNewPassword,
        match.params.verificationToken
      );
    } else {
      sendResetInstructions(email);
    }
  };

  if (loading) {
    return <Spinner isMidpage />;
  }

  return (
    <section className="centered-form login-form">
      <nav className="level" id="page-nav">
        <PageTitle title="Reset Password" />
      </nav>

      <Form onSubmit={onSubmit}>
        {!match.params.verificationToken ? (
          <Fragment>
            <div className="login-form-message">
              <h3 className="is-size-4">
                No password? <span className="ws-nowrap">No worries.</span>
              </h3>
              <p>
                Simply provide the email you currently use to log in, and we'll
                send you further instructions <br />
                <strong>(be sure to check your spam folder)</strong>
              </p>
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
            <SubmitButton isFullwidth={true} text="Send Reset Instructions" />{" "}
          </Fragment>
        ) : (
          <Fragment>
            <FormControl
              label="Current Email"
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
              label="New Password"
              placeholder="Password"
              name="newPassword"
              value={newPassword}
              type="password"
              onChange={onChange}
              error={errNewPassword ? errNewPassword.msg : undefined}
              iconLeft={
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              }
            />
            <FormControl
              placeholder="Confirm Password"
              name="confirmNewPassword"
              value={confirmNewPassword}
              type="password"
              onChange={onChange}
              error={
                errConfirmNewPassword ? errConfirmNewPassword.msg : undefined
              }
              iconLeft={
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              }
            />
            <SubmitButton isFullwidth={true} text="Confirm Password Reset" />{" "}
          </Fragment>
        )}
      </Form>
    </section>
  );
};

ResetPassword.propTypes = {
  resetPassword: PropTypes.func.isRequired,
  sendResetInstructions: PropTypes.func.isRequired,
  verifyUser: PropTypes.func.isRequired,
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
  { resetPassword, sendResetInstructions, clearErrors }
)(withRouter(ResetPassword));
