import React, { Component } from "react";
import GroupTypeCard from "../cards/GroupTypeCard";

class Discover extends Component {
  render() {
    return (
      <section className="discover">
        <nav class="level is-mobile" id="levelDiscoverNav">
          <div class="level-left">
            <div class="level-item">
              <h3 class="title is-size-3 pageTitle">Explore</h3>
            </div>
          </div>

          <div class="level-right">
            <div class="level-item">
              <div className="field">
                <div class="select">
                  <select>
                    <option>Trending</option>
                    <option>Top</option>
                    <option>New</option>
                    <option>Nearby</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="level-item">
              <div className="field">
                <div class="select">
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
            <div class="level-item">
              <div class="field has-addons">
                <p class="control" id="controlSearchGroupTypes">
                  <input
                    class="input"
                    type="text"
                    placeholder="Search group types"
                  />
                </p>
                <p class="control">
                  <button class="button is-black">
                    <span class="icon is-small">
                      <i class="fas fa-search" />
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
