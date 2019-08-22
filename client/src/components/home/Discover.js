import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { getGroupTypes } from "../../actions/groupType";

import Spinner from "../common/Spinner";
import GroupTypeCard from "../cards/GroupTypeCard";

const Discover = ({
  getGroupTypes,
  groupType: { groupTypes, loading },
  isAuthenticated
}) => {
  const [groupTypeData, setgroupTypeData] = useState({
    sortBy: "Trending",
    category: "All",
    searchTerms: "",
    readyToLoadNewTypes: "true"
  });

  const { sortBy, category, searchTerms, readyToLoadNewTypes } = groupTypeData;

  useEffect(() => {
    if (readyToLoadNewTypes) {
      getGroupTypes(groupTypeData);

      setgroupTypeData({
        ...groupTypeData,
        readyToLoadNewTypes: "false"
      });
    }
  }, [readyToLoadNewTypes]);

  const onChange = e => {
    setgroupTypeData({
      ...groupTypeData,
      [e.target.name]: e.target.value,
      readyToLoadNewTypes:
        e.target.name === "searchTerms" ? readyToLoadNewTypes : "true"
    });
  };

  const onSearchTermsSubmit = e => {
    e.preventDefault();

    setgroupTypeData({
      ...groupTypeData,
      readyToLoadNewTypes: "true"
    });
  };

  let groupTypeCards = <Spinner />;
  if (!loading && !groupTypes.length) {
    groupTypeCards = (
      <div className="box is-size-5 has-text-centered has-margin-top-2">
        There are currently no group types here. It may be time to request a new
        one!
      </div>
    );
  } else if (!!groupTypes.length) {
    groupTypeCards = (
      <div className="groupTypeCards">
        {groupTypes.map(groupType => (
          <GroupTypeCard
            key={groupType._id}
            imgSrc={groupType.image ? groupType.image.link : ""}
            name={groupType.name}
            groupTypeCategory={
              groupType.category ? groupType.category : "Other"
            }
          />
        ))}
      </div>
    );
  }

  return (
    <section className="discover">
      <nav className="level is-mobile" id="pageNav">
        <div className="level-left">
          <div className="level-item">
            <h3 className="title is-size-3 pageTitle">Explore</h3>
          </div>
        </div>

        <div className="level-right">
          {isAuthenticated && (
            <div className="level-item">
              <Link to="/request-grouptype" className="button is-primary">
                <span className="icon">
                  <i className="fas fa-plus" />
                </span>
                <span>New Group Type</span>
              </Link>
            </div>
          )}
          <div className="level-item">
            <div className="field">
              <div className="select">
                <select
                  name="sortBy"
                  value={sortBy}
                  onChange={e => onChange(e)}
                >
                  <option>Trending</option>
                  <option>Top</option>
                  <option>New</option>
                  <option>Nearby</option>
                </select>
              </div>
            </div>
          </div>
          <div className="level-item">
            <div className="field">
              <div className="select">
                <select
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
            </div>
          </div>
          <div className="level-item">
            <form onSubmit={e => onSearchTermsSubmit(e)}>
              <div className="field has-addons">
                <p className="control" id="controlSearchGroupTypes">
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
                  <button className="button is-primary" type="submit">
                    <span className="icon is-small">
                      <i className="fas fa-search" />
                    </span>
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </nav>
      {groupTypeCards}
    </section>
  );
};

Discover.propTypes = {
  getGroupTypes: PropTypes.func.isRequired,
  groupType: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  groupType: state.groupType,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { getGroupTypes }
)(Discover);
