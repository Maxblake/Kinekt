import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { getGroupTypes } from "../../actions/groupType";

import Spinner from "../common/Spinner";
import GroupTypeCard from "../cards/GroupTypeCard";
import PageTitle from "../layout/page/PageTitle";
import PageOptions from "../layout/page/PageOptions";

import { useInfiniteScroll } from "../../utils/customHooks";

const Discover = ({
  getGroupTypes,
  groupType: { groupTypes, loading },
  isAuthenticated,
  groupTypeNumbersMap
}) => {
  const [groupTypeData, setgroupTypeData] = useState({
    category: "All",
    searchTerms: "",
    lastSubmittedSearchTerms: "",
    readyToLoadNewTypes: true
  });
  const {
    category,
    searchTerms,
    lastSubmittedSearchTerms,
    readyToLoadNewTypes
  } = groupTypeData;

  const [isFetching, setIsFetching] = useInfiniteScroll(() =>
    getMoreGroupTypes()
  );

  useEffect(() => {
    if (readyToLoadNewTypes) {
      getGroupTypes(groupTypeData);

      setgroupTypeData({
        ...groupTypeData,
        lastSubmittedSearchTerms: searchTerms,
        readyToLoadNewTypes: false
      });
    }
    if (!loading && isFetching) {
      setIsFetching(false);
    }
  }, [readyToLoadNewTypes, loading]);

  const onChange = e => {
    setgroupTypeData({
      ...groupTypeData,
      [e.target.name]: e.target.value,
      readyToLoadNewTypes:
        e.target.name === "searchTerms" ? readyToLoadNewTypes : true
    });
  };

  const onSearchTermsSubmit = e => {
    e.preventDefault();

    setgroupTypeData({
      ...groupTypeData,
      readyToLoadNewTypes: true
    });
  };

  const getMoreGroupTypes = () => {
    if (isFetching && !loading) {
      getGroupTypes(
        { ...groupTypeData, searchTerms: lastSubmittedSearchTerms },
        groupTypes.map(groupType => groupType._id)
      );
    }
  };

  let groupTypeCards;

  if (!groupTypes.length) {
    groupTypeCards = (
      <div className="hs-box no-card-notice">
        There are currently no group types here. It may be time to request a new
        one!
      </div>
    );
  } else {
    groupTypeCards = (
      <div className="group-type-cards">
        {groupTypes.map(groupType => (
          <GroupTypeCard
            key={groupType._id}
            imgSrc={groupType.image ? groupType.image.link : ""}
            name={groupType.name}
            groupTypeCategory={
              groupType.category ? groupType.category : "Other"
            }
            groupAndUserNumbers={groupTypeNumbersMap[groupType._id]}
          />
        ))}
      </div>
    );
  }

  const options = [
    <div className="field">
      <div className="select is-fullwidth-touch">
        <select
          className="is-fullwidth-touch"
          name="category"
          value={category}
          onChange={e => onChange(e)}
        >
          <option>All</option>
          <option>Social</option>
          <option>Gaming</option>
          <option>Educational</option>
          <option>Professional</option>
          <option>Hobby</option>
          <option>Other</option>
        </select>
      </div>
    </div>,
    <form onSubmit={e => onSearchTermsSubmit(e)}>
      <div className="field has-addons">
        <p className="control search-control">
          <input
            className="input"
            type="text"
            placeholder="Search group types"
            name="searchTerms"
            value={searchTerms}
            onChange={e => onChange(e)}
          />
        </p>
        <p className="control">
          <button className="button is-dark" type="submit">
            <span className="icon is-small">
              <i className="fas fa-search" />
            </span>
          </button>
        </p>
      </div>
    </form>
  ];

  if (isAuthenticated) {
    options.unshift(
      <Fragment>
        <Link
          to="/request-grouptype"
          className="button is-dark is-hidden-touch is-hidden-widescreen"
        >
          <span className="icon">
            <i className="fas fa-plus" />
          </span>
        </Link>
        <Link
          to="/request-grouptype"
          className="button is-dark is-fullwidth-touch is-hidden-desktop-only"
        >
          <span className="icon">
            <i className="fas fa-plus" />
          </span>
          <span>New Group Type</span>
        </Link>
      </Fragment>
    );
  }

  return (
    <section className="discover">
      <nav className="level is-mobile" id="page-nav">
        <PageTitle title="Explore" hasPageOptions />
        <PageOptions options={options} />
      </nav>
      {groupTypeCards}
      {loading && <Spinner />}
    </section>
  );
};

Discover.propTypes = {
  getGroupTypes: PropTypes.func.isRequired,
  groupType: PropTypes.object.isRequired,
  groupTypeNumbersMap: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  groupType: state.groupType,
  groupTypeNumbersMap: state.liveData.groupTypeNumbersMap,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { getGroupTypes }
)(Discover);
