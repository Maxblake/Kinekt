import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { getGroups } from "../../actions/group";
import { setTextAlert } from "../../actions/alert";

import Spinner from "../common/Spinner";
import NotFound from "../common/NotFound";
import GroupCard from "../cards/GroupCard";
import PageTitle from "../layout/page/PageTitle";
import OnlineStatus from "../common/subcomponents/OnlineStatus";
import PageOptions from "../layout/page/PageOptions";
import Dropdown from "../common/subcomponents/Dropdown";

import defaultGroupTypeImage from "../../resources/default_grouptype_image.jpg";

//TODO format date/times with moment
const GroupType = ({
  getGroups,
  setTextAlert,
  auth: { user },
  group: { groups, loading, error },
  groupType: { groupType },
  liveData: { groupNumbersMap, groupTypeNumbersMap },
  match
}) => {
  const [groupData, setGroupData] = useState({
    sortBy: "New",
    searchTerms: "",
    readyToLoadNewGroups: false
  });

  const { sortBy, searchTerms, readyToLoadNewGroups } = groupData;

  useEffect(() => {
    const groupTypeParamSpaced = match.params.groupType.split("_").join(" ");
    const groupTypeParamChanged =
      groupType && groupType.name !== groupTypeParamSpaced;

    if (
      !groupType ||
      groupTypeParamChanged ||
      !groups.length ||
      readyToLoadNewGroups
    ) {
      let queryParams = {
        sortBy,
        searchTerms
      };

      if (sortBy === "Nearby" && user && user.currentLocation) {
        queryParams.userLocation = user.currentLocation;
      }

      getGroups(groupTypeParamSpaced, queryParams);

      setGroupData({
        ...groupData,
        readyToLoadNewGroups: false
      });
    }
  }, [match.params.groupType, readyToLoadNewGroups]);

  const onChange = e => {
    if (
      e.target.name === "sortBy" &&
      e.target.value === "Nearby" &&
      (!user || !user.currentLocation)
    ) {
      if (!user) {
        setTextAlert(
          "You must log in and specify a location to search from in order to find nearby groups",
          "is-warning"
        );
      } else if (!user.currentLocation) {
        setTextAlert(
          "You must specify a location to search from in your account settings in order to find nearby groups",
          "is-warning"
        );
      }
    }

    setGroupData({
      ...groupData,
      [e.target.name]: e.target.value,
      readyToLoadNewGroups:
        e.target.name === "searchTerms" ? readyToLoadNewGroups : true
    });
  };

  const onSearchTermsSubmit = e => {
    e.preventDefault();

    setGroupData({
      ...groupData,
      readyToLoadNewGroups: true
    });
  };

  if (loading) {
    return <Spinner />;
  }

  if (
    !groupType ||
    (error &&
      error.groupTypeName === match.params.groupType.split("_").join(" "))
  ) {
    return <NotFound />;
  }

  const options = [
    <div className="field">
      <div className="select is-fullwidth-touch">
        <select
          className="is-fullwidth-touch"
          name="sortBy"
          value={sortBy}
          onChange={e => onChange(e)}
        >
          <option>New</option>
          <option>Start Time</option>
          <option>Spots left</option>
          <option>Nearby</option>
        </select>
      </div>
    </div>,
    <form onSubmit={e => onSearchTermsSubmit(e)}>
      <div className="field has-addons">
        <p className="control search-control">
          <input
            className="input"
            type="text"
            placeholder="Search groups"
            name="searchTerms"
            value={searchTerms}
            onChange={e => onChange(e)}
          />
        </p>
        <p className="control">
          <button className="button is-primary" type="submit">
            <span className="icon is-small">
              <i className="fas fa-search" />
            </span>
          </button>
        </p>
      </div>
    </form>
  ];

  if (!!user && user._id === groupType.creator) {
    options.unshift(
      <Fragment>
        <Dropdown
          additionalClasses="is-hidden-touch"
          trigger={
            <Fragment>
              <button
                className="button is-dark-theme is-hidden-touch is-hidden-widescreen"
                aria-haspopup="true"
                aria-controls="dropdown-menu"
              >
                <span className="icon is-small">
                  <i className="fas fa-cog" aria-hidden="true" />
                </span>
              </button>

              <button
                className="button is-dark-theme is-hidden-desktop-only"
                aria-haspopup="true"
                aria-controls="dropdown-menu"
              >
                <span>Options</span>
                <span className="icon is-small">
                  <i className="fas fa-cog" aria-hidden="true" />
                </span>
              </button>
            </Fragment>
          }
        >
          <Link
            to={`/k/${match.params.groupType}/create`}
            className="dropdown-item"
          >
            <span>New Group</span>
          </Link>
          <Link
            to={`/k/${match.params.groupType}/edit`}
            className="dropdown-item"
          >
            <span>Edit Group Type</span>
          </Link>
        </Dropdown>
        <Link
          to={`/k/${match.params.groupType}/create`}
          className="button is-primary is-fullwidth-touch is-hidden-desktop"
        >
          <span className="icon">
            <i className="fas fa-plus" />
          </span>
          <span>New Group</span>
        </Link>
      </Fragment>
    );

    options.unshift(
      <Link
        to={`/k/${match.params.groupType}/edit`}
        className="button is-primary is-fullwidth-touch is-hidden-desktop"
      >
        <span>Edit Group Type</span>
      </Link>
    );
  } else {
    options.unshift(
      <Fragment>
        <Link
          to={`/k/${match.params.groupType}/create`}
          className="button is-primary  is-hidden-touch is-hidden-widescreen"
        >
          <span className="icon">
            <i className="fas fa-plus" />
          </span>
        </Link>
        <Link
          to={`/k/${match.params.groupType}/create`}
          className="button is-primary is-fullwidth-touch is-hidden-desktop-only"
        >
          <span className="icon">
            <i className="fas fa-plus" />
          </span>
          <span>New Group</span>
        </Link>
      </Fragment>
    );
  }

  return (
    <section className="groupType">
      <nav className="level" id="page-nav">
        <PageTitle
          title={match.params.groupType.split("_").join(" ")}
          subtitle={
            <OnlineStatus
              users={
                groupTypeNumbersMap[groupType._id]
                  ? groupTypeNumbersMap[groupType._id].users
                  : ""
              }
              groups={
                groupTypeNumbersMap[groupType._id]
                  ? groupTypeNumbersMap[groupType._id].groups
                  : ""
              }
            />
          }
          hasPageOptions
        />
        <PageOptions options={options} />
      </nav>

      <div className="groupCards">
        {!!groups.length ? (
          <Fragment>
            {groups.map(group => (
              <GroupCard
                key={group._id}
                group={group}
                defaultImg={
                  groupType.image ? groupType.image.link : defaultGroupTypeImage
                }
                groupTypeName={match.params.groupType}
                userNumbers={groupNumbersMap[group._id]}
                isBanned={
                  user &&
                  group.bannedUsers &&
                  group.bannedUsers.includes(user._id)
                }
                isMember={
                  user &&
                  group.users &&
                  group.users.find(groupUser => groupUser.id === user._id)
                }
              />
            ))}
            <div className="content has-text-centered">
              <h3>- This is the end. -</h3>
            </div>
          </Fragment>
        ) : (
          <div className="box no-card-notice">
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
  setTextAlert: PropTypes.func.isRequired,
  groupType: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
  liveData: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  groupType: state.groupType,
  group: state.group,
  liveData: state.liveData
});

export default connect(
  mapStateToProps,
  { getGroups, setTextAlert }
)(GroupType);
