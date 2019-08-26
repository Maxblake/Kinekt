import React from "react";

const DiscoverHeader = () => {
  return (
    <div className="discover-header">
      <div className="header-step">
        <figure class="image is-128x128">
          <img
            class="is-rounded"
            src="https://bulma.io/images/placeholders/128x128.png"
          />
        </figure>
        <div className="step-description has-text-centered">
          1. Create a free account
        </div>
      </div>
      <div className="header-step">
        <figure class="image is-128x128">
          <img
            class="is-rounded"
            src="https://bulma.io/images/placeholders/128x128.png"
          />
        </figure>
        <div className="step-description has-text-centered">
          2. Find groups that you're interested in
        </div>
      </div>
      <div className="header-step">
        <figure class="image is-128x128">
          <img
            class="is-rounded"
            src="https://bulma.io/images/placeholders/128x128.png"
          />
        </figure>
        <div className="step-description has-text-centered">
          3. Join in real time
        </div>
      </div>
    </div>
  );
};

export default DiscoverHeader;
