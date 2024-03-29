import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link, Prompt } from "react-router-dom";
import moment from "moment";

import { createGroup, getGroups } from "../../actions/group";
import { clearErrors } from "../../actions/auth";

import Spinner from "../common/Spinner";
import NotFound from "../common/NotFound";
import RadioButton from "../form/RadioButton";
import TimeKeeper from "react-timekeeper";
import PageTitle from "../layout/page/PageTitle";
import Form from "../form/Form";
import FormControl from "../form/FormControl";
import SubmitButton from "../form/SubmitButton";
import CustomField from "../form/CustomField";
import ImgUploadControl from "../form/ImgUploadControl";
import Modal from "../common/subcomponents/Modal";
import GeoControl from "../common/subcomponents/GeoControl";

const NewGroup = ({
  match,
  history,
  groupType: { groupType },
  loading,
  errors,
  createGroup,
  getGroups,
  clearErrors
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    place: { address: "" },
    timeContext: "Now",
    accessLevel: "Public",
    time: { formatted12: moment().format("h:mm A") },
    displayTimepicker: false,
    maxSize: "",
    image: undefined
  });

  const {
    name,
    description,
    place,
    timeContext,
    accessLevel,
    time,
    displayTimepicker,
    maxSize,
    image
  } = formData;

  const errName = errors.find(error => error.param === "name");
  const errDescription = errors.find(error => error.param === "description");
  const errPlace = errors.find(error => error.param === "placeAddress");
  const errMaxSize = errors.find(error => error.param === "maxSize");

  useEffect(() => {
    const groupTypeParamSpaced = match.params.groupType.split("_").join(" ");
    const groupTypeParamChanged =
      groupType && groupType.name !== groupTypeParamSpaced;

    if (!groupType || groupTypeParamChanged) {
      getGroups(match.params.groupType.split("_").join(" "));
    }
  }, [match.params.groupType, groupType]);

  useEffect(() => {
    return () => {
      clearErrors();
    };
  }, []);

  const hasUnsavedChanges = () => {
    if (!loading) {
      const initialState = {
        name: "",
        description: "",
        place: { address: "" },
        timeContext: "Now",
        accessLevel: "Public",
        time: { formatted12: moment().format("h:mm A") },
        displayTimepicker: false,
        maxSize: "",
        image: undefined
      };

      if (
        name !== initialState.name ||
        description !== initialState.description ||
        place.address !== initialState.place.address ||
        timeContext !== initialState.timeContext ||
        accessLevel !== initialState.accessLevel ||
        maxSize !== initialState.maxSize ||
        image !== initialState.image
      ) {
        return true;
      }
    }

    return false;
  };

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleTimeContextChange = timeContext => {
    if (timeContext === "Now") {
      setFormData({
        ...formData,
        timeContext,
        time: { formatted12: moment().format("h:mm A") }
      });
      return;
    }
    setFormData({ ...formData, timeContext });
  };

  const handleTimeChange = newTime => {
    if (timeContext === "Now") {
      setFormData({
        ...formData,
        timeContext: "Today",
        time: newTime
      });
    } else {
      setFormData({ ...formData, time: newTime });
    }
  };

  const handleAccessLevelChange = accessLevel => {
    setFormData({ ...formData, accessLevel });
  };

  const handleImageUpload = imageFile => {
    setFormData({
      ...formData,
      image: imageFile
    });
  };

  const toggleTimekeeper = () => {
    setFormData({ ...formData, displayTimepicker: !displayTimepicker });
  };

  const onChangePlace = value =>
    setFormData({ ...formData, place: { address: value } });

  const onSelectPlace = selectedPlace => {
    if (!selectedPlace) return;

    const place = {
      address: selectedPlace.description,
      lat: selectedPlace.location.lat,
      lng: selectedPlace.location.lng
    };
    setFormData({ ...formData, place });
  };

  const onSubmit = e => {
    e.preventDefault();

    if (
      accessLevel !== "Public" &&
      !window.confirm(
        `Creating a ${accessLevel.toLowerCase()} group will use 1 group lock. Are you sure would like to proceed?`
      )
    ) {
      return;
    }

    const groupFields = {
      name,
      description,
      placeAddress: place.address,
      placeLat: place.lat ? place.lat : "",
      placeLng: place.lng ? place.lng : "",
      accessLevel,
      maxSize,
      image
    };

    //if (Number.isInteger(maxSize)) groupFields.maxSize = maxSize;

    const ISODate = moment();
    if (timeContext !== "Now") {
      ISODate.set({
        hour: time.hour,
        minute: time.minute
      });
    }
    if (timeContext === "Tomorrow") {
      ISODate.add(1, "day");
    }

    groupFields.time = ISODate.toISOString();
    groupFields.groupType = groupType._id;

    createGroup(groupFields, history);
  };

  if (loading) {
    return <Spinner isMidpage />;
  }

  if (!groupType) {
    return <NotFound />;
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
        <PageTitle
          title="Create a group"
          subtitle={
            <Link to={`/k/${match.params.groupType}`}>
              {match.params.groupType.split("_").join(" ")}
            </Link>
          }
        />
      </nav>

      <Form onSubmit={onSubmit}>
        <FormControl
          label="Name"
          name="name"
          value={name}
          onChange={onChange}
          error={errName ? errName.msg : undefined}
          required={true}
        />

        <CustomField
          label="Description"
          children={
            <div className="field">
              <div className="control">
                <textarea
                  className="textarea"
                  rows="2"
                  name="description"
                  value={description}
                  onChange={e => onChange(e)}
                  placeholder="E.g. Let's hang out and argue about flour and corn tortillas at my place."
                />
              </div>
              {errDescription && (
                <p className="help is-danger">{errDescription.msg}</p>
              )}
            </div>
          }
        />

        <CustomField
          label="Meeting Time"
          required={true}
          children={
            <div className="field is-grouped is-grouped-multiline">
              <div className="control hs-radio-btn-control">
                <RadioButton
                  selectedValue={timeContext}
                  value="Now"
                  handleClick={handleTimeContextChange}
                />
              </div>
              <div className="control textonly-control">
                <h3>-or-</h3>
              </div>
              <div className="control hs-radio-btn-control">
                <Modal
                  additionalClasses="time-keeper"
                  modalToggleOverride={toggleTimekeeper}
                  isModalActiveOverride={displayTimepicker}
                  trigger={
                    <input
                      className="input small-input"
                      type="text"
                      value={time.formatted12}
                      readOnly
                    />
                  }
                >
                  <TimeKeeper
                    time={time.formatted12}
                    onChange={handleTimeChange}
                    onDoneClick={() => toggleTimekeeper()}
                    switchToMinuteOnHourSelect={true}
                  />
                </Modal>
              </div>
              <div className="control is-expanded hs-radio-btn-control">
                <RadioButton
                  selectedValue={timeContext}
                  value="Today"
                  handleClick={handleTimeContextChange}
                  isFullwidth
                />
              </div>
              <div className="control is-expanded hs-radio-btn-control">
                <RadioButton
                  selectedValue={timeContext}
                  value="Tomorrow"
                  handleClick={handleTimeContextChange}
                  isFullwidth
                />
              </div>
            </div>
          }
        />

        <CustomField
          label="Meeting Place"
          children={
            <div className="field">
              <GeoControl
                initialValue={place.address}
                onChange={onChangePlace}
                onSuggestSelect={onSelectPlace}
              />
              {errPlace && <p className="help is-danger">{errPlace.msg}</p>}
            </div>
          }
        />

        <CustomField
          label={
            <span>
              Access Level&nbsp;
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
                    <strong>Public</strong> groups show up on group type feeds.
                    Users can join freely.
                    <br />
                    <br />
                    <strong>Protected</strong> groups show up on group type
                    feeds. Users can request to join and any of the group's
                    admins can answer the request.
                    <br />
                    <br />
                    <strong>Private</strong> groups do not show up in feeds and
                    cannot be searched for. Users can request to join via group
                    code and any of the group's admins can answer the request.
                  </div>
                </div>
              </Modal>
            </span>
          }
          children={
            <div className="field is-grouped is-grouped-multiline">
              <div className="control is-expanded hs-radio-btn-control">
                <RadioButton
                  selectedValue={accessLevel}
                  value="Public"
                  handleClick={handleAccessLevelChange}
                  isFullwidth
                />
              </div>
              <div className="control is-expanded hs-radio-btn-control">
                <RadioButton
                  selectedValue={accessLevel}
                  value="Protected"
                  handleClick={handleAccessLevelChange}
                  isFullwidth
                />
              </div>
              <div className="control is-expanded hs-radio-btn-control">
                <RadioButton
                  selectedValue={accessLevel}
                  value="Private"
                  handleClick={handleAccessLevelChange}
                  isFullwidth
                />
              </div>
            </div>
          }
        />
        <FormControl
          label="Max Group Size"
          name="maxSize"
          value={maxSize}
          onChange={onChange}
          error={errMaxSize ? errMaxSize.msg : undefined}
          placeholder="Any"
          isSmall={true}
        />

        <ImgUploadControl
          label="Group Image"
          onChange={handleImageUpload}
          type="group"
        />

        <SubmitButton isFullwidth={true} text="Submit" />
      </Form>
    </section>
  );
};

NewGroup.propTypes = {
  createGroup: PropTypes.func.isRequired,
  getGroups: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  groupType: PropTypes.object.isRequired,
  errors: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  loading: state.group.loading,
  groupType: state.groupType,
  errors: state.error
});

export default connect(mapStateToProps, {
  createGroup,
  getGroups,
  clearErrors
})(withRouter(NewGroup));
