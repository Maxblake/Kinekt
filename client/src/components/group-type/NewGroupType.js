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

const NewGroupType = ({ history, requestGroupType, errors }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    image: { name: "" }
  });

  const { name, description, image, category } = formData;

  const errName = errors.find(error => error.param === "name");
  const errDescription = errors.find(error => error.param === "description");
  const errCategory = errors.find(error => error.param === "category");

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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

  const onSubmit = async e => {
    e.preventDefault();

    const groupTypeFields = {
      name,
      description,
      category,
      image: image.file
    };

    requestGroupType(groupTypeFields, history);
  };

  return (
    <section className="NewGroupType centeredForm">
      <nav className="level" id="pageNav">
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
            <div class="field">
              <div class="control">
                <textarea
                  class="textarea"
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
            <div class="field">
              <div class="control">
                <div class="select">
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
              {errCategory && <p class="help is-danger">{errCategory.msg}</p>}
            </div>
          }
        />

        <CustomField
          label="Group Image"
          error={image.error}
          children={
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
            </div>
          }
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
