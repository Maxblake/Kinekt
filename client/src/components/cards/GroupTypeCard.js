import React from "react";
import { Link } from "react-router-dom";

import defaultGroupTypeImage from "../../resources/defaultGroupTypeImage.jpg";

const GroupTypeCard = ({ imgSrc, name, groupTypeCategory }) => {
  const getClassList = groupTypeCategory => {
    const classList = ["tag", "groupTypeTag"];

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
    <Link to={`/k/${name.split(" ").join("_")}`} className="card groupTypeCard">
      <div className="card-image">
        <figure className="imageContainer image is-2by1">
          <img
            src={imgSrc !== "" ? imgSrc : defaultGroupTypeImage}
            alt="Placeholder image"
          />
        </figure>
      </div>
      <span className={getClassList(groupTypeCategory)}>
        {groupTypeCategory}
      </span>
      <div className="card-content">
        <h1 className="title is-size-4">{name}</h1>
        <div className="subtitle is-size-6">
          <div className="onlineStatusContainer">
            <div className="onlineStatusDot" />
            <h4 className="onlineStatusText">3 groups</h4>
            <div className="onlineStatusDot" />
            <h4 className="onlineStatusText">14 users</h4>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GroupTypeCard;
