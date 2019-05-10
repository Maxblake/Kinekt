import React, { Component } from "react";

class GroupCard extends Component {
  render() {
    return (
      <a href="#" className="columns is-gapless groupCardContainer">
        <div className="column is-8 card groupCard">
          <div className="card-content">
            <div className="groupName">
              <h1 className="title is-size-4">{this.props.groupName}</h1>
              <div className="subtitle is-size-6">
                <div className="onlineStatusContainer">
                  <div className="onlineStatusDot" />
                  <h4 className="onlineStatusText">14/20 users</h4>
                </div>
              </div>
            </div>
            <div className="groupDescription">
              <p>
                Here is a brief but informative description of the event. BYOB,
                no squares.
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
        </div>
        <div className="column is-4 groupCardImage">
          <img src={this.props.imgSrc} alt="Placeholder image" />
        </div>
      </a>
    );
  }
}

export default GroupCard;
