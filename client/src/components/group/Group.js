import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { getGroup, deleteGroup } from "../../actions/group";

import Spinner from "../common/Spinner";
import GroupMembers from "./GroupMembers";
import GroupConsole from "./GroupConsole";
import NotFound from "../common/NotFound";

import defaultGroupTypeImage from "../../resources/defaultGroupTypeImage.jpg";

const Group = ({
  getGroup,
  deleteGroup,
  group: { group, loading, error },
  groupType: { groupType },
  isAuthenticated,
  match
}) => {
  let grpSettingsBtn, grpSettingsDropDown;

  useEffect(() => {
    if (
      isAuthenticated &&
      (!group || (group && group.HRID !== match.params.groupCode))
    ) {
      getGroup(match.params.groupCode);
    } else {
      grpSettingsBtn = document.querySelector("#grpSettingsBtn");
      grpSettingsDropDown = document.querySelector(".dropdown");

      document.addEventListener("click", handleToggleGrpSettings);
    }

    return () => {
      document.removeEventListener("click", handleToggleGrpSettings);
    };
  }, [isAuthenticated, group, match.params.groupCode]);

  const handleToggleGrpSettings = e => {
    const clickedGrpSettingsBtn = grpSettingsBtn.contains(e.target);
    const grpSettingsDropDownActive = grpSettingsDropDown.classList.contains(
      "is-active"
    );

    if (grpSettingsDropDownActive) {
      grpSettingsDropDown.classList.remove("is-active");
    } else if (clickedGrpSettingsBtn) {
      grpSettingsDropDown.classList.add("is-active");
    }
  };

  const onClickDelete = e => {
    deleteGroup();
  };

  const getGroupImage = () => {
    if (group.image) return group.image.link;
    if (groupType && groupType.image) return groupType.image.link;
    return defaultGroupTypeImage;
  };

  if (!loading && error.HRID === match.params.groupCode) {
    return <NotFound />;
  }

  if (!group || (group && group.HRID !== match.params.groupCode)) {
    return <Spinner />;
  }

  return (
    <section className="group">
      <nav className="level is-mobile" id="pageNav">
        <div className="level-left">
          <div className="level-item">
            <div className="groupTypeTitleContainer">
              <Link
                to={`/k/${match.params.groupType}`}
                className="subtitle is-size-6 groupTypeSubtitleContainer"
              >
                {match.params.groupType.split("_").join(" ")}
              </Link>
              <h3 className="title is-size-3 pageTitle" id="groupPageTitle">
                {group.name}
              </h3>
            </div>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <div class="dropdown is-right">
              <div class="dropdown-trigger">
                <button
                  class="button is-black"
                  id="grpSettingsBtn"
                  aria-haspopup="true"
                  aria-controls="dropdown-menu"
                >
                  <span>Settings</span>
                  <span class="icon is-small">
                    <i class="fas fa-cog" aria-hidden="true" />
                  </span>
                </button>
              </div>
              <div class="dropdown-menu" id="dropdown-menu" role="menu">
                <div class="dropdown-content">
                  <a href="#" class="dropdown-item">
                    Edit Details
                  </a>
                  <a href="#" class="dropdown-item">
                    Manage Admins
                  </a>
                  <hr class="dropdown-divider" />
                  <a
                    href="#"
                    class="dropdown-item"
                    onClick={e => onClickDelete(e)}
                  >
                    Delete Group
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <GroupConsole group={group} imgSrc={getGroupImage()} />
      <GroupMembers />
    </section>
  );
};

Group.propTypes = {
  getGroup: PropTypes.func.isRequired,
  deleteGroup: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  group: PropTypes.object.isRequired,
  groupType: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  group: state.group,
  groupType: state.groupType
});

export default connect(
  mapStateToProps,
  { getGroup, deleteGroup }
)(Group);
