import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { getGroups } from "../../actions/group";
import { setTextAlert } from "../../actions/alert";

import Modal from "../common/subcomponents/Modal";
import Spinner from "../common/Spinner";
import NotFound from "../common/NotFound";
import GroupCard from "../cards/GroupCard";
import PageTitle from "../layout/page/PageTitle";
import OnlineStatus from "../common/subcomponents/OnlineStatus";
import PageOptions from "../layout/page/PageOptions";
import Dropdown from "../common/subcomponents/Dropdown";

import { useInfiniteScroll } from "../../utils/customHooks";

import defaultGroupTypeImage from "../../resources/default_grouptype_image.png";

const GroupType = ({
  history,
  getGroups,
  setTextAlert,
  auth: { user },
  group,
  groupType: { groupType, loading },
  liveData: { groupNumbersMap, groupTypeNumbersMap },
  match
}) => {
  const [groupData, setGroupData] = useState({
    sortBy: "Sort by",
    searchTerms: "",
    readyToLoadNewGroups: true,
    sortDir: "Ascending"
  });

  const { sortBy, searchTerms, readyToLoadNewGroups, sortDir } = groupData;
  const [isFetching, setIsFetching] = useInfiniteScroll(() => getMoreGroups());

  const { groups, error } = group;
  const loadingGroups = group.loading;

  useEffect(() => {
    const groupTypeParamSpaced = match.params.groupType.split("_").join(" ");
    const groupTypeParamChanged =
      groupType && groupType.name !== groupTypeParamSpaced;

    if (
      (!error ||
        error.groupTypeName !== match.params.groupType.split("_").join(" ")) &&
      !loading &&
      !group.loading &&
      (!groupType ||
        groupTypeParamChanged ||
        readyToLoadNewGroups ||
        groups === null)
    ) {
      let queryParams = {
        sortBy: sortBy === "Sort by" ? "New" : sortBy,
        sortDir,
        searchTerms
      };

      if (sortBy === "Nearby" && user && user.currentLocation) {
        queryParams.userLocation = user.currentLocation;
      }

      const seenGroups =
        !groupTypeParamChanged && groups !== null
          ? groups.map(group => group._id)
          : [];

      getGroups(groupTypeParamSpaced, queryParams, seenGroups);

      setGroupData({
        ...groupData,
        readyToLoadNewGroups: false
      });
    }
    if (!group.loading && isFetching) {
      setIsFetching(false);
    }
  }, [
    match.params.groupType,
    readyToLoadNewGroups,
    loading,
    group.loading,
    error,
    groupData
  ]);

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

  const getMoreGroups = () => {
    if (isFetching && !loadingGroups) {
      let queryParams = {
        sortBy: sortBy === "Sort by" ? "New" : sortBy,
        sortDir,
        searchTerms
      };

      if (sortBy === "Nearby" && user && user.currentLocation) {
        queryParams.userLocation = user.currentLocation;
      }

      getGroups(
        groupType.name,
        queryParams,
        groups.map(group => group._id)
      );
    }
  };

  const getTagClassName = groupTypeCategory => {
    const classList = ["tag"];

    switch (groupTypeCategory) {
      case "Social":
        classList.push("category-social");
        break;
      case "Gaming":
        classList.push("category-gaming");
        break;
      case "Educational":
        classList.push("category-educational");
        break;
      case "Professional":
        classList.push("category-professional");
        break;
      case "Hobby":
        classList.push("category-hobby");
        break;
      case "Other":
        classList.push("category-other");
        break;
      default:
        classList.push("is-light");
    }

    return classList.join(" ");
  };

  if (loading || readyToLoadNewGroups) {
    return <Spinner isMidpage />;
  }

  if (
    !groupType ||
    (error &&
      error.groupTypeName === match.params.groupType.split("_").join(" "))
  ) {
    return <NotFound />;
  }

  const options = [
    <div className="field has-addons">
      <div className="control is-expanded">
        <div className="select is-smallish is-fullwidth">
          <select name="sortBy" value={sortBy} onChange={e => onChange(e)}>
            <option disabled defaultValue hidden>
              Sort by
            </option>
            <option>Newest</option>
            <option>Start Time</option>
            <option>Spots left</option>
            <option>Nearby</option>
          </select>
        </div>
      </div>
      <div className="control">
        <div
          className="button is-smallish is-dark"
          type="button"
          onClick={() =>
            setGroupData({
              ...groupData,
              readyToLoadNewGroups: true,
              sortDir: sortDir === "Ascending" ? "Descending" : "Ascending"
            })
          }
        >
          <span className="icon is-small">
            <i
              className={`fas fa-sort-${
                sortDir === "Ascending" ? "up" : "down"
              }`}
            />
          </span>
        </div>
      </div>
    </div>,

    <form onSubmit={e => onSearchTermsSubmit(e)}>
      <div className="field has-addons">
        <p className="control search-control">
          <input
            className="input is-smallish"
            type="text"
            placeholder="Search groups"
            name="searchTerms"
            value={searchTerms}
            onChange={e => onChange(e)}
          />
        </p>
        <p className="control">
          <button className="button is-smallish is-dark" type="submit">
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
              <div
                className="button is-dark is-smallish is-hidden-touch is-hidden-widescreen"
                aria-haspopup="true"
                aria-controls="dropdown-menu"
              >
                <span className="icon is-small">
                  <i className="fas fa-cog" aria-hidden="true" />
                </span>
              </div>

              <div
                className="button is-dark is-smallish is-hidden-desktop-only"
                aria-haspopup="true"
                aria-controls="dropdown-menu"
              >
                <span>Options</span>
                <span className="icon is-small">
                  <i className="fas fa-cog" aria-hidden="true" />
                </span>
              </div>
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
          className="button is-dark is-smallish is-fullwidth-touch is-hidden-desktop"
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
        className="button is-dark is-smallish is-fullwidth-touch is-hidden-desktop"
      >
        <span>Edit Group Type</span>
      </Link>
    );
  } else {
    options.unshift(
      <Fragment>
        <Link
          to={`/k/${match.params.groupType}/create`}
          className="button is-dark is-smallish is-hidden-touch is-hidden-widescreen"
        >
          <span className="icon">
            <i className="fas fa-plus" />
          </span>
        </Link>
        <Link
          to={`/k/${match.params.groupType}/create`}
          className="button is-dark is-smallish is-fullwidth-touch is-hidden-desktop-only"
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
          title={
            <Modal trigger={match.params.groupType.split("_").join(" ")}>
              <div className="hs-box info-modal has-text-left">
                <h3 className="title is-spaced is-size-3 is-size-4-mobile">
                  {match.params.groupType.split("_").join(" ")}
                </h3>
                <div className="content has-text-header">
                  {groupType.description}
                </div>
              </div>
            </Modal>
          }
          subtitle={
            <div className="group-type-subtitle">
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
              <div className={getTagClassName(groupType.category)}>
                {groupType.category}
              </div>
            </div>
          }
          hasPageOptions
        />
        <PageOptions options={options} />
      </nav>

      <div className="groupCards">
        {groups && groups.length > 0 ? (
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
                history={history}
              />
            ))}
          </Fragment>
        ) : (
          !loadingGroups && (
            <div className="hs-box no-card-notice">
              There are currently no groups here. It may be time to make a new
              one!
            </div>
          )
        )}
      </div>
      {loadingGroups && <Spinner />}
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

export default connect(mapStateToProps, { getGroups, setTextAlert })(GroupType);
