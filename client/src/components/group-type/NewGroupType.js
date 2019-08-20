import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { requestGroupType } from "../../actions/groupType";
import PropTypes from "prop-types";

const Filter = require("bad-words-relaxed");
const filter = new Filter();

const NewGroupType = ({ requestGroupType, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    image: { name: "" }
  });

  const { name, description, image, category } = formData;

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

    requestGroupType(groupTypeFields);

    //TODO redirect to discover
  };

  return (
    <section className="NewGroupType centeredForm">
      <nav className="level" id="pageNav">
        <div className="level-left">
          <div className="level-item">
            <h3 className="title is-size-3 pageTitle">
              Request a New Group Type
            </h3>
          </div>
        </div>
      </nav>

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
              placeholder="E.g. Table-top gaming"
              required
            />
          </div>
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
              placeholder="E.g. Calling board game enthusiasts- hang out and share your favorite games with new friends!"
            />
          </div>
        </div>

        <label class="label">Category</label>
        <div class="field">
          <div class="control">
            <div class="select">
              <select
                required
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
        </div>

        <label class="label">Group Type Image</label>
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
            <button class="button is-text" type="button">
              Cancel
            </button>
          </div>
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

NewGroupType.propTypes = {
  requestGroupType: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { requestGroupType }
)(NewGroupType);
