import React from "react";
import { Link } from "react-router-dom";

import Image from "../common/subcomponents/Image";
import OnlineStatus from "../common/subcomponents/OnlineStatus";

import defaultGroupTypeImage from "../../resources/default_grouptype_image.png";

const GroupTypeCard = ({
  imgSrc,
  name,
  groupTypeCategory,
  groupAndUserNumbers
}) => {
  const getClassName = groupTypeCategory => {
    const classList = ["tag", "card-tag"];

    switch (groupTypeCategory) {
      case "Social":
        classList.push("category-social");
        break;
      case "Gaming":
        classList.push("category-gaming");
        break;
      case "Educational":
        classList.push("category-educational");
        break;
      case "Professional":
        classList.push("category-professional");
        break;
      case "Hobby":
        classList.push("category-hobby");
        break;
      case "Other":
        classList.push("category-other");
        break;
      default:
        classList.push("is-light");
    }

    return classList.join(" ");
  };

  return (
    <Link
      to={`/k/${name.split(" ").join("_")}`}
      className="card group-type-card"
    >
      <div className="card-image">
        <Image
          figureClass="is-2by1"
          src={imgSrc !== "" ? imgSrc : defaultGroupTypeImage}
        />
      </div>
      <span className={getClassName(groupTypeCategory)}>
        {groupTypeCategory}
      </span>
      <div className="card-content">
        <h1 className="title is-size-4">{name}</h1>
        <div className="subtitle is-size-6">
          <OnlineStatus
            users={groupAndUserNumbers ? groupAndUserNumbers.users : ""}
            groups={groupAndUserNumbers ? groupAndUserNumbers.groups : ""}
          />
        </div>
      </div>
    </Link>
  );
};

export default GroupTypeCard;
