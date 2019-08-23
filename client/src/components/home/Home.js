import React, { Component } from "react";

import Discover from "./Discover";
import DiscoverHeader from "./DiscoverHeader";

class Home extends Component {
  render() {
    return (
      <div>
        <DiscoverHeader />
        <Discover />
      </div>
    );
  }
}

export default Home;
