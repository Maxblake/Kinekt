import React, { Component } from "react";
import { Link } from "react-router-dom";

class GroupCard extends Component {
  render() {
    const group = this.props.group;
    return (
      <Link
        to={`/k/${this.props.groupTypeName}/group/${group.HRID}`}
        className="columns is-gapless groupCardContainer"
      >
        <div className="column is-8 card groupCard">
          <div className="card-content">
            <div className="groupName">
              <h1 className="title is-size-4">{group.name}</h1>
              <div className="subtitle is-size-6">
                <div className="onlineStatusContainer">
                  <div className="onlineStatusDot" />
                  <h4 className="onlineStatusText">14/20 users</h4>
                </div>
              </div>
            </div>
            <div className="groupDescription">
              <p>{group.description}</p>
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
        </div>
        <div className="column is-4 groupImage imageContainer">
          <img
            src={group.image ? group.image.link : ""}
            alt="Placeholder image"
          />
        </div>
      </Link>
    );
  }
}

export default GroupCard;
