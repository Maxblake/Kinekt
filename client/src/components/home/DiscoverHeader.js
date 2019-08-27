import React from "react";

import Image from "../common/subcomponents/Image";

import imgStepOne from "../../resources/discover_step_one.jpg";
import imgStepTwo from "../../resources/discover_step_two.jpg";
import imgStepThree from "../../resources/discover_step_three.jpg";

// TODO use a level for this
const DiscoverHeader = () => {
  return (
    <div className="discover-header">
      <div className="header-step">
        <a
          target="_blank"
          href="https://pixabay.com/users/skeeze-272447/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=981188"
        >
          <figure className="image is-128x128">
            <Image
              src={imgStepOne}
              figureClass="is-128x128"
              imageClass="is-rounded"
            />
          </figure>
        </a>
        <div className="step-description has-text-centered">
          1. Create a free (forever) account.
        </div>
      </div>
      <div className="header-step">
        <a
          target="_blank"
          href="https://pixabay.com/users/Susbany-19456/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=100947"
        >
          <figure className="image is-128x128">
            <Image
              src={imgStepTwo}
              figureClass="is-128x128"
              imageClass="is-rounded"
            />
          </figure>
        </a>
        <div className="step-description has-text-centered">
          2. Find groups that interest you.
        </div>
      </div>
      <div className="header-step">
        <a
          target="_blank"
          href="https://pixabay.com/users/mikefoster-424423/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1033155"
        >
          <Image
            src={imgStepThree}
            figureClass="is-128x128"
            imageClass="is-rounded"
          />
        </a>
        <div className="step-description has-text-centered">
          3. Join and participate on the fly!
        </div>
      </div>
    </div>
  );
};

export default DiscoverHeader;
