import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";

import Image from "../../common/subcomponents/Image";

import { deleteNotice } from "../../../actions/group";

import defaultUserImage from "../../../resources/default_user_image.png";

const Notice = ({ notice, groupId, deleteNotice, isCurrentUserAdmin }) => {
  const onClickDelete = () => {
    deleteNotice(notice._id, groupId);
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
    <div className="notice new-notice box">
      <div className="media">
        <div className="media-left">
          <Image
            src={notice.authorImage ? notice.authorImage : defaultUserImage}
            figureClass="is-square"
          />
        </div>
        <div class="media-content">
          <nav class="level notice-header">
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

Notice.propTypes = {
  deleteNotice: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteNotice }
)(Notice);
