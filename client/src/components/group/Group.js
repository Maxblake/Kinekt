import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect, Link, withRouter } from "react-router-dom";

import { getGroup, deleteGroup } from "../../actions/group";

import Spinner from "../common/Spinner";
import GroupMembers from "./GroupMembers";
import GroupConsole from "./GroupConsole";
import NotFound from "../common/NotFound";
import PageTitle from "../layout/page/PageTitle";
import Dropdown from "../common/subcomponents/Dropdown";

import defaultGroupTypeImage from "../../resources/default_grouptype_image.jpg";

const Group = ({
  history,
  getGroup,
  deleteGroup,
  group: { group, loading, error },
  groupType: { groupType },
  auth: { user, isAuthenticated, socket },
  match
}) => {
  useEffect(() => {
    if (isAuthenticated && (!group || group.HRID !== match.params.groupCode)) {
      getGroup(match.params.groupCode);
    }

    socket.on("kickedFromGroup", kickedFromGroup);

    return () => {
      socket.off("kickedFromGroup");
    };
  }, [isAuthenticated, group, match.params.groupCode]);

  const onClickDelete = e => {
    deleteGroup();
  };

  const getGroupImage = () => {
    if (group.image) return group.image.link;
    if (groupType && groupType.image) return groupType.image.link;
    return defaultGroupTypeImage;
  };

  const leaveGroup = () => {
    socket.emit("leaveGroup", { groupId: group._id, isKicked: false });
    history.push(`/k/${groupType.name.split(" ").join("_")}`);
  };

  const kickFromGroup = userId => {
    socket.emit("kickFromGroup", { userId });
  };

  const kickedFromGroup = kickedUser => {
    if (!kickedUser.allUsers && kickedUser.userId !== user._id) return;
    history.push(`/k/${groupType.name.split(" ").join("_")}`);
  };

  if (loading) {
    return <Spinner />;
  }

  if (
    !group ||
    !groupType ||
    (error && error.HRID === match.params.groupCode)
  ) {
    return <NotFound />;
  }

  const groupTypeNameSnaked = groupType.name.split(" ").join("_");
  if (groupTypeNameSnaked !== match.params.groupType) {
    return <Redirect to={`/k/${groupTypeNameSnaked}/group/${group.HRID}`} />;
  }

  return (
    <section className="group">
      <nav className="level" id="page-nav">
        <PageTitle
          title={group.name}
          subtitle={
            <Link to={`/k/${groupType.name.split(" ").join("_")}`}>
              {groupType.name}
            </Link>
          }
        />
        <div className="level-right">
          <div className="level-item">
            {user._id === group.creator ? (
              <Dropdown
                trigger={
                  <button
                    className="button is-dark-theme"
                    aria-haspopup="true"
                    aria-controls="dropdown-menu"
                  >
                    <span>Filter</span>
                    <span className="icon is-small">
                      <i className="fas fa-cog" aria-hidden="true" />
                    </span>
                  </button>
                }
              >
                <a href="#" className="dropdown-item">
                  Edit Details
                </a>
                <a href="#" className="dropdown-item">
                  Manage Admins
                </a>
                <hr className="dropdown-divider" />
                <a
                  href="#"
                  className="dropdown-item"
                  onClick={e => onClickDelete(e)}
                >
                  Delete Group
                </a>
              </Dropdown>
            ) : (
              <button
                className="button is-dark-theme"
                onClick={() => leaveGroup()}
              >
                <span>Leave group</span>
                <span className="icon is-small">
                  <i className="fas fa-sign-out-alt" aria-hidden="true" />
                </span>
              </button>
            )}
          </div>
        </div>
      </nav>
      <GroupConsole group={group} imgSrc={getGroupImage()} />
      <GroupMembers
        users={group.users}
        maxSize={group.maxSize}
        adminOptions={{
          currentUser: user,
          kickFromGroup
        }}
      />
    </section>
  );
};

Group.propTypes = {
  getGroup: PropTypes.func.isRequired,
  deleteGroup: PropTypes.func.isRequired,
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
  { getGroup, deleteGroup }
)(Group);
