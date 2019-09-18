import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Geosuggest from "react-geosuggest";

import { register } from "../../actions/user";

import Spinner from "../common/Spinner";
import PageTitle from "../layout/page/PageTitle";
import Form from "../form/Form";
import FormControl from "../form/FormControl";
import SubmitButton from "../form/SubmitButton";
import CustomField from "../form/CustomField";
import ImgUploadControl from "../form/ImgUploadControl";

const Register = ({ register, errors, auth: { isAuthenticated, loading } }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    about: "",
    image: undefined,
    currentLocation: { address: "" }
  });

  const { name, email, password, about, image, currentLocation } = formData;

  const errName = errors.find(error => error.param === "name");
  const errEmail = errors.find(error => error.param === "email");
  const errPassword = errors.find(error => error.param === "password");
  const errAbout = errors.find(error => error.param === "about");
  const errCurrentLocation = errors.find(
    error => error.param === "currentLocationAddress"
  );

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageUpload = imageFile => {
    setFormData({
      ...formData,
      image: imageFile
    });
  };

  const onChangeCurrentLocation = value =>
    setFormData({ ...formData, currentLocation: { address: value } });

  const onSelectCurrentLocation = selectedPlace => {
    if (!selectedPlace) return;

    const currentLocation = {
      address: selectedPlace.description,
      lat: selectedPlace.location.lat,
      lng: selectedPlace.location.lng
    };
    setFormData({ ...formData, currentLocation });
  };

  const onSubmit = async e => {
    e.preventDefault();

    const userFields = {
      name,
      email,
      password,
      about,
      image,
      currentLocationAddress: currentLocation.address,
      currentLocationLat: currentLocation.lat ? currentLocation.lat : "",
      currentLocationLng: currentLocation.lng ? currentLocation.lng : ""
    };

    register(userFields);
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(displayLocationInfo);
  }

  function displayLocationInfo(position) {
    const lng = position.coords.longitude;
    const lat = position.coords.latitude;

    console.log(`longitude: ${lng} | latitude: ${lat}`);
  }

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <section className="centered-form">
      <nav className="level" id="page-nav">
        <PageTitle title="Sign up" />
      </nav>

      <Form onSubmit={onSubmit}>
        <FormControl
          label="Email Address"
          name="email"
          value={email}
          onChange={onChange}
          error={errEmail ? errEmail.msg : undefined}
          required={true}
        />

        <FormControl
          label="Password"
          name="password"
          value={password}
          type="password"
          onChange={onChange}
          error={errPassword ? errPassword.msg : undefined}
          required={true}
        />

        <FormControl
          label="Display Name"
          name="name"
          value={name}
          onChange={onChange}
          error={errName ? errName.msg : undefined}
          required={true}
        />

        <CustomField
          label="About you"
          children={
            <div className="field">
              <div className="control">
                <textarea
                  className="textarea"
                  rows="2"
                  name="about"
                  value={about}
                  onChange={e => onChange(e)}
                  placeholder="What brings you here? (This can be changed later)"
                />
              </div>
              {errAbout && <p className="help is-danger">{errAbout.msg}</p>}
            </div>
          }
        />

        <CustomField
          label={
            <span>
              Location
              <span className="icon">
                <i className="fas fa-user-check" />
              </span>
            </span>
          }
          children={
            <div className="field">
              <div className="control">
                <Geosuggest
                  initialValue={currentLocation.address}
                  placeDetailFields={[]}
                  queryDelay={500}
                  onChange={onChangeCurrentLocation}
                  onSuggestSelect={onSelectCurrentLocation}
                  inputClassName="input"
                />
              </div>
              {errCurrentLocation && (
                <p className="help is-danger">{errCurrentLocation.msg}</p>
              )}
            </div>
          }
        />

        <ImgUploadControl
          label="Profile Picture"
          onChange={handleImageUpload}
          type="profile"
        />

        <SubmitButton text="Submit" />
      </Form>
    </section>
  );
};

Register.propTypes = {
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.error
});

export default connect(
  mapStateToProps,
  { register }
)(Register);
