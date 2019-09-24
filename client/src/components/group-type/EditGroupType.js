import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import { editGroupType } from "../../actions/groupType";
import { getGroups } from "../../actions/group";

import PageTitle from "../layout/page/PageTitle";
import Form from "../form/Form";
import SubmitButton from "../form/SubmitButton";
import CustomField from "../form/CustomField";
import ImgUploadControl from "../form/ImgUploadControl";
import Spinner from "../common/Spinner";
import NotFound from "../common/NotFound";

const EditGroupType = ({
  match,
  editGroupType,
  getGroups,
  errors,
  group,
  groupType: { groupType, loading },
  auth: { user }
}) => {
  const [formData, setFormData] = useState({
    description: "",
    category: "",
    image: undefined
  });

  const { description, image, category } = formData;

  const errDescription = errors.find(error => error.param === "description");
  const errCategory = errors.find(error => error.param === "category");

  useEffect(() => {
    const groupTypeParamSpaced = match.params.groupType.split("_").join(" ");
    const groupTypeParamChanged =
      groupType && groupType.name !== groupTypeParamSpaced;

    if (!groupType || groupTypeParamChanged) {
      getGroups(groupTypeParamSpaced);
    } else if (groupType) {
      setFormData({
        ...formData,
        description: groupType.description,
        category: groupType.category
      });
    }
  }, [groupType]);

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
    editGroupType(
      {
        description,
        category,
        image
      },
      groupType._id
    );
  };

  if (loading || group.loading) {
    return <Spinner />;
  }

  if (!groupType || user._id !== groupType.creator) {
    return <NotFound />;
  }

  return (
    <section className="centered-form">
      <nav className="level" id="page-nav">
        <PageTitle
          title="Edit Group Type"
          subtitle={
            <Link to={`/k/${groupType.name.split(" ").join("_")}`}>
              {groupType.name}
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
          src={groupType.image ? groupType.image.link : ""}
        />

        <SubmitButton text="Submit" />
      </Form>
    </section>
  );
};

EditGroupType.propTypes = {
  editGroupType: PropTypes.func.isRequired,
  getGroups: PropTypes.func.isRequired,
  errors: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
  groupType: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.error,
  auth: state.auth,
  group: state.group,
  groupType: state.groupType
});

export default connect(
  mapStateToProps,
  { editGroupType, getGroups }
)(withRouter(EditGroupType));
