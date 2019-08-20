import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import moment from "moment";

import { createGroup, getGroups } from "../../actions/group";

import Spinner from "../common/Spinner";
import NotFound from "../common/NotFound";
import RadioButton from "../common/RadioButton";
import TimeKeeper from "react-timekeeper";

//TODO convert to functional, make sure groupType is always in state
const NewGroup = ({
  match,
  history,
  groupType: { groupType, loading },
  isAuthenticated,
  errors,
  createGroup,
  getGroups
}) => {
  useEffect(() => {
    if (!groupType) {
      getGroups(match.params.groupType.split("_").join(" "));
    }
  }, []);

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
    image: { name: "" }
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
      maxSize
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
    groupFields.image = image.file;
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
    <section className="NewGroup centeredForm">
      <nav className="level" id="pageNav">
        <div className="level-left">
          <div className="level-item">
            <div className="groupTypeTitleContainer">
              <Link
                to={`/k/${match.params.groupType}`}
                className="subtitle is-size-6 groupTypeSubtitleContainer"
              >
                {match.params.groupType.split("_").join(" ")}
              </Link>
              <h3 className="title is-size-3 pageTitle" id="groupPageTitle">
                Create a group
              </h3>
            </div>
          </div>
        </div>
      </nav>

      {displayTimepicker ? (
        <div class="modal is-active">
          <div
            class="modal-background"
            onClick={() => toggleTimekeeper(false)}
          />
          <div class="modal-content timeKeeperModalContent">
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

      <form className="box" onSubmit={e => onSubmit(e)}>
        <label class="label">Name *</label>
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              name="name"
              value={name}
              onChange={e => onChange(e)}
              placeholder="E.g. Taco Party"
            />
          </div>
          {errName && <p class="help is-danger">{errName.msg}</p>}
        </div>

        <label class="label">Description</label>
        <div class="field">
          <div class="control">
            <textarea
              class="textarea"
              rows="2"
              name="description"
              value={description}
              onChange={e => onChange(e)}
              placeholder="E.g. Let's hang out and argue about flour and corn tortillas at my place."
            />
          </div>
          {errDescription && <p class="help is-danger">{errDescription.msg}</p>}
        </div>

        <label class="label">Meeting Time *</label>
        <div class="field is-grouped">
          <div class="control">
            <RadioButton
              selectedValue={timeContext}
              value="Now"
              handleClick={handleTimeContextChange}
            />
          </div>
          <div class="control centeredVertically">
            <h3>-or-</h3>
          </div>
          <div class="control">
            <input
              class="input smallInput"
              type="text"
              value={time.formatted}
              onClick={() => toggleTimekeeper(true)}
              readOnly
            />
          </div>
          <div class="control">
            <RadioButton
              selectedValue={timeContext}
              value="Today"
              handleClick={handleTimeContextChange}
            />
          </div>
          <div class="control">
            <RadioButton
              selectedValue={timeContext}
              value="Tomorrow"
              handleClick={handleTimeContextChange}
            />
          </div>
        </div>

        <label class="label">Meeting Place *</label>
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              name="place"
              value={place}
              onChange={e => onChange(e)}
              placeholder="E.g. 555 My House, Newport RI"
            />
          </div>
          {errPlace && <p class="help is-danger">{errPlace.msg}</p>}
        </div>

        <label class="label">Group Size</label>
        <div class="field">
          <div className="field is-grouped">
            <div class="control">
              <input
                class="input smallInput"
                type="text"
                placeholder="Any"
                name="minSize"
                value={minSize}
                onChange={e => onChange(e)}
              />
            </div>
            <div class="control centeredVertically">
              <h3>-to-</h3>
            </div>
            <div class="control">
              <input
                class="input smallInput"
                type="text"
                placeholder="Any"
                name="maxSize"
                value={maxSize}
                onChange={e => onChange(e)}
              />
            </div>
          </div>
          {errMaxSize && <p class="help is-danger">{errMaxSize.msg}</p>}
          <p class="help is-danger">asdfasfasdfasfasdfasfasdf</p>
        </div>

        <label class="label">Access Level</label>
        <div class="field is-grouped">
          <div class="control">
            <RadioButton
              selectedValue={accessLevel}
              value="Public"
              handleClick={handleAccessLevelChange}
            />
          </div>
          <div class="control">
            <RadioButton
              selectedValue={accessLevel}
              value="Private"
              handleClick={handleAccessLevelChange}
            />
          </div>
        </div>

        <label class="label">Group Image</label>
        <div class="field">
          <div class="file has-name is-primary">
            <label class="file-label">
              <input
                class="file-input"
                type="file"
                name="groupImage"
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
              Submit
            </button>
          </div>
        </div>
      </form>
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
