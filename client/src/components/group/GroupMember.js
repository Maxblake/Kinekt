import React, { Component } from "react";

class GroupMember extends Component {
  getStatusClass = status => {
    switch (status) {
      case "online":
        return "is-online";
      case "away":
        return "is-away";
      default:
        return "is-dark";
    }
  };

  getTypeClass = memberType => {
    switch (memberType) {
      case "admin":
        return "is-rounded";
      case "user":
        return "is-user";
      default:
        return "is-dark";
    }
  };

  render() {
    const { status, memberType, memberName } = this.props;
    const buttonClasses = ["button", "groupMember"];

    buttonClasses.push(this.getStatusClass(status));
    buttonClasses.push(this.getTypeClass(memberType));

    return <a className={buttonClasses.join(" ")}>{memberName}</a>;
  }
}

export default GroupMember;
