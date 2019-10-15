import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
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

    if (group && errors.length === 0) {
      setFormData({
        ...formData,
        description: group.description,
        place: group.place,
        accessLevel: group.accessLevel,
        maxSize: group.maxSize
      });
    }
    return () => {
      clearErrors();
    };
  }, [isAuthenticated, group, match.params.groupCode]);

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

    const groupFields = {
      description,
      placeAddress: place.address,
      placeLat: place.lat ? place.lat : "",
      placeLng: place.lng ? place.lng : "",
      accessLevel,
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
          label="Access Level"
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
          src={group.image ? group.image.link : ""}
        />

        <SubmitButton text="Save Changes" />
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
