import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { requestGroupType } from "../../actions/groupType";

import PageTitle from "../layout/page/PageTitle";
import Form from "../form/Form";
import FormControl from "../form/FormControl";
import SubmitButton from "../form/SubmitButton";
import CustomField from "../form/CustomField";
import ImgUploadControl from "../form/ImgUploadControl";

const NewGroupType = ({ history, requestGroupType, errors }) => {
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

  return (
    <section className="centered-form">
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
                  placeholder="E.g. Calling board game enthusiasts- hang out and share your favorite games with new friends!"
                />
              </div>
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
  errors: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  errors: state.error
});

export default connect(
  mapStateToProps,
  { requestGroupType }
)(withRouter(NewGroupType));
