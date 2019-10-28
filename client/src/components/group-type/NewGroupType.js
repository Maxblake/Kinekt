import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Prompt } from "react-router-dom";

import { requestGroupType } from "../../actions/groupType";
import { clearErrors } from "../../actions/auth";

import PageTitle from "../layout/page/PageTitle";
import Form from "../form/Form";
import FormControl from "../form/FormControl";
import SubmitButton from "../form/SubmitButton";
import CustomField from "../form/CustomField";
import ImgUploadControl from "../form/ImgUploadControl";
import Spinner from "../common/Spinner";

const NewGroupType = ({
  history,
  requestGroupType,
  clearErrors,
  loading,
  errors
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    image: undefined
  });

  const { name, description, image, category } = formData;

  const errName = errors.find(error => error.param === "name");
  const errDescription = errors.find(error => error.param === "description");
  const errCategory = errors.find(error => error.param === "category");

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
        category: "",
        image: undefined
      };

      if (
        name !== initialState.name ||
        description !== initialState.description ||
        category !== initialState.category ||
        image !== initialState.image
      ) {
        return true;
      }
    }

    return false;
  };

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageUpload = imageFile => {
    setFormData({
      ...formData,
      image: imageFile
    });
  };

  const onSubmit = async e => {
    e.preventDefault();

    const groupTypeFields = {
      name,
      description,
      category,
      image
    };

    requestGroupType(groupTypeFields, history);
  };

  if (loading) {
    return <Spinner isMidpage />;
  }

  return (
    <section className="centered-form">
      <Prompt
        when={true}
        message={
          hasUnsavedChanges()
            ? "You have unsaved changes. Are you sure you would like to leave this page?"
            : null
        }
      />

      <nav className="level" id="page-nav">
        <PageTitle title="Request a New Group Type" />
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
                  placeholder="E.g. Calling board game enthusiasts- hang out and share your favorite games with new friends!"
                />
              </div>
              {errDescription && (
                <p className="help is-danger">{errDescription.msg}</p>
              )}
            </div>
          }
        />

        <CustomField
          label="Category"
          children={
            <div className="field">
              <div className="control">
                <div className="select">
                  <select
                    name="category"
                    value={category}
                    onChange={e => onChange(e)}
                  >
                    <option>Select One</option>
                    <option>Social</option>
                    <option>Gaming</option>
                    <option>Educational</option>
                    <option>Professional</option>
                    <option>Hobby</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              {errCategory && (
                <p className="help is-danger">{errCategory.msg}</p>
              )}
            </div>
          }
        />

        <ImgUploadControl
          label="Group Type Image"
          onChange={handleImageUpload}
          type="groupType"
        />

        <SubmitButton text="Submit" />
      </Form>
    </section>
  );
};

NewGroupType.propTypes = {
  requestGroupType: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  errors: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  errors: state.error,
  loading: state.groupType.loading
});

export default connect(
  mapStateToProps,
  { requestGroupType, clearErrors }
)(withRouter(NewGroupType));
