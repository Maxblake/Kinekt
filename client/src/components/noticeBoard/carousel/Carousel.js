import { CSSTransitionGroup } from "react-transition-group";
import React, { Component } from "react";

class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items,
      active: this.props.active,
      direction: ""
    };
    this.rightClick = this.moveRight.bind(this);
    this.leftClick = this.moveLeft.bind(this);
  }

  generateItems() {
    var items = [];
    var level;
    for (var i = this.state.active - 1; i < this.state.active + 2; i++) {
      var index = i;
      if (i < 0) {
        index = this.state.items.length + i;
      } else if (i >= this.state.items.length) {
        index = i % this.state.items.length;
      }
      level = this.state.active - i;
      items.push(
        <Item key={index} id={this.state.items[index]} level={level} />
      );
    }
    return items;
  }

  moveLeft() {
    var newActive = this.state.active;
    newActive--;
    this.setState({
      active: newActive < 0 ? this.state.items.length - 1 : newActive,
      direction: "left"
    });
  }

  moveRight() {
    var newActive = this.state.active;
    this.setState({
      active: (newActive + 1) % this.state.items.length,
      direction: "right"
    });
  }

  render() {
    return (
      <div id="carousel" className="noselect">
        <div className="arrow arrow-left" onClick={this.leftClick}>
          <span class="icon is-medium">
            <i className="fas fa-lg fa-chevron-circle-left" />
          </span>
        </div>
        {this.generateItems()}
        <div className="arrow arrow-right" onClick={this.rightClick}>
          <span class="icon is-medium">
            <i className="fas fa-lg fa-chevron-circle-right" />
          </span>
        </div>
      </div>
    );
  }
}

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      level: this.props.level
    };
  }

  render() {
    const className = "item level" + this.props.level;
    return (
      <div className={className}>
        <article class="media">
          <figure class="media-left">
            <p class="image is-64x64">
              <img src="https://bulma.io/images/placeholders/128x128.png" />
            </p>
          </figure>
          <div class="media-content">
            <div class="content">
              <p>
                <strong>Jayden Smith</strong> <small> @jsmith </small>
                <small> [Notice {this.props.id}]</small>
                <br />
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                ornare magna eros, eu pellentesque tortor vestibulum ut.
                Maecenas non massa sem.
              </p>
            </div>
            <nav class="level is-mobile">
              <div class="level-left">
                <a class="level-item">
                  <span class="icon is-small">
                    <i class="fas fa-reply" />
                  </span>
                </a>
                <a class="level-item">
                  <span class="icon is-small">
                    <i class="fas fa-retweet" />
                  </span>
                </a>
                <a class="level-item">
                  <span class="icon is-small">
                    <i class="fas fa-heart" />
                  </span>
                </a>
              </div>
            </nav>
          </div>
        </article>
      </div>
    );
  }
}

export default Carousel;
