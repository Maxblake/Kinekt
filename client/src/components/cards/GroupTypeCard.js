import React, { Component } from "react";
import { Link } from "react-router-dom";

class GroupTypeCard extends Component {
  render() {
    return (
      <Link
        to={`/k/${this.props.name.split(" ").join("_")}`}
        className="card groupTypeCard"
      >
        <div className="card-image">
          <figure className="imageContainer image is-2by1">
            <img src={this.props.imgSrc} alt="Placeholder image" />
          </figure>
        </div>
        <span className="tag is-light groupTypeTag">
          {this.props.groupType}
        </span>
        <div className="card-content">
          <h1 className="title is-size-4">{this.props.name}</h1>
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
  }
}

export default GroupTypeCard;
