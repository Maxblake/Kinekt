import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";
import { editUser, deleteUser } from "../../actions/user";
import { loadUser } from "../../actions/auth";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";

const Filter = require("bad-words-relaxed");
const filter = new Filter();

const EditUser = ({
  setAlert,
  editUser,
  deleteUser,
  loadUser,
  auth: { user, loading }
}) => {
  const [formData, setFormData] = useState({
    name: "",
    about: ""
  });

  const { name, about } = formData;

  useEffect(() => {
    if (!loading) {
      if (user === null) {
        loadUser();
      } else {
        setFormData({ ...formData, name: user.name, about: user.about });
      }
    }
  }, [user]);

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();

    //TODO filter profane fields, also why async?

    editUser(name, about);
  };

  const onClickDelete = e => {
    deleteUser();
  };

  if (loading) {
    return <Spinner />;
  }

  if (user === null) {
    return <div>Page not found</div>;
  }

  return (
    <section className="editUser centeredForm">
      <nav className="level" id="pageNav">
        <div className="level-left">
          <div className="level-item">
            <h3 className="title is-size-3 pageTitle">Account Settings</h3>
          </div>
        </div>
      </nav>

      <form className="box" onSubmit={e => onSubmit(e)}>
        <label class="label">Display Name</label>
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="text"
              name="name"
              value={name}
              onChange={e => onChange(e)}
              required
            />
          </div>
        </div>

        <label class="label">About you</label>
        <div class="field">
          <div class="control">
            <textarea
              class="textarea"
              rows="2"
              placeholder="What brings you here? (This can be changed later)"
              name="about"
              value={about}
              onChange={e => onChange(e)}
            />
          </div>
        </div>

        {/* TODO add image upload */}
        <label class="label">Profile Picture</label>
        <div class="field">
          <div class="file has-name is-primary">
            <label class="file-label">
              <input class="file-input" type="file" name="resume" />
              <span class="file-cta">
                <span class="file-icon">
                  <i class="fas fa-upload" />
                </span>
                <span class="file-label">Choose a file…</span>
              </span>
              <span class="file-name">
                Screen Shot 2017-07-29 at 15.54.25.png
              </span>
            </label>
          </div>
        </div>

        <div class="field is-grouped is-grouped-right">
          <div class="control">
            <button
              class="button is-text"
              type="button"
              onClick={e => onClickDelete(e)}
            >
              Delete Account
            </button>
          </div>
          <div class="control">
            <button class="button is-primary" type="submit">
              Save
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

EditUser.propTypes = {
  setAlert: PropTypes.func.isRequired,
  editUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  loadUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { setAlert, editUser, deleteUser, loadUser }
)(EditUser);
