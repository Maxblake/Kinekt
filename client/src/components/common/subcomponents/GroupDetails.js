import React from "react";

import moment from "moment";

const GroupDetails = ({ group }) => {
  return (
    <div className="group-details-container">
      <div className="group-description">
        {group.description ? (
          <p>
            <label className="label">Description</label>
            {group.description}
          </p>
        ) : (
          <p>"There is no description available for this group."</p>
        )}
      </div>
      <div className="group-details">
        <div className="group-meet-time">
          <div className="content is-flex">
            <span className="icon">
              <i className="fas fa-clock" />
            </span>
            <h3>{moment(group.time).format("ddd M/D @ h:mm A")}</h3>
          </div>
        </div>
        <div className="group-meet-place">
          <div className="content is-flex">
            <span className="icon">
              <i className="fas fa-map-marker-alt" />
            </span>
            <h3>{group.place}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
