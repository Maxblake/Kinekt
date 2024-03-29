import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Prompt } from "react-router-dom";

import { editUser, deleteUser } from "../../actions/user";
import { getAddressFromCoords } from "../../actions/helpers/helpers";

import Spinner from "../common/Spinner";
import PageTitle from "../layout/page/PageTitle";
import Form from "../form/Form";
import FormControl from "../form/FormControl";
import SubmitButton from "../form/SubmitButton";
import CustomField from "../form/CustomField";
import ImgUploadControl from "../form/ImgUploadControl";
import Modal from "../common/subcomponents/Modal";
import GeoControl from "../common/subcomponents/GeoControl";

import { updateTheme } from "../../utils/theme";

const EditUser = ({
  editUser,
  deleteUser,
  errors,
  auth: { user, loading }
}) => {
  const [formData, setFormData] = useState({
    name: "",
    about: "",
    image: undefined,
    currentLocation: { address: "" },
    selectedTheme: ""
  });

  const { name, about, image, currentLocation, selectedTheme } = formData;

  const errName = errors.find(error => error.param === "name");
  const errAbout = errors.find(error => error.param === "about");
  const errCurrentLocation = errors.find(
    error => error.param === "currentLocationAddress"
  );

  useEffect(() => {
    if (!!user) {
      updateTheme(user.selectedTheme);
      setFormData({
        ...formData,
        name: user.name,
        about: user.about ? user.about : "",
        selectedTheme: user.selectedTheme ? user.selectedTheme : "",
        currentLocation: user.currentLocation
          ? user.currentLocation
          : currentLocation
      });
    }

    return () => {
      updateTheme(user.selectedTheme);
    };
  }, [user]);

  const hasUnsavedChanges = () => {
    if (!!user) {
      const initialState = {
        name: user.name,
        about: user.about ? user.about : "",
        selectedTheme: user.selectedTheme ? user.selectedTheme : "",
        currentLocation: user.currentLocation
          ? user.currentLocation
          : { address: "" },
        image: undefined
      };

      if (
        name !== initialState.name ||
        about !== initialState.about ||
        currentLocation.address !== initialState.currentLocation.address ||
        selectedTheme !== initialState.selectedTheme ||
        (image !== initialState.image && image !== "REMOVE")
      ) {
        return true;
      }
    }

    return false;
  };

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleThemeSelection = e => {
    updateTheme(e.target.value);
    onChange(e);
  };

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

  const useCurrentLocation = async () => {
    const coords = await getCurrentPosition();

    if (!!coords && !!coords.latitude) {
      const place = await getAddressFromCoords(
        coords.latitude,
        coords.longitude
      );

      setFormData({
        ...formData,
        currentLocation: {
          address: place.data.display_name,
          lat: coords.latitude,
          lng: coords.longitude
        }
      });
    } else {
      alert(
        "HappenStack is unable to determine your location, please check your browser settings or enter a location manually."
      );
    }
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

  const onSubmit = e => {
    e.preventDefault();

    const userFields = {
      name,
      about,
      image,
      selectedTheme,
      currentLocationAddress: currentLocation.address,
      currentLocationLat: currentLocation.lat ? currentLocation.lat : "",
      currentLocationLng: currentLocation.lng ? currentLocation.lng : ""
    };

    if (currentLocation.address === "") {
      userFields.currentLocationLat = "";
      userFields.currentLocationLng = "";
    }

    editUser(userFields);
  };

  const onClickDelete = () => {
    deleteUser();
  };

  if (loading) {
    return <Spinner isMidpage />;
  }

  return (
    <section className="centered-form">
      <Prompt
        message={(location, action) => {
          if (hasUnsavedChanges())
            return "You have unsaved changes. Are you sure you would like to leave this page?";
        }}
      />

      <nav className="level" id="page-nav">
        <PageTitle title="Account Settings" />
      </nav>

      <Form onSubmit={onSubmit}>
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
            <div className="field has-addons">
              <div className="control is-expanded">
                <div className="field">
                  <GeoControl
                    initialValue={currentLocation.address}
                    onChange={onChangeCurrentLocation}
                    onSuggestSelect={onSelectCurrentLocation}
                  />
                  {errCurrentLocation && (
                    <p className="help is-danger">{errCurrentLocation.msg}</p>
                  )}
                </div>
              </div>
              {navigator.geolocation && (
                <div className="control">
                  <div
                    type="button"
                    onClick={() => useCurrentLocation()}
                    className="button is-primary"
                  >
                    <span className="icon">
                      <i className="fas fa-map-marker-alt" />
                    </span>
                    <span>Use Current</span>
                  </div>
                </div>
              )}
            </div>
          }
        />

        <CustomField
          label="App Theme"
          children={
            <div className="field">
              <div className="control">
                <div className="select">
                  <select
                    name="selectedTheme"
                    value={selectedTheme}
                    onChange={e => handleThemeSelection(e)}
                  >
                    <option>Open Air</option>
                    <option>Mint</option>
                    <option>Flamingo</option>
                    <option>Deep Sea</option>
                    <option>Deep Earth</option>
                    <option>Cafe Verde</option>
                    <option>Clean Slate</option>
                  </select>
                </div>
              </div>
            </div>
          }
        />

        <ImgUploadControl
          label="Profile Picture"
          onChange={handleImageUpload}
          type="profile"
          src={user.image ? user.image.link : ""}
        />

        <SubmitButton isFullwidth={true} text="Save Changes" />
      </Form>
      <div className="content has-text-centered">
        <p className="">
          Looking to{" "}
          <span
            className="clickable-text has-text-link"
            onClick={() => onClickDelete()}
          >
            delete
          </span>{" "}
          your account?
        </p>
      </div>
    </section>
  );
};

EditUser.propTypes = {
  editUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.error
});

export default connect(mapStateToProps, { editUser, deleteUser })(EditUser);
