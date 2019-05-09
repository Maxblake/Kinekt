import React, { Component } from "react";

class GroupTypeCard extends Component {
  render() {
    return (
      <a href="#">
        <div className="card groupTypeCard">
          <div className="card-image">
            <figure className="image is-2by1">
              <img src={this.props.imgSrc} alt="Placeholder image" />
            </figure>
          </div>
          <span className="tag is-light groupTypeTag">
            {this.props.groupType}
          </span>
          <div className="card-content">
            <h1 className="title is-size-4">{this.props.title}</h1>
            <div className="subtitle is-size-6">
              <div className="onlineStatusContainer">
                <div className="onlineStatusDot" />
                <h4 className="onlineStatusText">3 groups</h4>
                <div className="onlineStatusDot" />
                <h4 className="onlineStatusText">14 users</h4>
              </div>
            </div>
          </div>
        </div>
      </a>
    );
  }
}

export default GroupTypeCard;
