import React from "react";

const GroupMember = ({ status, memberType, memberName }) => {
  const getClassList = (status, memberType) => {
    const classList = ["button", "groupMember"];

    switch (memberType) {
      case "admin":
        classList.push("is-rounded");
        break;
      case "user":
        classList.push("is-user");
        break;
      default:
        classList.push("is-dark-theme");
    }

    switch (status) {
      case "online":
        classList.push("is-online");
        break;
      case "away":
        classList.push("is-away");
        break;
      default:
        classList.push("is-dark-theme");
    }

    return classList.join(" ");
  };

  return <a className={getClassList(status, memberType)}>{memberName}</a>;
};

export default GroupMember;
