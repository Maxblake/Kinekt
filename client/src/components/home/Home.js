import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Discover from "./Discover";
import DiscoverHeader from "./DiscoverHeader";

const Home = ({ auth }) => {
  const { isAuthenticated, loading } = auth;

  if (loading) return null;

  return (
    <div>
      {!loading && !isAuthenticated ? <DiscoverHeader /> : <Discover />}
    </div>
  );
};

Home.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  null
)(Home);
