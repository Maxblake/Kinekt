/* import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.registerUser(newUser, this.props.history);
  }

  render() {
    const { errors } = this.state;

    return <div> /register</div>;
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register)); */

import React, { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    about: ""
  });

  const { name, email, password, about } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    //TODO validate
  };

  return (
    <section className="Register centeredForm">
      <nav className="level" id="pageNav">
        <div className="level-left">
          <div className="level-item">
            <h3 className="title is-size-3 pageTitle">Sign up</h3>
          </div>
        </div>
      </nav>

      <form className="box" onSubmit={e => onSubmit(e)}>
        <label class="label">Email Address *</label>
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="email"
              name="email"
              value={email}
              onChange={e => onChange(e)}
              required
            />
          </div>
        </div>
        <label class="label">Password *</label>
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

        <label class="label">Display Name *</label>
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              name="name"
              value={name}
              onChange={e => onChange(e)}
              required
            />
          </div>
        </div>

        <label class="label">About you</label>
        <div class="field">
          <div class="control">
            <textarea
              class="textarea"
              rows="2"
              placeholder="What brings you here? (This can be changed later)"
              name="about"
              value={about}
              onChange={e => onChange(e)}
            />
          </div>
        </div>

        {/* TODO add image upload */}
        <label class="label">Profile Picture</label>
        <div class="field">
          <div class="file has-name is-primary">
            <label class="file-label">
              <input class="file-input" type="file" name="resume" />
              <span class="file-cta">
                <span class="file-icon">
                  <i class="fas fa-upload" />
                </span>
                <span class="file-label">Choose a file…</span>
              </span>
              <span class="file-name">
                Screen Shot 2017-07-29 at 15.54.25.png
              </span>
            </label>
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
              Sign up
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Register;
