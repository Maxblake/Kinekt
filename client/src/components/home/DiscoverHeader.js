import React from "react";
import { Link } from "react-router-dom";

import Image from "../common/subcomponents/Image";

import imgStepOne from "../../resources/discover_step_one.jpg";
import imgStepTwo from "../../resources/discover_step_two.jpg";
import imgStepThree from "../../resources/discover_step_three.jpg";

// TODO use a level for this
const DiscoverHeader = () => {
  return (
    <div className="discover-header has-text-centered has-rounded-corners">
      <h2 className="header-welcome">
        <span className="ws-nowrap">Welcome to HappenStack,</span>{" "}
        <span className="ws-nowrap">getting started is</span>{" "}
        <span className="ws-nowrap">fast and easy.</span>
      </h2>
      <div className="level">
        <div className="level-item header-step">
          <div className="step-image">
            <Image
              src={imgStepOne}
              figureClass="is-square"
              imageClass="is-rounded"
            />
          </div>
          <Link to="/register" className="step-description has-text-centered">
            1. Click here for a free account.
          </Link>
        </div>
        <div className="level-item header-step">
          <div className="step-image">
            <Image
              src={imgStepTwo}
              figureClass="is-square"
              imageClass="is-rounded"
            />
          </div>
          <div className="step-description has-text-centered">
            2. Find groups that interest you.
          </div>
        </div>
        <div className="level-item header-step">
          <div className="step-image">
            <Image
              src={imgStepThree}
              figureClass="is-square"
              imageClass="is-rounded"
            />
          </div>
          <div className="step-description has-text-centered">
            3. Join and participate on the fly!
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverHeader;
