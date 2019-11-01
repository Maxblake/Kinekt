import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link, Prompt } from "react-router-dom";
import Geosuggest from "react-geosuggest";

import { editGroup, getGroup } from "../../actions/group";
import { clearErrors } from "../../actions/auth";

import Spinner from "../common/Spinner";
import NotFound from "../common/NotFound";
import RadioButton from "../form/RadioButton";
import PageTitle from "../layout/page/PageTitle";
import Form from "../form/Form";
import FormControl from "../form/FormControl";
import SubmitButton from "../form/SubmitButton";
import CustomField from "../form/CustomField";
import ImgUploadControl from "../form/ImgUploadControl";
import Modal from "../common/subcomponents/Modal";

const EditGroup = ({
  match,
  getGroup,
  clearErrors,
  group: { group, loading, error },
  groupType: { groupType },
  auth: { user, isAuthenticated },
  errors,
  editGroup
}) => {
  const [formData, setFormData] = useState({
    description: "",
    place: { address: "" },
    accessLevel: "Public",
    maxSize: "",
    image: undefined
  });

  const { description, place, accessLevel, maxSize, image } = formData;

  const errDescription = errors.find(error => error.param === "description");
  const errPlace = errors.find(error => error.param === "placeAddress");
  const errMaxSize = errors.find(error => error.param === "maxSize");

  useEffect(() => {
    if (isAuthenticated && (!group || group.HRID !== match.params.groupCode)) {
      const userCurrentGroupHRID = user.currentGroup
        ? user.currentGroup.HRID
        : "";

      getGroup({
        HRID: match.params.groupCode,
        userCurrentGroupHRID: userCurrentGroupHRID
      });
    }

    if (!!group && errors.length === 0) {
      setFormData({
        ...formData,
        description: group.description ? group.description : description,
        place: group.place,
        accessLevel: group.accessLevel,
        maxSize: group.maxSize ? group.maxSize : maxSize
      });
    }
    return () => {
      clearErrors();
    };
  }, [isAuthenticated, group, match.params.groupCode, user, errors]);

  const hasUnsavedChanges = () => {
    if (!!group) {
      const initialState = {
        description: group.description ? group.description : "",
        place: group.place,
        accessLevel: group.accessLevel,
        maxSize: group.maxSize ? group.maxSize : "",
        image: undefined
      };

      if (
        description !== initialState.description ||
        place.address !== initialState.place.address ||
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

  const handleAccessLevelChange = accessLevel => {
    setFormData({ ...formData, accessLevel });
  };

  const handleImageUpload = imageFile => {
    setFormData({
      ...formData,
      image: imageFile
    });
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
      group.accessLevel === "Public" &&
      accessLevel !== "Public" &&
      !window.confirm(
        `Changing to a ${accessLevel.toLowerCase()} group will use 1 group lock. Are you sure would like to proceed?`
      )
    ) {
      return;
    }

    const groupFields = {
      description,
      placeAddress: place.address,
      placeLat: place.lat ? place.lat : "",
      placeLng: place.lng ? place.lng : "",
      accessLevel,
      maxSize,
      image
    };

    if (Number.isInteger(maxSize)) groupFields.maxSize = maxSize;

    editGroup(groupFields, group._id);
  };

  if (loading) {
    return <Spinner isMidpage />;
  }

  if (
    !group ||
    !groupType ||
    (error && error.HRID === match.params.groupCode)
  ) {
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
          title="Edit Group"
          subtitle={
            <Link to={`/k/${match.params.groupType}/group/${group.HRID}`}>
              {group.name}
            </Link>
          }
        />
      </nav>

      <Form onSubmit={onSubmit}>
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
                <div className="hs-box info-modal is-vcentered has-rounded-corners">
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
            <div className="field is-grouped">
              <div className="control hs-radio-btn-control">
                <RadioButton
                  selectedValue={accessLevel}
                  value="Public"
                  handleClick={handleAccessLevelChange}
                />
              </div>
              <div className="control hs-radio-btn-control">
                <RadioButton
                  selectedValue={accessLevel}
                  value="Protected"
                  handleClick={handleAccessLevelChange}
                />
              </div>
              <div className="control hs-radio-btn-control">
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
          src={group.image ? group.image.link : ""}
        />

        <SubmitButton isFullwidth={true} text="Save Changes" />
      </Form>
    </section>
  );
};

EditGroup.propTypes = {
  editGroup: PropTypes.func.isRequired,
  getGroup: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
  groupType: PropTypes.object.isRequired,
  errors: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  group: state.group,
  groupType: state.groupType,
  errors: state.error
});

export default connect(
  mapStateToProps,
  { editGroup, getGroup, clearErrors }
)(withRouter(EditGroup));
