import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Image from "../../common/subcomponents/Image";

import { addNotice } from "../../../actions/group";

import defaultUserImage from "../../../resources/default_user_image.png";

const NewNotice = ({
  user,
  newNotice,
  setNewNotice,
  isHidden,
  hideNotice,
  addNotice,
  groupId
}) => {
  const [newNoticeState, setNewNoticeState] = useState({
    body: newNotice ? newNotice.body : ""
  });
  const { body } = newNoticeState;

  const onChange = e =>
    setNewNoticeState({ ...newNoticeState, [e.target.name]: e.target.value });

  const onSubmit = () => {
    if (body === "" && !newNotice) {
      return;
    }

    let noticeFields = {};

    if (newNotice) {
      noticeFields = {
        body: newNotice.body,
        authorId: newNotice.authorId
      };
    } else {
      noticeFields = { body, authorId: user._id };
    }

    addNotice(noticeFields, groupId);
    setNewNoticeState({ ...newNoticeState, body: "" });
    if (newNotice) setNewNotice(null);
    hideNotice();
  };

  const onCancel = () => {
    setNewNoticeState({ ...newNoticeState, body: "" });
    setNewNotice(null);
    hideNotice();
  };

  return (
    <div className={`notice new-notice hs-box ${isHidden ? "is-hidden" : ""}`}>
      <div className="media">
        <div className="media-left">
          {!newNotice ? (
            <Image
              src={
                user.image && user.image.link
                  ? user.image.link
                  : defaultUserImage
              }
              figureClass="is-square"
            />
          ) : (
            <span class="icon notice-from-chat-icon">
              <i class="fas fa-comment-dots"></i>
            </span>
          )}
        </div>
        <div class="media-content">
          <nav class="level notice-header is-mobile">
            <div class="level-left">
              <div class="level-item">
                <strong>{newNotice ? newNotice.authorName : user.name}</strong>
              </div>
            </div>
          </nav>
          {newNotice ? (
            <div class="content">
              <p>{newNotice.body}</p>
            </div>
          ) : (
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
          )}
          <nav class="level is-mobile">
            <div className="level-left"></div>
            <div class="level-right">
              <div class="level-item">
                <a class="button is-light" onClick={() => onCancel()}>
                  Cancel
                </a>
              </div>
              <div class="level-item">
                <a class="button is-primary" onClick={() => onSubmit()}>
                  Add Notice
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
