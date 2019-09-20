import React, { useState } from "react";

import Image from "../../common/subcomponents/Image";

import defaultUserImage from "../../../resources/default_user_image.png";

const NewNotice = ({ user }) => {
  const [newNoticeState, setNewNoticeState] = useState({ isMinimized: true });
  const { isMinimized } = newNoticeState;

  const toggleMinimizeNotice = () => {
    setNewNoticeState({ ...newNoticeState, isMinimized: !isMinimized });
  };

  const notice = (
    <div
      className={`notice new-notice box ${isMinimized ? "is-minimized" : ""}`}
    >
      <div className="media">
        <div className={`media-left ${isMinimized ? "is-hidden" : ""}`}>
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
                <strong>{isMinimized ? "Add a Notice" : user.name}</strong>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <span
                  class="icon minimize-notice-btn"
                  onClick={() => toggleMinimizeNotice()}
                >
                  <i
                    className={`fas ${
                      isMinimized ? "fa-plus" : "fa-chevron-up"
                    }`}
                  ></i>
                </span>
              </div>
            </div>
          </nav>
          <div className={`${isMinimized ? "is-hidden" : ""}`}>
            <div class="field">
              <p class="control">
                <textarea
                  class="textarea"
                  placeholder="Add a notice..."
                ></textarea>
              </p>
            </div>
            <nav class="level">
              <div className="level-left"></div>
              <div class="level-right">
                <div class="level-item">
                  <a class="button is-light">Cancel</a>
                </div>
                <div class="level-item">
                  <a class="button is-primary">Submit</a>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );

  return isMinimized ? (
    <a onClick={() => toggleMinimizeNotice()}>{notice}</a>
  ) : (
    notice
  );
};

export default NewNotice;
