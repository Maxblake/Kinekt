import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { editUser, deleteUser } from "../../actions/user";

import Spinner from "../common/Spinner";
import PageTitle from "../layout/page/PageTitle";
import Form from "../form/Form";
import FormControl from "../form/FormControl";
import SubmitButton from "../form/SubmitButton";
import CustomField from "../form/CustomField";

const EditUser = ({ editUser, deleteUser, errors, auth: { user } }) => {
  const [formData, setFormData] = useState({
    name: "",
    about: "",
    image: { name: "" }
  });

  const { name, about, image } = formData;

  const errName = errors.find(error => error.param === "name");
  const errAbout = errors.find(error => error.param === "about");

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        name: user.name,
        about: user.about
      });
    }
  }, [user]);

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

  const onSubmit = e => {
    e.preventDefault();

    editUser({ name, about, image: image.file });
  };

  const onClickDelete = () => {
    deleteUser();
  };

  if (!user) {
    return <Spinner />;
  }

  return (
    <section className="editUser centeredForm">
      <nav className="level" id="pageNav">
        <PageTitle title="Account Settings" />
      </nav>

      <Form onSubmit={onSubmit}>
        <FormControl
          label="Display Name"
          name="name"
          value={name}
          onChange={onChange}
          error={errName ? errName.msg : undefined}
          required={true}
        />

        <CustomField
          label="About you"
          error={errAbout ? errAbout.msg : undefined}
          children={
            <div class="field">
              <div class="control">
                <textarea
                  class="textarea"
                  rows="2"
                  name="about"
                  value={about}
                  onChange={e => onChange(e)}
                  placeholder="What brings you here? (This can be changed later)"
                />
              </div>
            </div>
          }
        />

        <CustomField
          label="Profile Picture"
          error={image.error}
          children={
            <div class="field">
              <div class="file has-name is-primary">
                <label class="file-label">
                  <input
                    class="file-input"
                    type="file"
                    name="userImage"
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
      <div className="content has-text-centered">
        <p className="">
          Looking to <a onClick={() => onClickDelete()}>delete</a> your account?
        </p>
      </div>
    </section>
  );
};

EditUser.propTypes = {
  editUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  errors: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.error
});

export default connect(
  mapStateToProps,
  { editUser, deleteUser }
)(EditUser);
