import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { createGroup } from "../../../actions/group";
import RadioButton from "../../common/RadioButton";
import TimeKeeper from "react-timekeeper";
//TODO use moment for this
import { getCurrentTimeString } from "../../../utils/utils";
import moment from "moment";

//TODO convert to functional, make sure groupType is always in state
class NewGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      place: "",
      timeContext: "Now",
      accessLevel: "Public",
      time: { formatted: getCurrentTimeString() },
      displayTimepicker: false,
      minSize: "",
      maxSize: "",
      image: { name: "" }
    };
    this.handleTimeChange = this.handleTimeChange.bind(this); //TODO don't do this
    this.handleTimeContextChange = this.handleTimeContextChange.bind(this);
    this.handleAccessLevelChange = this.handleAccessLevelChange.bind(this);
  }
  //TODO maybe refactor this to general use file
  handleFormChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };
  handleTimeContextChange(timeContext) {
    if (timeContext === "Now") {
      this.setState({ time: getCurrentTimeString() });
    }
    this.setState({ timeContext });
  }
  handleTimeChange(newTime) {
    if (this.state.timeContext === "Now") {
      this.setState({ timeContext: "Today" });
    }
    this.setState({ time: newTime });
  }
  toggleTimekeeper(val) {
    this.setState({ displayTimepicker: val });
  }
  handleAccessLevelChange(accessLevel) {
    this.setState({ accessLevel });
  }
  handleImageUpload = e => {
    const imageFile = e.target.files[0];

    if (!imageFile) return;
    if (
      imageFile.size > e.target.attributes.getNamedItem("data-max-size").value
    ) {
      console.log("too big");
      //TODO set error on field
      return;
    }

    this.setState({ image: { name: imageFile.name, file: imageFile } });
  };

  onSubmit = e => {
    e.preventDefault();

    const {
      name,
      description,
      place,
      timeContext,
      accessLevel,
      time,
      minSize,
      maxSize
    } = this.state;

    const groupFields = {
      name,
      description,
      place,
      accessLevel,
      minSize,
      maxSize
    };

    const ISODate = moment();
    if (timeContext !== "Now") {
      ISODate.set({
        hour: time.hour24,
        minute: time.minute
      });
    }
    if (timeContext === "Tomorrow") {
      ISODate.add(1, "day");
    }

    groupFields.time = ISODate.toISOString();
    groupFields.image = this.state.image.file;
    groupFields.groupType = this.props.groupType._id;

    this.props.createGroup(groupFields, this.props.history);
  };

  render() {
    return (
      <section className="Newgroup centeredForm">
        <nav className="level" id="pageNav">
          <div className="level-left">
            <div className="level-item">
              <div className="groupTypeTitleContainer">
                <Link
                  to={`/k/${this.props.match.params.groupType}`}
                  className="subtitle is-size-6 groupTypeSubtitleContainer"
                >
                  {this.props.match.params.groupType.split("_").join(" ")}
                </Link>
                <h3 className="title is-size-3 pageTitle" id="groupPageTitle">
                  Create a group
                </h3>
              </div>
            </div>
          </div>
        </nav>

        {this.state.displayTimepicker ? (
          <div class="modal is-active">
            <div
              class="modal-background"
              onClick={() => this.toggleTimekeeper(false)}
            />
            <div class="modal-content timeKeeperModalContent">
              <TimeKeeper
                time={this.state.time.formatted}
                onChange={this.handleTimeChange}
                onDoneClick={() => {
                  this.toggleTimekeeper(false);
                }}
                switchToMinuteOnHourSelect={true}
              />
            </div>
          </div>
        ) : (
          false
        )}

        <form className="box" onSubmit={this.onSubmit}>
          <label class="label">Group Name *</label>
          <div class="field">
            <div class="control">
              <input
                class="input"
                type="text"
                name="name"
                value={this.state.name}
                onChange={this.handleFormChange}
                placeholder="E.g. Taco Party"
                required
              />
            </div>
          </div>

          <label class="label">Group Description</label>
          <div class="field">
            <div class="control">
              <textarea
                class="textarea"
                rows="2"
                name="description"
                value={this.state.description}
                onChange={this.handleFormChange}
                placeholder="E.g. Let's hang out and argue about flour and corn tortillas at my place."
              />
            </div>
          </div>

          <label class="label">Meeting Time *</label>
          <div class="field is-grouped">
            <div class="control">
              <RadioButton
                selectedValue={this.state.timeContext}
                value="Now"
                handleClick={this.handleTimeContextChange}
              />
            </div>
            <div class="control centeredVertically">
              <h3>-or-</h3>
            </div>
            <div class="control">
              <input
                class="input smallInput"
                type="text"
                value={this.state.time.formatted}
                onClick={() => this.toggleTimekeeper(true)}
                readOnly
              />
            </div>
            <div class="control">
              <RadioButton
                selectedValue={this.state.timeContext}
                value="Today"
                handleClick={this.handleTimeContextChange}
              />
            </div>
            <div class="control">
              <RadioButton
                selectedValue={this.state.timeContext}
                value="Tomorrow"
                handleClick={this.handleTimeContextChange}
              />
            </div>
          </div>

          <label class="label">Meeting Place *</label>
          <div class="field">
            <div class="control">
              <input
                class="input"
                type="text"
                name="place"
                value={this.state.place}
                onChange={this.handleFormChange}
                placeholder="E.g. 555 My House, Newport RI"
                required
              />
            </div>
          </div>

          <label class="label">Group Size</label>
          <div class="field is-grouped">
            <div class="control">
              <input
                class="input smallInput"
                type="text"
                placeholder="Any"
                name="minSize"
                value={this.state.minSize}
                onChange={this.handleFormChange}
              />
            </div>
            <div class="control centeredVertically">
              <h3>-to-</h3>
            </div>
            <div class="control">
              <input
                class="input smallInput"
                type="text"
                placeholder="Any"
                name="maxSize"
                value={this.state.maxSize}
                onChange={this.handleFormChange}
              />
            </div>
          </div>

          <label class="label">Access Level</label>
          <div class="field is-grouped">
            <div class="control">
              <RadioButton
                selectedValue={this.state.accessLevel}
                value="Public"
                handleClick={this.handleAccessLevelChange}
              />
            </div>
            <div class="control">
              <RadioButton
                selectedValue={this.state.accessLevel}
                value="Private"
                handleClick={this.handleAccessLevelChange}
              />
            </div>
          </div>

          <label class="label">Group Image</label>
          <div class="field">
            <div class="file has-name is-primary">
              <label class="file-label">
                <input
                  class="file-input"
                  type="file"
                  name="groupImage"
                  accept="image/*"
                  data-max-size="10485760"
                  onChange={this.handleImageUpload}
                />
                <span class="file-cta">
                  <span class="file-icon">
                    <i class="fas fa-upload" />
                  </span>
                  <span class="file-label">Upload</span>
                </span>
                <span class="file-name">
                  {this.state.image.name
                    ? this.state.image.name
                    : "No image selected.."}
                </span>
              </label>
            </div>
          </div>

          <div class="field is-grouped is-grouped-right">
            <div class="control">
              <button class="button is-text" type="button">
                Cancel
              </button>
            </div>
            <div class="control">
              <button class="button is-primary" type="submit">
                Submit
              </button>
            </div>
          </div>
        </form>
      </section>
    );
  }
}

NewGroup.propTypes = {
  createGroup: PropTypes.func.isRequired,
  groupType: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  groupType: state.groupType.groupType
});

export default connect(
  mapStateToProps,
  { createGroup }
)(withRouter(NewGroup));
