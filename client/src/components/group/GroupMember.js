import React, { Component } from "react";

class GroupMember extends Component {
  render() {
    return (
      <a className="button is-white is-outlined is-rounded groupMember">
        {this.props.memberName}
      </a>
    );
  }
}

export default GroupMember;
