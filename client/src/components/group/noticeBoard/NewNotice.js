import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Image from "../../common/subcomponents/Image";

import { addNotice } from "../../../actions/group";

import defaultUserImage from "../../../resources/default_user_image.png";

const NewNotice = ({ user, isHidden, hideNotice, addNotice, groupId }) => {
  const [newNoticeState, setNewNoticeState] = useState({ body: "d" });
  const { body } = newNoticeState;

  const onChange = e =>
    setNewNoticeState({ ...newNoticeState, [e.target.name]: e.target.value });

  const onSubmit = () => {
    if (body === "") {
      return;
    }

    const noticeFields = {
      body,
      authorId: user._id
    };

    addNotice(noticeFields, groupId);

    setNewNoticeState({ ...newNoticeState, body: "" });
  };

  return (
    <div className={`notice new-notice box ${isHidden ? "is-hidden" : ""}`}>
      <div className="media">
        <div className="media-left">
          <Image
            src={
              user.image && user.image.link ? user.image.link : defaultUserImage
            }
            figureClass="is-square"
          />
        </div>
        <div class="media-content">
          <nav class="level notice-header">
            <div class="level-left">
              <div class="level-item">
                <strong>{user.name}</strong>
              </div>
            </div>
          </nav>
          <div class="field">
            <p class="control">
              <textarea
                class="textarea"
                placeholder="Add a notice..."
                name="body"
                value={body}
                onChange={e => onChange(e)}
              ></textarea>
            </p>
          </div>
          <nav class="level">
            <div className="level-left"></div>
            <div class="level-right">
              <div class="level-item">
                <a class="button is-light" onClick={() => hideNotice()}>
                  Cancel
                </a>
              </div>
              <div class="level-item">
                <a class="button is-primary" onClick={() => onSubmit()}>
                  Submit
                </a>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

NewNotice.propTypes = {
  addNotice: PropTypes.func.isRequired
};

export default connect(
  null,
  { addNotice }
)(NewNotice);
