import React, { Component } from "react";
import GroupTypeCard from "../cards/GroupTypeCard";

class Discover extends Component {
  render() {
    return (
      <section className="discover">
        <nav className="level is-mobile" id="pageNav">
          <div className="level-left">
            <div className="level-item">
              <h3 className="title is-size-3 pageTitle">Explore</h3>
            </div>
          </div>

          <div className="level-right">
            <div className="level-item">
              <div className="field">
                <div className="select">
                  <select>
                    <option>Trending</option>
                    <option>Top</option>
                    <option>New</option>
                    <option>Nearby</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="level-item">
              <div className="field">
                <div className="select">
                  <select>
                    <option>All</option>
                    <option>Social</option>
                    <option>Gaming</option>
                    <option>Educational</option>
                    <option>Professional</option>
                    <option>Hobby</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="level-item">
              <div className="field has-addons">
                <p className="control" id="controlSearchGroupTypes">
                  <input
                    className="input"
                    type="text"
                    placeholder="Search group types"
                  />
                </p>
                <p className="control">
                  <button className="button is-primary">
                    <span className="icon is-small">
                      <i className="fas fa-search" />
                    </span>
                  </button>
                </p>
              </div>
            </div>
          </div>
        </nav>
        <div className="groupTypeCards">
          <GroupTypeCard
            imgSrc="https://source.unsplash.com/random/640x320"
            title="Volleyball"
            groupType="Sports"
          />
          <GroupTypeCard
            imgSrc="https://source.unsplash.com/random/640x320"
            title="Tennis"
            groupType="Sports"
          />
          <GroupTypeCard
            imgSrc="https://source.unsplash.com/random/640x320"
            title="Soccer"
            groupType="Sports"
          />
          <GroupTypeCard
            imgSrc="https://source.unsplash.com/random/640x320"
            title="Bars and Clubs"
            groupType="Social"
          />
          <GroupTypeCard
            imgSrc="https://source.unsplash.com/random/640x320"
            title="Study Groups @ Chaptown"
            groupType="Education"
          />
          <GroupTypeCard
            imgSrc="https://source.unsplash.com/random/640x320"
            title="Travel"
            groupType="Hobby"
          />
          <GroupTypeCard
            imgSrc="https://source.unsplash.com/random/640x320"
            title="CSGO"
            groupType="Gaming"
          />
          <GroupTypeCard
            imgSrc="https://source.unsplash.com/random/640x320"
            title="Cooking"
            groupType="Hobby"
          />
        </div>
      </section>
    );
  }
}

export default Discover;
