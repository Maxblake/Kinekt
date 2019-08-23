import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { getGroups } from "../../actions/group";

import Spinner from "../common/Spinner";
import NotFound from "../common/NotFound";
import GroupCard from "../cards/GroupCard";
import PageTitle from "../layout/page/PageTitle";
import OnlineStatus from "../common/subcomponents/OnlineStatus";
import PageOptions from "../layout/page/PageOptions";

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
    if (!groupType || groupTypeParamChanged || !groups.length) {
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

  const options = [
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
    </Fragment>,
    <div className="field">
      <div className="select is-fullwidth-touch">
        <select className="is-fullwidth-touch">
          <option>Trending</option>
          <option>Top</option>
          <option>New</option>
          <option>Nearby</option>
        </select>
      </div>
    </div>,
    <div className="field has-addons">
      <p className="control" id="controlSearchGroups">
        <input className="input" type="text" placeholder="Search groups" />
      </p>
      <p className="control">
        <button className="button is-primary">
          <span className="icon is-small">
            <i className="fas fa-search" />
          </span>
        </button>
      </p>
    </div>
  ];

  return (
    <section className="groupType">
      <nav className="level" id="pageNav">
        <PageTitle
          title={match.params.groupType.split("_").join(" ")}
          subtitle={<OnlineStatus users="30 users" groups="3 groups" />}
        />
        <PageOptions options={options} />
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
