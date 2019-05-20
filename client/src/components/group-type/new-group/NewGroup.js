import React, { Component } from "react";
import TimeKeeper from "react-timekeeper";

class NewGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: "3:15 PM",
      displayTimepicker: false
    };
    this.handleTimeChange = this.handleTimeChange.bind(this); //TODO don't do this
  }
  handleTimeChange(newTime) {
    this.setState({ time: newTime.formatted });
  }
  toggleTimekeeper(val) {
    this.setState({ displayTimepicker: val });
  }

  render() {
    return (
      <section className="Newgroup">
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

        <div className="NewGroupForm box">
          <div class="field">
            <div class="control">
              <input class="input" type="text" placeholder="E.g. Taco Party" />
            </div>
          </div>

          <div>
            {this.state.displayTimepicker ? (
              <TimeKeeper
                time={this.state.time}
                onChange={this.handleTimeChange}
                onDoneClick={() => {
                  this.toggleTimekeeper(false);
                }}
                switchToMinuteOnHourSelect={true}
              />
            ) : (
              false
            )}
          </div>
          <div class="field is-grouped">
            <div class="control">
              <input
                class="input timeInput"
                type="text"
                value={this.state.time}
                onClick={() => this.toggleTimekeeper(true)}
              />
            </div>
            <div class="control">
              <button class="button">Now</button>
            </div>
            <div class="control">
              <button class="button">Today</button>
            </div>
            <div class="control">
              <button class="button">Tomorrow</button>
            </div>
          </div>

          <div class="field">
            <label class="label">Email</label>
            <div class="control has-icons-left has-icons-right">
              <input
                class="input is-danger"
                type="email"
                placeholder="Email input"
                value="hello@"
              />
              <span class="icon is-small is-left">
                <i class="fas fa-envelope" />
              </span>
              <span class="icon is-small is-right">
                <i class="fas fa-exclamation-triangle" />
              </span>
            </div>
            <p class="help is-danger">This email is invalid</p>
          </div>

          <div class="field">
            <label class="label">Subject</label>
            <div class="control">
              <div class="select">
                <select>
                  <option>Select dropdown</option>
                  <option>With options</option>
                </select>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="label">Message</label>
            <div class="control">
              <textarea class="textarea" placeholder="Textarea" />
            </div>
          </div>

          <div class="field">
            <div class="control">
              <label class="checkbox">
                <input type="checkbox" />I agree to the{" "}
                <a href="#">terms and conditions</a>
              </label>
            </div>
          </div>

          <div class="field">
            <div class="control">
              <label class="radio">
                <input type="radio" name="question" />
                Yes
              </label>
              <label class="radio">
                <input type="radio" name="question" />
                No
              </label>
            </div>
          </div>

          <div class="field is-grouped is-grouped-right">
            <div class="control">
              <button class="button is-text">Cancel</button>
            </div>
            <div class="control">
              <button class="button is-link">Submit</button>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default NewGroup;
