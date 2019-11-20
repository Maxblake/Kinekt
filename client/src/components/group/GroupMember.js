import React from "react";
import Modal from "../common/subcomponents/Modal";
import UserInfo from "../user/UserInfo";

const GroupMember = ({ user, adminOptions }) => {
  const getClassName = (status, memberType) => {
    const classList = ["button", "group-member"];

    switch (memberType) {
      case "admin":
        break;
      case "user":
      default:
        classList.push("is-user", "is-rounded");
        break;
    }

    switch (status) {
      case "active":
        classList.push("is-online");
        break;
      case "idle":
      default:
        classList.push("is-away");
        break;
    }

    return classList.join(" ");
  };

  return (
    <Modal
      trigger={
        <div className={getClassName(user.status, user.memberType)}>
          {user.name}
        </div>
      }
    >
      <UserInfo user={user} adminOptions={adminOptions} />
    </Modal>
  );
};

export default GroupMember;
