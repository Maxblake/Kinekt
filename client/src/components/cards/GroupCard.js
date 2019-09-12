import React, { Fragment } from "react";
import { Link } from "react-router-dom";

import OnlineStatus from "../common/subcomponents/OnlineStatus";
import GroupDetails from "../common/subcomponents/GroupDetails";
import Image from "../common/subcomponents/Image";

const GroupCard = ({
  group,
  groupTypeName,
  defaultImg,
  userNumbers,
  isBanned
}) => {
  const isFull =
    userNumbers &&
    userNumbers.maxSize &&
    userNumbers.users >= userNumbers.maxSize
      ? true
      : false;

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
        <Image
          figureClass="is-2by1"
          src={group.image ? group.image.link : defaultImg}
        />
      </div>
    </Fragment>
  );

  return (
    <Fragment>
      {isBanned || isFull ? (
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
          to={`/k/${groupTypeName}/group/${group.HRID}`}
          className={"columns is-gapless card group-card-container"}
        >
          {groupCard}
        </Link>
      )}
    </Fragment>
  );
};

export default GroupCard;
