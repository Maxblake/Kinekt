import React, { Component } from "react";
import RadioButton from "../../common/RadioButton";
import TimeKeeper from "react-timekeeper";
import { getCurrentTimeString } from "../../../utils/utils";

class NewGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeContext: "Now",
      accessLevel: "Public",
      time: getCurrentTimeString(),
      displayTimepicker: false,
      minGroupSize: "",
      maxGroupSize: "",
      image: { name: "", formData: {} }
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
    this.setState({ time: newTime.formatted });
  }
  toggleTimekeeper(val) {
    this.setState({ displayTimepicker: val });
  }
  handleAccessLevelChange(accessLevel) {
    this.setState({ accessLevel });
  }
  handleImageUpload = e => {
    const imageFile = e.target.files[0];
    const formData = new FormData();

    if (!imageFile) return;

    if (
      imageFile.size > e.target.attributes.getNamedItem("data-max-size").value
    ) {
      console.log("too big");
      //TODO set error on field
      return;
    }

    formData.append("imageFile", imageFile);
    this.setState({ image: { name: imageFile.name, formData: formData } });
  };

  onSubmit = e => {
    e.preventDefault();
  };

  render() {
    return (
      <section className="Newgroup centeredForm">
        <nav className="level" id="pageNav">
          <div className="level-left">
            <div className="level-item">
              <div className="groupTypeTitleContainer">
                <div className="subtitle is-size-6 onlineStatusContainer">
                  {this.props.match.params.groupType}
                </div>
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
                time={this.state.time}
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

        <form className="box" onSubmit={e => this.onSubmit(e)}>
          <label class="label">Group Name *</label>
          <div class="field">
            <div class="control">
              <input
                class="input"
                type="text"
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
                value={this.state.time}
                onClick={() => this.toggleTimekeeper(true)}
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
                name="minGroupSize"
                value={this.state.minGroupSize}
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
                name="maxGroupSize"
                value={this.state.maxGroupSize}
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

export default NewGroup;
