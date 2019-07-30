import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import GroupMembers from "./GroupMembers";
import GroupConsole from "./GroupConsole";
import { getGroup } from "../../actions/group";

const Group = props => {
  const { getGroup, auth, group } = props;

  useEffect(() => {
    getGroup(props.match.params.groupCode);
  }, []);

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
                Breakfast Taco Party at my Place
              </h3>
            </div>
          </div>
        </div>
      </nav>
      <GroupConsole />
      <GroupMembers />
    </section>
  );
};

Group.propTypes = {
  getGroup: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  group: state.group
});

export default connect(
  mapStateToProps,
  { getGroup }
)(Group);
