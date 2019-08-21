import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { getGroups } from "../../actions/group";

import Spinner from "../common/Spinner";
import NotFound from "../common/NotFound";
import GroupCard from "../cards/GroupCard";

import defaultGroupTypeImage from "../../resources/defaultGroupTypeImage.jpg";

//TODO format date/times with moment
const GroupType = ({
  getGroups,
  group: { groups, loading, error },
  groupType: { groupType },
  match
}) => {
  useEffect(() => {
    const groupTypeParamSpaced = match.params.groupType.split("_").join(" ");
    const groupTypeParamChanged =
      groupType && groupType.name !== groupTypeParamSpaced;
    if (!groupType || groupTypeParamChanged) {
      getGroups(groupTypeParamSpaced);
    }
  }, [match.params.groupType]);

  if (
    !loading &&
    error.groupTypeName === match.params.groupType.split("_").join(" ")
  ) {
    return <NotFound />;
  }

  if (
    !groupType ||
    (groupType &&
      groupType.name !== match.params.groupType.split("_").join(" "))
  ) {
    return <Spinner />;
  }

  return (
    <section className="groupType">
      <nav className="level" id="pageNav">
        <div className="level-left">
          <div className="level-item">
            <div className="groupTypeTitleContainer">
              <h3 className="title is-size-3 pageTitle">
                {match.params.groupType.split("_").join(" ")}
              </h3>
              <div>
                <div className="subtitle is-size-6 onlineStatusContainer">
                  <div className="onlineStatusDot" />
                  <h4 className="onlineStatusText">3 groups</h4>
                  <div className="onlineStatusDot" />
                  <h4 className="onlineStatusText">14 users</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="level-right">
          <div className="level-item">
            <div className="level-item">
              <Link
                to={`/k/${match.params.groupType}/create`}
                className="button is-primary"
              >
                <span className="icon">
                  <i className="fas fa-plus" />
                </span>
                <span>New Group</span>
              </Link>
            </div>
            <div className="field">
              <div className="select">
                <select>
                  <option>Trending</option>
                  <option>Top</option>
                  <option>New</option>
                  <option>Nearby</option>
                </select>
              </div>
            </div>
          </div>
          <div className="level-item">
            <div className="field has-addons">
              <p className="control" id="controlSearchGroups">
                <input
                  className="input"
                  type="text"
                  placeholder="Search groups"
                />
              </p>
              <p className="control">
                <button className="button is-primary">
                  <span className="icon is-small">
                    <i className="fas fa-search" />
                  </span>
                </button>
              </p>
            </div>
          </div>
        </div>
      </nav>

      <div className="groupCards">
        {groups.map(group => (
          <GroupCard
            key={group._id}
            group={group}
            defaultImg={
              groupType.image ? groupType.image.link : defaultGroupTypeImage
            }
            groupTypeName={match.params.groupType}
          />
        ))}
        {!!groups.length ? (
          <div className="content has-text-centered">
            <h3>- This is the end. -</h3>
          </div>
        ) : (
          <div className="box is-size-5 has-text-centered has-margin-top-2">
            There are currently no groups here. It may be time to make a new
            one!
          </div>
        )}
      </div>
    </section>
  );
};

GroupType.propTypes = {
  getGroups: PropTypes.func.isRequired,
  groupType: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  groupType: state.groupType,
  group: state.group
});

export default connect(
  mapStateToProps,
  { getGroups }
)(GroupType);
