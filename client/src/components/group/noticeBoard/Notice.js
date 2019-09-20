import React, { useState } from "react";

import Image from "../../common/subcomponents/Image";

import defaultUserImage from "../../../resources/default_user_image.png";

const Notice = ({ user }) => {
  const [noticeState, setNoticeState] = useState({ isMinimized: true });
  const { isMinimized } = noticeState;

  const toggleMinimizeNotice = () => {
    setNoticeState({ ...noticeState, isMinimized: !isMinimized });
  };

  return (
    <div className="notice new-notice box">
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
            <div class="level-right">
              <div class="level-item">
                <span
                  class="icon minimize-notice-btn"
                  onClick={() => toggleMinimizeNotice()}
                >
                  <i
                    className={`fas fa-chevron-${isMinimized ? "up" : "down"}`}
                  ></i>
                </span>
              </div>
            </div>
          </nav>
          <div class="content">
            <p>
              <strong>John Smith</strong> <small>@johnsmith</small>{" "}
              <small>31m</small>
              <br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas
              non massa sem. Etiam finibus odio quis feugiat facilisis.
            </p>
          </div>
          <nav class="level is-mobile">
            <div class="level-left">
              <a class="level-item">
                <span class="icon is-small">
                  <i class="fas fa-reply"></i>
                </span>
              </a>
              <a class="level-item">
                <span class="icon is-small">
                  <i class="fas fa-retweet"></i>
                </span>
              </a>
              <a class="level-item">
                <span class="icon is-small">
                  <i class="fas fa-heart"></i>
                </span>
              </a>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Notice;
