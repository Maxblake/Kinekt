import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import moment from "moment";

import { createGroup, getGroups } from "../../actions/group";

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

const NewGroup = ({
  match,
  history,
  groupType: { groupType, loading },
  isAuthenticated,
  errors,
  createGroup,
  getGroups
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    place: "",
    timeContext: "Now",
    accessLevel: "Public",
    time: { formatted: moment().format("h:mm A") },
    displayTimepicker: false,
    minSize: "",
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
    minSize,
    maxSize,
    image
  } = formData;

  const errName = errors.find(error => error.param === "name");
  const errDescription = errors.find(error => error.param === "description");
  const errPlace = errors.find(error => error.param === "place");
  const errMaxSize = errors.find(error => error.param === "maxSize");

  useEffect(() => {
    if (!groupType) {
      getGroups(match.params.groupType.split("_").join(" "));
    }
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

  const toggleTimekeeper = val => {
    setFormData({ ...formData, displayTimepicker: val });
  };

  const onSubmit = e => {
    e.preventDefault();

    const groupFields = {
      name,
      description,
      place,
      accessLevel,
      minSize,
      maxSize,
      image
    };

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

  if (!groupType && isAuthenticated && !loading) {
    return <NotFound />;
  }

  if (!groupType) {
    return <Spinner />;
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

      {displayTimepicker ? (
        <div className="modal is-active">
          <div
            className="modal-background"
            onClick={() => toggleTimekeeper(false)}
          />
          <div className="modal-content time-keeper-modal-content">
            <TimeKeeper
              time={time.formatted}
              onChange={handleTimeChange}
              onDoneClick={() => toggleTimekeeper(false)}
              switchToMinuteOnHourSelect={true}
            />
          </div>
        </div>
      ) : (
        false
      )}

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
          error={errDescription ? errDescription.msg : undefined}
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
            </div>
          }
        />

        <CustomField
          label="Meeting Time"
          required={true}
          children={
            <div className="field is-grouped">
              <div className="control">
                <RadioButton
                  selectedValue={timeContext}
                  value="Now"
                  handleClick={handleTimeContextChange}
                />
              </div>
              <div className="control centeredVertically">
                <h3>-or-</h3>
              </div>
              <div className="control">
                <input
                  className="input small-input"
                  type="text"
                  value={time.formatted}
                  onClick={() => toggleTimekeeper(true)}
                  readOnly
                />
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

        <FormControl
          label="Meeting Place"
          name="place"
          value={place}
          onChange={onChange}
          error={errPlace ? errPlace.msg : undefined}
          required={true}
        />

        <CustomField
          label="Group Size"
          error={errMaxSize ? errMaxSize.msg : undefined}
          children={
            <div className="field">
              <div className="control is-flex">
                <input
                  className="input small-input"
                  type="text"
                  placeholder="Any"
                  name="minSize"
                  value={minSize}
                  onChange={e => onChange(e)}
                />
                <div className="centeredVertically grouped-control-margin">
                  <h3>-to-</h3>
                </div>
                <input
                  className="input small-input"
                  type="text"
                  placeholder="Any"
                  name="maxSize"
                  value={maxSize}
                  onChange={e => onChange(e)}
                />
              </div>
            </div>
          }
        />

        <CustomField
          label="Group Size"
          children={
            <div className="field is-grouped">
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
                  value="Private"
                  handleClick={handleAccessLevelChange}
                />
              </div>
            </div>
          }
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
  isAuthenticated: PropTypes.bool,
  groupType: PropTypes.object.isRequired,
  errors: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  groupType: state.groupType,
  errors: state.error
});

export default connect(
  mapStateToProps,
  { createGroup, getGroups }
)(withRouter(NewGroup));