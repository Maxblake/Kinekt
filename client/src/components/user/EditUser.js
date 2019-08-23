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
import ImgUploadControl from "../form/ImgUploadControl";

const EditUser = ({ editUser, deleteUser, errors, auth: { user } }) => {
  const [formData, setFormData] = useState({
    name: "",
    about: "",
    image: undefined
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

  const handleImageUpload = imageFile => {
    setFormData({
      ...formData,
      image: imageFile
    });
  };

  const onSubmit = e => {
    e.preventDefault();

    editUser({ name, about, image });
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

        <ImgUploadControl
          label="Profile Picture"
          onChange={handleImageUpload}
          type="profile"
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
