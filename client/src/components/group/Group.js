import React, { Component } from "react";
import GroupMembers from "./GroupMembers";

class Group extends Component {
  render() {
    return (
      <div className="box" id="groupContainer">
        <div className="groupChat">chat</div>
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

        <div className="groupImage">
          <img src={this.props.imgSrc} alt="Placeholder image" />
        </div>
        <div className="noticeBoard">notice</div>
      </div>
    );
  }
}

export default Group;
