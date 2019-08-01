import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import GroupMembers from "./GroupMembers";
import GroupConsole from "./GroupConsole";
import { getGroup } from "../../actions/group";

const Group = props => {
  const {
    getGroup,
    auth,
    group: { group, loading }
  } = props;

  useEffect(() => {
    getGroup(props.match.params.groupCode);
  }, []);

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
      </nav>
      <GroupConsole group={group} />
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
