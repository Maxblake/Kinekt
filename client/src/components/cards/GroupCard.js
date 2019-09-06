import React from "react";
import { Link } from "react-router-dom";

import OnlineStatus from "../common/subcomponents/OnlineStatus";
import GroupDetails from "../common/subcomponents/GroupDetails";
import Image from "../common/subcomponents/Image";

const GroupCard = ({ group, groupTypeName, defaultImg, userNumbers }) => {
  return (
    <Link
      to={`/k/${groupTypeName}/group/${group.HRID}`}
      className="columns is-gapless group-card-container"
    >
      <div className="column is-8 card groupCard">
        <div className="card-content">
          <div className="group-name">
            <h1 className="title is-size-4">{group.name}</h1>
            <div className="subtitle is-size-6">
              <OnlineStatus
                users={userNumbers ? userNumbers.users : "~"}
                maxSize={userNumbers ? userNumbers.maxSize : ""}
              />
            </div>
          </div>
          <GroupDetails group={group} />
        </div>
      </div>
      <div className="column is-4 group-image card">
        <Image
          figureClass="is-2by1"
          src={group.image ? group.image.link : defaultImg}
        />
      </div>
    </Link>
  );
};

export default GroupCard;
