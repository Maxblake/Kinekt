import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { getGroup, deleteGroup } from "../../actions/group";

import Spinner from "../common/Spinner";
import GroupMembers from "./GroupMembers";
import GroupConsole from "./GroupConsole";
import NotFound from "../common/NotFound";
import PageTitle from "../layout/page/PageTitle";
import Dropdown from "../common/subcomponents/Dropdown";

import defaultGroupTypeImage from "../../resources/defaultGroupTypeImage.jpg";

const Group = ({
  getGroup,
  deleteGroup,
  group: { group, loading, error },
  groupType: { groupType },
  auth: { user, isAuthenticated },
  match
}) => {
  useEffect(() => {
    if (isAuthenticated && (!group || group.HRID !== match.params.groupCode)) {
      console.log(1, isAuthenticated);
      console.log(2, !!group);
      if (group) {
        console.log(3, group.HRID !== match.params.groupCode);
      }
      getGroup(match.params.groupCode);
    }
  }, [isAuthenticated, group, match.params.groupCode]);

  const onClickDelete = e => {
    deleteGroup();
  };

  const getGroupImage = () => {
    if (group.image) return group.image.link;
    if (groupType && groupType.image) return groupType.image.link;
    return defaultGroupTypeImage;
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
        {user._id === group.creator && (
          <div className="level-right">
            <div className="level-item">
              <Dropdown
                trigger={
                  <button
                    className="button is-dark-theme"
                    id="grpSettingsBtn"
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
            </div>
          </div>
        )}
      </nav>
      <GroupConsole group={group} imgSrc={getGroupImage()} />
      <GroupMembers />
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
