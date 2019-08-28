import React from "react";

const GroupDetails = ({ group }) => {
  return (
    <div className="group-details-container">
      <div className="group-description">
        {group && group.description ? (
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
            <h3>Thu, May 17, 2:00 PM</h3>
          </div>
        </div>
        <div className="group-meet-place">
          <div className="content is-flex">
            <span className="icon">
              <i className="fas fa-map-marker-alt" />
            </span>
            <h3>Crooked river Brewery, Prineville OR</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
