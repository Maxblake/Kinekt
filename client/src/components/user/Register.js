import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { register } from "../../actions/user";

const Register = ({ register, errors, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    about: "",
    image: { name: "" }
  });

  const { name, email, password, about, image } = formData;

  const errName = errors.find(error => error.param === "name");
  const errEmail = errors.find(error => error.param === "email");
  const errPassword = errors.find(error => error.param === "password");
  const errAbout = errors.find(error => error.param === "about");

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageUpload = e => {
    const imageFile = e.target.files[0];

    if (!imageFile) return;
    if (
      imageFile.size > e.target.attributes.getNamedItem("data-max-size").value
    ) {
      setFormData({
        ...formData,
        image: {
          name: imageFile.name,
          error: "Image file must be smaller than 10MB"
        }
      });
      return;
    }

    setFormData({
      ...formData,
      image: { name: imageFile.name, file: imageFile }
    });
  };

  const onSubmit = async e => {
    e.preventDefault();
    register({ name, email, password, about, image: image.file });
  };

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

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
            />
          </div>
          {errEmail && <p class="help is-danger">{errEmail.msg}</p>}
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
            />
          </div>
          {errPassword && <p class="help is-danger">{errPassword.msg}</p>}
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
            />
          </div>
          {errName && <p class="help is-danger">{errName.msg}</p>}
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
          {errAbout && <p class="help is-danger">{errAbout.msg}</p>}
        </div>

        <label class="label">Profile Picture</label>
        <div class="field">
          <div class="file has-name is-primary">
            <label class="file-label">
              <input
                class="file-input"
                type="file"
                name="userImage"
                accept="image/*"
                data-max-size="10485760"
                onChange={e => handleImageUpload(e)}
              />
              <span class="file-cta">
                <span class="file-icon">
                  <i class="fas fa-upload" />
                </span>
                <span class="file-label">Upload</span>
              </span>
              <span class="file-name">
                {image.name ? image.name : "No image selected.."}
              </span>
            </label>
          </div>
          {image.error && <p class="help is-danger">{image.error}</p>}
        </div>

        <div class="field is-grouped is-grouped-right">
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

Register.propTypes = {
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  errors: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  errors: state.error
});

export default connect(
  mapStateToProps,
  { register }
)(Register);
