import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import moment from "moment";
import Geosuggest from "react-geosuggest";

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
    time: { formatted: moment().format("h:mm A") },
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
    return () => {
      clearErrors();
    };
  }, []);

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleTimeContextChange = timeContext => {
    if (timeContext === "Now") {
      setFormData({
        ...formData,
        timeContext,
        time: { formatted: moment().format("h:mm A") }
      });
      return;
    }
    setFormData({ ...formData, timeContext });
  };

  const handleTimeChange = newTime => {
    if (timeContext === "Now") {
      setFormData({ ...formData, timeContext: "Today" });
    }
    setFormData({ ...formData, time: newTime });
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

    const groupFields = {
      name,
      description,
      placeAddress: place.address,
      placeLat: place.lat ? place.lat : "",
      placeLng: place.lng ? place.lng : "",
      accessLevel,
      image
    };

    if (Number.isInteger(maxSize)) groupFields.maxSize = maxSize;

    const ISODate = moment();
    if (timeContext !== "Now") {
      ISODate.set({
        hour: time.hour24,
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
              <div className="control">
                <RadioButton
                  selectedValue={timeContext}
                  value="Now"
                  handleClick={handleTimeContextChange}
                />
              </div>
              <div className="control textonly-control">
                <h3>-or-</h3>
              </div>
              <div className="control">
                <Modal
                  additionalClasses="time-keeper"
                  modalToggleOverride={toggleTimekeeper}
                  isModalActiveOverride={displayTimepicker}
                  trigger={
                    <input
                      className="input small-input"
                      type="text"
                      value={time.formatted}
                      readOnly
                    />
                  }
                >
                  <TimeKeeper
                    time={time.formatted}
                    onChange={handleTimeChange}
                    onDoneClick={() => toggleTimekeeper()}
                    switchToMinuteOnHourSelect={true}
                  />
                </Modal>
              </div>
              <div className="control">
                <RadioButton
                  selectedValue={timeContext}
                  value="Today"
                  handleClick={handleTimeContextChange}
                />
              </div>
              <div className="control">
                <RadioButton
                  selectedValue={timeContext}
                  value="Tomorrow"
                  handleClick={handleTimeContextChange}
                />
              </div>
            </div>
          }
        />

        <CustomField
          label="Meeting Place"
          children={
            <div className="field">
              <div className="control">
                <Geosuggest
                  initialValue={place.address}
                  placeDetailFields={[]}
                  queryDelay={500}
                  onChange={onChangePlace}
                  onSuggestSelect={onSelectPlace}
                  inputClassName="input"
                />
              </div>
              {errPlace && <p className="help is-danger">{errPlace.msg}</p>}
            </div>
          }
        />

        <CustomField
          label="Access Level"
          children={
            <div className="field is-grouped is-grouped-multiline">
              <div className="control">
                <RadioButton
                  selectedValue={accessLevel}
                  value="Public"
                  handleClick={handleAccessLevelChange}
                />
              </div>
              <div className="control">
                <RadioButton
                  selectedValue={accessLevel}
                  value="Protected"
                  handleClick={handleAccessLevelChange}
                />
              </div>
              <div className="control">
                <RadioButton
                  selectedValue={accessLevel}
                  value="Private"
                  handleClick={handleAccessLevelChange}
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

        <SubmitButton text="Submit" />
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

export default connect(
  mapStateToProps,
  { createGroup, getGroups, clearErrors }
)(withRouter(NewGroup));
