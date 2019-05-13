import React, { Component } from "react";
import GroupMembers from "./GroupMembers";
import Group from "./Group";

class GroupPage extends Component {
  render() {
    return (
      <section className="groupPage">
        <nav className="level is-mobile" id="pageNav">
          <div className="level-left">
            <div className="level-item">
              <div className="groupTypeTitleContainer">
                <div className="subtitle is-size-6 onlineStatusContainer">
                  {this.props.match.params.groupType}
                </div>
                <h3 className="title is-size-3 pageTitle" id="groupPageTitle">
                  Breakfast Taco Party at my Place
                </h3>
              </div>
            </div>
          </div>
        </nav>
        <GroupMembers />
        <Group />
      </section>
    );
  }
}

export default GroupPage;
