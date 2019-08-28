import React, { useState } from "react";

const Carousel = ({ items }) => {
  const [carouselData, setCarouselData] = useState({
    active: 0,
    direction: ""
  });

  const { active, direction } = carouselData;

  const generateItems = () => {
    const generatedItems = [];

    for (let i = active - 1; i < active + 2; i++) {
      let index = i;
      if (i < 0) {
        index = items.length + i;
      } else if (i >= items.length) {
        index = i % items.length;
      }
      const level = active - i;
      generatedItems.push(<Item key={index} id={items[index]} level={level} />);
    }

    return generatedItems;
  };

  const moveCarousel = direction => {
    switch (direction) {
      case "left":
        setCarouselData({
          active: active < 1 ? items.length - 1 : active - 1,
          direction: "left"
        });
        break;
      case "right":
        setCarouselData({
          active: (active + 1) % items.length,
          direction: "right"
        });
        break;
    }
  };

  return (
    <div id="carousel" className="noselect">
      <div
        name="left"
        className="arrow arrow-left"
        onClick={() => moveCarousel("left")}
      >
        <span className="icon is-medium">
          <i className="fas fa-lg fa-chevron-circle-left" />
        </span>
      </div>
      {generateItems()}
      <div
        name="right"
        className="arrow arrow-right"
        onClick={() => moveCarousel("right")}
      >
        <span className="icon is-medium">
          <i className="fas fa-lg fa-chevron-circle-right" />
        </span>
      </div>
    </div>
  );
};

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
        <article className="media">
          <figure className="media-left">
            <p className="image is-64x64">
              <img src="https://bulma.io/images/placeholders/128x128.png" />
            </p>
          </figure>
          <div className="media-content">
            <div className="content">
              <p>
                <strong>Jayden Smith</strong> <small> @jsmith </small>
                <small> [Notice {this.props.id}]</small>
                <br />
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                ornare magna eros, eu pellentesque tortor vestibulum ut.
                Maecenas non massa sem.
              </p>
            </div>
            <nav className="level is-mobile">
              <div className="level-left">
                <a className="level-item">
                  <span className="icon is-small">
                    <i className="fas fa-reply" />
                  </span>
                </a>
                <a className="level-item">
                  <span className="icon is-small">
                    <i className="fas fa-retweet" />
                  </span>
                </a>
                <a className="level-item">
                  <span className="icon is-small">
                    <i className="fas fa-heart" />
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
