import React, { Component } from "react";
import GroupCard from "../cards/GroupCard";

class GroupType extends Component {
  render() {
    return (
      <section className="groupType">
        <nav className="level" id="pageNav">
          <div className="level-left">
            <div className="level-item">
              <div className="groupTypeTitleContainer">
                <h3 className="title is-size-3 pageTitle">
                  {this.props.match.params.groupType}
                </h3>
                <div>
                  <div className="subtitle is-size-6 onlineStatusContainer">
                    <div className="onlineStatusDot" />
                    <h4 className="onlineStatusText">3 groups</h4>
                    <div className="onlineStatusDot" />
                    <h4 className="onlineStatusText">14 users</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="level-right box">
            <div className="level-item">
              <div className="level-item">
                <a className="button is-primary">
                  <span className="icon">
                    <i className="fas fa-plus" />
                  </span>
                  <span>New Group</span>
                </a>
              </div>
              <div className="field">
                <div className="select">
                  <select>
                    <option>Trending</option>
                    <option>Top</option>
                    <option>New</option>
                    <option>Nearby</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="level-item">
              <div className="field has-addons">
                <p className="control" id="controlSearchGroups">
                  <input
                    className="input"
                    type="text"
                    placeholder="Search groups"
                  />
                </p>
                <p className="control">
                  <button className="button is-primary">
                    <span className="icon is-small">
                      <i className="fas fa-search" />
                    </span>
                  </button>
                </p>
              </div>
            </div>
          </div>
        </nav>

        <div className="groupCards">
          <GroupCard
            imgSrc="https://source.unsplash.com/random/640x320"
            groupName="Grant HS Chess club"
          />
          <GroupCard
            imgSrc="https://source.unsplash.com/random/640x320"
            groupName="Chess in the park"
          />
          <GroupCard
            imgSrc="https://source.unsplash.com/random/640x320"
            groupName="Online chess"
          />
          <GroupCard
            imgSrc="https://source.unsplash.com/random/640x320"
            groupName="Chess tutoring and whatever I don't care I'm just lonely and bored"
          />
          <GroupCard
            imgSrc="https://source.unsplash.com/random/640x320"
            groupName="OCC Chess club"
          />
        </div>
      </section>
    );
  }
}

export default GroupType;
