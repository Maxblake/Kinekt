// import React, { Component } from "react";
// import PropTypes from "prop-types";
// import { connect } from "react-redux";
// import { loginUser } from "../../actions/authActions";

// class Login extends Component {
//   constructor() {
//     super();
//     this.state = {
//       email: "",
//       password: "",
//       errors: {}
//     };

//     this.onChange = this.onChange.bind(this);
//     this.onSubmit = this.onSubmit.bind(this);
//   }

//   componentDidMount() {
//     if (this.props.auth.isAuthenticated) {
//       this.props.history.push("/dashboard");
//     }
//   }

//   componentWillReceiveProps(nextProps) {
//     if (nextProps.auth.isAuthenticated) {
//       this.props.history.push("./dashboard");
//     }

//     if (nextProps.errors) {
//       this.setState({ errors: nextProps.errors });
//     }
//   }

//   onChange(e) {
//     this.setState({ [e.target.name]: e.target.value });
//   }

//   onSubmit(e) {
//     e.preventDefault();

//     const userData = {
//       email: this.state.email,
//       password: this.state.password
//     };

//     this.props.loginUser(userData);
//   }

//   render() {
//     const { errors } = this.state;

//     return <div className="login" />;
//   }
// }

// Login.propTypes = {
//   loginUser: PropTypes.func.isRequired,
//   auth: PropTypes.object.isRequired,
//   errors: PropTypes.object.isRequired
// };

// const mapStateToProps = state => ({
//   auth: state.auth,
//   errors: state.errors
// });

// export default connect(
//   mapStateToProps,
//   { loginUser }
// )(Login);

import React, { useState, useEffect } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login, clearErrorsAndAlerts } from "../../actions/auth";

const Login = ({
  login,
  clearErrorsAndAlerts,
  errors,
  isAuthenticated,
  location
}) => {
  // TODO Maybe get rid of this eventually
  useEffect(() => {
    clearErrorsAndAlerts();
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { email, password } = formData;

  const errEmail = errors.find(error => error.param === "email");

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    //TODO validate, why is this async?
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
              minLength="6"
              required
            />
          </div>
        </div>

        <div class="field is-grouped is-grouped-right">
          <div class="control">
            <button class="button is-text" type="button">
              Cancel
            </button>
          </div>
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
