import React from "react";
import { Link } from "react-router-dom";

import Image from "../common/subcomponents/Image";

import imgStepOne from "../../resources/discover_step_one.jpg";
import imgStepTwo from "../../resources/discover_step_two.jpg";
import imgStepThree from "../../resources/discover_step_three.jpg";
import elephant from "../../resources/elephant.png";

const DiscoverHeader = () => {
  return (
    <div className="discover-header k-scroll">
      <div className="header-welcome">
        <h2 className="ws-nowrap is-size-1">
          <strong>New</strong> around here?
        </h2>
        <h3 className="is-size-4">
          <span className="ws-nowrap">Awesome! Read this quick intro and</span>{" "}
          <span className="ws-nowrap">
            you'll be joining groups lickity split.
          </span>{" "}
        </h3>
      </div>
      <div className="header-step">
        <div className="step-image">
          <Image
            src={imgStepOne}
            figureClass="is-square"
            imageClass="is-rounded"
          />
        </div>
        <Link to="/register" className="step-description">
          <h2 className="is-size-3 is-size-4-touch">Create a free account</h2>
          <p>
            Creating and joining public groups will always be free! HappenStack
            is supported by those who create protected and private groups.
          </p>
        </Link>
      </div>
      <div className="header-step">
        <div className="step-image">
          <Image
            src={imgStepTwo}
            figureClass="is-square"
            imageClass="is-rounded"
          />
        </div>
        <div className="step-description">
          <h2 className="is-size-3 is-size-4-touch">
            Find groups that <span className="ws-nowrap">interest you</span>
          </h2>
          <p>
            On HappenStack, groups 'live' inside of group types. If you can't
            find a group type that suits your fancy, you can always request a
            new one!
          </p>
        </div>
      </div>
      <div className="header-step">
        <div className="step-image">
          <Image
            src={imgStepThree}
            figureClass="is-square"
            imageClass="is-rounded"
          />
        </div>
        <div className="step-description">
          <h2 className="is-size-3 is-size-4-touch">
            Join and participate <span className="ws-nowrap">on the fly</span>
          </h2>
          <p>
            Our philosophy is <i>now.</i> Groups should be made for things
            happening either now or in the near future. Groups automatically
            expire after 24 hours.
          </p>
        </div>
      </div>

      <div className="call-to-elephant">
        <Image src={elephant} />
        <Link to="/register" className="button is-success is-medium">
          I'm ready!
        </Link>
      </div>
    </div>
  );
};

export default DiscoverHeader;
