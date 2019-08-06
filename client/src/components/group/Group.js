import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import GroupMembers from "./GroupMembers";
import GroupConsole from "./GroupConsole";
import { getGroup, deleteGroup } from "../../actions/group";

const Group = props => {
  const {
    getGroup,
    deleteGroup,
    auth,
    group: { group, loading }
  } = props;

  var grpSettingsBtn, grpSettingsDropDown;

  useEffect(() => {
    if (!group || (group && group.HRID !== props.match.params.groupCode)) {
      getGroup(props.match.params.groupCode);
    } else {
      grpSettingsBtn = document.querySelector("#grpSettingsBtn");
      grpSettingsDropDown = document.querySelector(".dropdown");

      //TODO  Move this elsewhere if useEffect ever gets called more than once
      document.addEventListener("click", handleToggleGrpSettings);
    }

    return () => {
      // Remove on unmount
      document.removeEventListener("click", handleToggleGrpSettings);
    };
  }, [group, props.match.params.groupCode]);

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

  if (loading) {
    return <Spinner />;
  }

  if (group === null) {
    return <div>Page not found</div>;
  }

  return (
    <section className="group">
      <nav className="level is-mobile" id="pageNav">
        <div className="level-left">
          <div className="level-item">
            <div className="groupTypeTitleContainer">
              <div className="subtitle is-size-6 groupTypeSubtitleContainer">
                {props.match.params.groupType}
              </div>
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
      <GroupConsole group={group} />
      <GroupMembers />
    </section>
  );
};

Group.propTypes = {
  getGroup: PropTypes.func.isRequired,
  deleteGroup: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  group: state.group
});

export default connect(
  mapStateToProps,
  { getGroup, deleteGroup }
)(Group);
