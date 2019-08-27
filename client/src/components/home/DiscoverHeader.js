import React from "react";

import Image from "../common/subcomponents/Image";

import imgStepOne from "../../resources/discover_step_one.jpg";
import imgStepTwo from "../../resources/discover_step_two.jpg";
import imgStepThree from "../../resources/discover_step_three.jpg";

// TODO use a level for this
const DiscoverHeader = () => {
  return (
    <div className="level discover-header">
      <div className="level-item header-step">
        <div className="step-image">
          <Image
            src={imgStepOne}
            figureClass="is-square"
            imageClass="is-rounded"
          />
        </div>
        <div className="step-description has-text-centered">
          1. Create a free (forever) account.
        </div>
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
  );
};

export default DiscoverHeader;
