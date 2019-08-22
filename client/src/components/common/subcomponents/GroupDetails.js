import React from "react";

const GroupDetails = ({ group }) => {
  return (
    <div className="groupDetailsContainer">
      <div className="groupDescription">
        <p>
          {group && group.description
            ? group.description
            : "There is no description available for this group."}
        </p>
      </div>
      <div className="groupDetails">
        <div className="groupMeetTime">
          <div className="content is-flex">
            <span class="icon">
              <i class="fas fa-clock" />
            </span>
            <h3>Thu, May 17, 2:00 PM</h3>
          </div>
        </div>
        <div className="groupMeetPlace">
          <div className="content is-flex">
            <span class="icon">
              <i class="fas fa-map-marker-alt" />
            </span>
            <h3>Crooked river Brewery, Prineville OR</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
