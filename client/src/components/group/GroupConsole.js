import React, { Component } from "react";
import Chat from "../chat/Chat";
import NoticeBoard from "../noticeBoard/NoticeBoard";

class GroupConsole extends Component {
  render() {
    const { group } = this.props;
    return (
      <div className="box flex-row-wrap" id="groupConsole">
        <div className="groupChat">
          <Chat />
        </div>
        <div className="flex-row-wrap">
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

          <div className="groupImage">
            <img
              src={group.image ? group.image.link : this.props.defaultImg}
              alt="Placeholder image"
            />
          </div>
          <NoticeBoard />
        </div>
      </div>
    );
  }
}

export default GroupConsole;
