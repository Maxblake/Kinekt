import React, { Component } from "react";
import Discover from "./Discover";

class Home extends Component {
  render() {
    return (
      <div>
        <div className="box has-text-centered has-margin-top-2">
          Ad space, landing page, banner, etc.
        </div>
        <Discover />
      </div>
    );
  }
}

export default Home;
