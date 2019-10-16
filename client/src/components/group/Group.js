import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";

import { getGroup } from "../../actions/group";

import IdleTimer from "react-idle-timer";
import Spinner from "../common/Spinner";
import GroupMembers from "./GroupMembers";
import GroupConsole from "./GroupConsole";
import NotFound from "../common/NotFound";
import PageTitle from "../layout/page/PageTitle";

import defaultGroupTypeImage from "../../resources/default_grouptype_image.png";
import Tooltip from "../common/Tooltip";
import PageOptions from "../layout/page/PageOptions";

const Group = ({
  history,
  getGroup,
  group: { group, loading, error },
  groupType: { groupType },
  auth: { user, isAuthenticated, socket },
  match
}) => {
  const [groupState, setGroupState] = useState({ showCopyHRIDTooltip: false });
  const { showCopyHRIDTooltip } = groupState;

  useEffect(() => {
    if (isAuthenticated && (!group || group.HRID !== match.params.groupCode)) {
      const userCurrentGroupHRID = user.currentGroup
        ? user.currentGroup.HRID
        : "";

      getGroup(
        {
          HRID: match.params.groupCode,
          userCurrentGroupHRID: userCurrentGroupHRID
        },
        history
      );
    }

    socket.on("kickedFromGroup", kickedFromGroup);

    return () => {
      socket.off("kickedFromGroup");
    };
  }, [isAuthenticated, group, match.params.groupCode]);

  const onClickDelete = e => {
    if (window.confirm("Are you sure you would like to delete this group?")) {
      socket.emit("preDeleteGroupActions");
      history.push(`/k/${groupType.name.split(" ").join("_")}`);
    }
  };

  const getGroupImage = () => {
    if (group.image) return group.image.link;
    if (groupType && groupType.image) return groupType.image.link;
    return defaultGroupTypeImage;
  };

  const leaveCurrentGroup = () => {
    socket.emit("leaveCurrentGroup");
    history.push(`/k/${groupType.name.split(" ").join("_")}`);
  };

  const kickFromGroup = userId => {
    socket.emit("kickFromGroup", { userId });
  };

  const kickedFromGroup = kickedUser => {
    if (!kickedUser.allUsers && kickedUser.userId !== user._id) return;
    history.push(`/k/${groupType.name.split(" ").join("_")}`);
  };

  const toggleGroupAdmin = userId => {
    socket.emit("toggleGroupAdmin", userId);
  };

  const banFromGroup = userId => {
    if (
      window.confirm(
        "Are you sure you would like to ban this user? This cannot be undone."
      )
    ) {
      socket.emit("kickFromGroup", { userId, isBanned: true });
    }
  };

  const setUserStatus = userStatus => {
    socket.emit("setUserStatus", userStatus);
  };

  const copyHRIDToClipboard = e => {
    var tempInputEl = document.createElement("input");
    document.body.appendChild(tempInputEl);
    tempInputEl.setAttribute("value", group.HRID);
    tempInputEl.select();
    document.execCommand("copy");
    document.body.removeChild(tempInputEl);
    setGroupState({ ...groupState, showCopyHRIDTooltip: true });
  };

  if (loading) {
    return <Spinner isMidpage />;
  }

  if (
    !group ||
    !groupType ||
    (error && error.HRID === match.params.groupCode)
  ) {
    console.log({ group, groupType });
    return <NotFound />;
  }

  const groupTypeNameSnaked = groupType.name.split(" ").join("_");
  if (groupTypeNameSnaked !== match.params.groupType) {
    return (
      <Redirect
        to={`/k/${groupTypeNameSnaked}/group/${match.params.groupCode}`}
      />
    );
  }

  let isCurrentUserAdmin = false;

  if (group.users) {
    const currentUser = group.users.filter(groupUser => {
      return groupUser._id === user._id;
    })[0];

    if (currentUser && currentUser.memberType === "admin") {
      isCurrentUserAdmin = true;
    }
  }

  const adminOptions = isCurrentUserAdmin
    ? {
        currentUser: user,
        groupCreator: group.creator,
        kickFromGroup,
        banFromGroup,
        toggleGroupAdmin
      }
    : null;

  const pageOptions = [];

  if (isCurrentUserAdmin) {
    pageOptions.unshift(
      <Link
        to={`/k/${groupTypeNameSnaked}/group/${group.HRID}/edit`}
        className="button is-dark is-fullwidth-touch"
      >
        <span>Edit</span>
        <span className="icon is-small">
          <i className="fas fa-edit" aria-hidden="true" />
        </span>
      </Link>
    );
  }

  if (user._id === group.creator) {
    pageOptions.unshift(
      <button
        className="button is-danger is-fullwidth-touch"
        onClick={e => onClickDelete(e)}
      >
        <span>Delete</span>
        <span className="icon is-small">
          <i className="fas fa-trash-alt" aria-hidden="true" />
        </span>
      </button>
    );
  } else {
    pageOptions.unshift(
      <button
        className="button is-dark is-fullwidth-touch"
        onClick={() => leaveCurrentGroup()}
      >
        <span>Leave group</span>
        <span className="icon is-small">
          <i className="fas fa-sign-out-alt" aria-hidden="true" />
        </span>
      </button>
    );
  }

  if (document.queryCommandSupported("copy")) {
    pageOptions.push(
      <button
        className="button is-primary is-fullwidth-touch"
        onClick={() => copyHRIDToClipboard()}
      >
        <Tooltip
          body="Group code copied to clipboard"
          isVisible={showCopyHRIDTooltip}
          setIsVisible={isVisible =>
            setGroupState({
              ...groupState,
              showCopyHRIDTooltip: isVisible
            })
          }
        />
        <span>{group.HRID}</span>
        <span className="icon">
          <i className="fas fa-link"></i>
        </span>
      </button>
    );
  }

  return (
    <section className="group">
      <nav className="level" id="page-nav">
        <PageTitle
          title={group.name}
          subtitle={
            <Link to={`/k/${groupTypeNameSnaked}`}>{groupType.name}</Link>
          }
          hasPageOptions
        />
        <PageOptions options={pageOptions} />
      </nav>
      <GroupMembers
        users={group.users}
        maxSize={group.maxSize}
        adminOptions={adminOptions}
      />
      <GroupConsole
        user={user}
        isCurrentUserAdmin={isCurrentUserAdmin}
        group={group}
        imgSrc={getGroupImage()}
      />
      <IdleTimer
        element={document}
        onAction={() => setUserStatus("active")}
        throttle={1000 * 20}
      />
    </section>
  );
};

Group.propTypes = {
  getGroup: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
  groupType: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  group: state.group,
  groupType: state.groupType
});

export default connect(
  mapStateToProps,
  { getGroup }
)(Group);
