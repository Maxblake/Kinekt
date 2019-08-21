import React, { Component } from "react";
import Discover from "./Discover";

class Home extends Component {
  render() {
    return (
      <div>
        <div className="discoverHeader">
          <div className="headerStep">
            <figure class="image is-128x128">
              <img
                class="is-rounded"
                src="https://bulma.io/images/placeholders/128x128.png"
              />
            </figure>
            <div className="stepDescription has-text-centered">
              1. Create a free account
            </div>
          </div>
          <div className="headerStep">
            <figure class="image is-128x128">
              <img
                class="is-rounded"
                src="https://bulma.io/images/placeholders/128x128.png"
              />
            </figure>
            <div className="stepDescription has-text-centered">
              2. Find groups that you're interested in
            </div>
          </div>
          <div className="headerStep">
            <figure class="image is-128x128">
              <img
                class="is-rounded"
                src="https://bulma.io/images/placeholders/128x128.png"
              />
            </figure>
            <div className="stepDescription has-text-centered">
              3. Join in real time
            </div>
          </div>
        </div>
        <Discover />
      </div>
    );
  }
}

export default Home;
