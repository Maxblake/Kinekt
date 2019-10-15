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
import Modal from "../common/subcomponents/Modal";

const Register = ({ register, errors, auth: { isAuthenticated, loading } }) => {
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
                <div className="hs-box info-modal is-vcentered has-rounded-corners">
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
            <div className="field">
              <div className="control">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    onChange={termsCBChanged}
                    checked={!isSubmitDisabled}
                  />
                  &nbsp;I have read and agree to the{" "}
                  <Modal
                    trigger={
                      <span className="has-text-link">terms of service</span>
                    }
                  >
                    <div className="hs-box info-modal is-vcentered has-rounded-corners">
                      <div className="icon is-large info-icon">
                        <i className="far fa-3x fa-question-circle" />
                      </div>
                      <div className="content">
                        Hey there. If you're reading this, thanks for doing your
                        part and checking out the terms of service. HappenStack
                        is unreleased at this time, so there's nothing official
                        to see here. For now, just please don't do anything
                        stupid with this software, and if you get caught doing
                        something stupid with this software, don't sue me.
                        <br />
                        <br />
                        I'd like this modal to look like an actual TOS in the
                        meantime, so here's a snippet from the Cars 2 script.
                        <br />
                        <br />
                        A sleek British sports car talks directly to us in a
                        pixilated, garbled video. He's OUT OF BREATH. Crates are
                        visible behind him. We're in the shadowy bowels of a
                        steel room.
                        <br />
                        <br />
                        LELAND TURBO This is Agent Leland Turbo. I have a flash
                        transmission for Agent Finn McMissile.
                        <br />
                        <br />
                        SUPERIMPOSE OVER BLACK: WALT DISNEY PICTURES PRESENTS
                        <br />
                        <br />
                        LELAND TURBO Finn. My cover's been compromised.
                        Everything's gone pear-shaped.
                        <br />
                        <br />
                        SUPERIMPOSE OVER BLACK: A PIXAR ANIMATION STUDIOS FILM
                        <br />
                        <br />
                        LELAND TURBO You won't believe what I've found out here.
                        <br />
                        <br />
                        He angles our camera view, reveals a PORTHOLE through
                        which we can see flames rising in the distance.
                        <br />
                        <br />
                      </div>
                    </div>
                  </Modal>
                </label>
              </div>
            </div>
          }
        />

        <SubmitButton isDisabled={isSubmitDisabled} text="Let me in!" />
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
