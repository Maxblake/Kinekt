import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Geosuggest from "react-geosuggest";

import { register } from "../../actions/user";
import { clearErrors } from "../../actions/auth";

import Spinner from "../common/Spinner";
import PageTitle from "../layout/page/PageTitle";
import Form from "../form/Form";
import FormControl from "../form/FormControl";
import SubmitButton from "../form/SubmitButton";
import CustomField from "../form/CustomField";
import ImgUploadControl from "../form/ImgUploadControl";
import Modal from "../common/subcomponents/Modal";
import TermsOfService from "../common/TermsOfService";
import PrivacyPolicy from "../common/PrivacyPolicy";

const Register = ({
  register,
  clearErrors,
  errors,
  auth: { isAuthenticated, loading, token }
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    about: "",
    image: undefined,
    currentLocation: { address: "" },
    useUsersLocation: false,
    isSubmitDisabled: true
  });

  const {
    name,
    email,
    password,
    about,
    image,
    currentLocation,
    useUsersLocation,
    isSubmitDisabled
  } = formData;

  const errName = errors.find(error => error.param === "name");
  const errEmail = errors.find(error => error.param === "email");
  const errPassword = errors.find(error => error.param === "password");
  const errAbout = errors.find(error => error.param === "about");
  const errCurrentLocation = errors.find(
    error => error.param === "currentLocationAddress"
  );

  useEffect(() => {
    return () => {
      clearErrors();
    };
  }, []);

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

  const currentLocationCBChanged = async e => {
    const checked = e.target.checked;
    let newCurrentLocation = currentLocation;

    if (checked) {
      const coords = await getCurrentPosition();

      if (!!coords && !!coords.latitude) {
        newCurrentLocation = {
          address: "",
          lat: coords.latitude,
          lng: coords.longitude
        };
      } else {
        alert(
          "HappenStack is unable to determine your location, please check your browser settings or enter a location manually."
        );
      }
    } else {
      newCurrentLocation = { address: "" };
    }

    setFormData({
      ...formData,
      useUsersLocation: checked,
      currentLocation: newCurrentLocation
    });
  };

  const getCurrentPosition = async () => {
    return new Promise(res => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position =>
          res(position.coords)
        );
      } else {
        res(null);
      }
    });
  };

  const termsCBChanged = e => {
    setFormData({
      ...formData,
      isSubmitDisabled: !e.target.checked
    });
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

  if (isAuthenticated) {
    return <Redirect to="/" />;
  } else if (!!token) {
    return <Redirect to="/login" />;
  }

  if (loading) {
    return <Spinner isMidpage />;
  }

  return (
    <section className="centered-form">
      <nav className="level" id="page-nav">
        <PageTitle title="Sign up" />
      </nav>

      <Form onSubmit={onSubmit}>
        <FormControl
          label="Email"
          name="email"
          value={email}
          onChange={onChange}
          error={errEmail ? errEmail.msg : undefined}
          required={true}
          iconLeft={
            <span className="icon is-small is-left">
              <i className="fas fa-envelope"></i>
            </span>
          }
        />

        <FormControl
          label="Password"
          name="password"
          value={password}
          type="password"
          onChange={onChange}
          error={errPassword ? errPassword.msg : undefined}
          required={true}
          iconLeft={
            <span className="icon is-small is-left">
              <i className="fas fa-lock"></i>
            </span>
          }
        />

        <FormControl
          label="Display Name"
          name="name"
          value={name}
          onChange={onChange}
          error={errName ? errName.msg : undefined}
          required={true}
          iconLeft={
            <span className="icon is-small is-left">
              <i className="fas fa-user-circle"></i>
            </span>
          }
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

        <ImgUploadControl
          label="Profile Picture"
          onChange={handleImageUpload}
          type="profile"
        />

        <CustomField
          label={
            <span>
              Location&nbsp;
              <Modal
                trigger={
                  <span className="icon info-icon">
                    <i className="far fa-question-circle" />
                  </span>
                }
              >
                <div className="hs-box info-modal is-vcentered">
                  <div className="icon is-large info-icon">
                    <i className="far fa-3x fa-question-circle" />
                  </div>
                  <div className="content">
                    The location you provide is used solely to help find groups
                    around you. You can update or elect not to share your
                    location at any time.
                  </div>
                </div>
              </Modal>
            </span>
          }
          children={
            <div className="field is-grouped">
              <div className="control is-expanded">
                <div className="field">
                  <div className="control">
                    <Geosuggest
                      disabled={useUsersLocation}
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
              </div>
              <div className="control">
                <label className="checkbox">
                  <input type="checkbox" onChange={currentLocationCBChanged} />
                  &nbsp;Use Current
                </label>
              </div>
            </div>
          }
        />

        <CustomField
          children={
            <div className="field tos-field">
              <div className="control">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    onChange={termsCBChanged}
                    checked={!isSubmitDisabled}
                  />
                  &nbsp;I have read and agree to the{" "}
                  <TermsOfService
                    trigger={
                      <span className="has-text-link">terms of use</span>
                    }
                  />{" "}
                  and{" "}
                  <PrivacyPolicy
                    trigger={
                      <span className="has-text-link">privacy policy</span>
                    }
                  />
                </label>
              </div>
            </div>
          }
        />

        <SubmitButton
          isFullwidth={true}
          isDisabled={isSubmitDisabled}
          text="Let me in!"
        />
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
  { register, clearErrors }
)(Register);
