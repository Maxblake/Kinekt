import React, { Component } from "react";
import GroupTypeCard from "../cards/GroupTypeCard";

class Discover extends Component {
  render() {
    return (
      <div className="groupTypeCards">
        <GroupTypeCard />
        <GroupTypeCard />
        <GroupTypeCard />
        <GroupTypeCard />
        <GroupTypeCard />
        <GroupTypeCard />
        <GroupTypeCard />
      </div>
    );
  }
}

export default Discover;
