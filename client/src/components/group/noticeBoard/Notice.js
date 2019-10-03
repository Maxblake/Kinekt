import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";

import Image from "../../common/subcomponents/Image";

import { deleteNotice, toggleLikeNotice } from "../../../actions/group";

import defaultUserImage from "../../../resources/default_user_image.png";

const Notice = ({
  notice,
  groupId,
  deleteNotice,
  toggleLikeNotice,
  isCurrentUserAdmin,
  isLiked,
  numLikes
}) => {
  const [noticeState, setNoticeState] = useState({
    isNoticeLiked: isLiked
  });
  const { isNoticeLiked } = noticeState;

  const onClickDelete = () => {
    deleteNotice(notice._id, groupId);
  };

  const onClickLike = () => {
    setNoticeState({
      isNoticeLiked: !isNoticeLiked
    });
    toggleLikeNotice(notice._id, groupId);
  };

  const getTimeString = ISODate => {
    const currentTime = moment();
    const creationTime = moment(ISODate);

    const diff = currentTime.diff(creationTime);
    const diffDuration = moment.duration(diff);

    if (diffDuration.hours() > 0) {
      return `${diffDuration.hours()} hour${
        diffDuration.hours() === 1 ? "" : "s"
      } ago`;
    } else if (diffDuration.minutes() < 1) {
      return "A few seconds ago";
    }

    return `${diffDuration.minutes()} minute${
      diffDuration.minutes() === 1 ? "" : "s"
    } ago`;
  };

  return (
    <div className="notice new-notice hs-box">
      <div className="media">
        <div className="media-left">
          <Image
            src={notice.authorImage ? notice.authorImage : defaultUserImage}
            figureClass="is-square"
          />
        </div>
        <div class="media-content">
          <nav class="level notice-header is-mobile">
            <div class="level-left">
              <div class="level-item">
                <strong>{notice.authorName}</strong>
              </div>
              <div class="level-item">
                <small>{getTimeString(notice.creationTimestamp)}</small>
              </div>
            </div>
            <div class="level-right">
              {isCurrentUserAdmin && (
                <div class="level-item">
                  <button
                    className="delete"
                    onClick={() => onClickDelete()}
                  ></button>
                </div>
              )}
            </div>
          </nav>
          <div class="content">
            <p>{notice.body}</p>
          </div>
          <button
            className={`button is-small like-notice-button ${
              isNoticeLiked ? "is-primary" : "is-outlined is-dark"
            }`}
            type="button"
            onClick={() => onClickLike()}
          >
            <span class="icon is-small">
              <i class="fas fa-heart"></i>
            </span>
            {numLikes && numLikes > 0 ? <span>{numLikes}</span> : null}
          </button>
        </div>
      </div>
    </div>
  );
};

Notice.propTypes = {
  deleteNotice: PropTypes.func.isRequired,
  toggleLikeNotice: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteNotice, toggleLikeNotice }
)(Notice);
