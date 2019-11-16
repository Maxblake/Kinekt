import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { getGroup } from "../../actions/group";

import OnlineStatus from "../common/subcomponents/OnlineStatus";
import GroupDetails from "../common/subcomponents/GroupDetails";
import Image from "../common/subcomponents/Image";

const GroupCard = ({
  history,
  group,
  groupTypeName,
  defaultImg,
  userNumbers,
  isBanned,
  isMember,
  getGroup
}) => {
  const clickedGroupCard = e => {
    if (!isMember && group.accessLevel !== "Public") {
      e.preventDefault();
      getGroup({ HRID: group.HRID }, history);
    }
  };

  const isFull =
    userNumbers &&
    userNumbers.maxSize &&
    userNumbers.users >= userNumbers.maxSize
      ? true
      : false;

  const accessLevelTag = isMember ? (
    <div className="tag card-tag">
      <span className="icon">
        <i className="fas fa-user-check" />
      </span>
      <span>Joined</span>
    </div>
  ) : group.accessLevel === "Protected" ? (
    <div className="tag card-tag">
      <span className="icon">
        <i className="fas fa-lock" />
      </span>
      <span>Protected</span>
    </div>
  ) : (
    <div className="tag card-tag">
      <span className="icon">
        <i className="fas fa-door-open" />
      </span>
      <span>Public</span>
    </div>
  );

  const groupCard = (
    <Fragment>
      <div className="column is-8 groupCard">
        <div className="card-content">
          <div className="group-name">
            <h1 className="title is-size-4">{group.name}</h1>
            <div className="subtitle is-size-6">
              <OnlineStatus
                users={userNumbers ? userNumbers.users : ""}
                maxSize={userNumbers ? userNumbers.maxSize : ""}
              />
            </div>
          </div>
          <GroupDetails group={group} />
        </div>
      </div>
      <div className="column is-4 card-image">
        {accessLevelTag}
        <Image
          figureClass="is-2by1"
          src={group.image ? group.image.link : defaultImg}
        />
      </div>
    </Fragment>
  );

  return (
    <Fragment>
      {isBanned || (isFull && !isMember) ? (
        <div className={"columns is-gapless card group-card-container"}>
          <div className="group-card-overlay">
            <h5 className="is-size-5 ">
              {isBanned
                ? "You are banned from this group"
                : "This group is currently full"}
            </h5>
          </div>
          {groupCard}
        </div>
      ) : (
        <Link
          onClick={e => clickedGroupCard(e)}
          to={`/k/${groupTypeName}/group/${group.HRID}`}
          className={"columns is-gapless card group-card-container"}
        >
          {groupCard}
        </Link>
      )}
    </Fragment>
  );
};

GroupCard.propTypes = {
  getGroup: PropTypes.func.isRequired
};

export default connect(null, { getGroup })(GroupCard);
