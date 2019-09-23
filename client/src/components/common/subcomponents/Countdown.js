import React, { Fragment, useState, useEffect } from "react";

const Countdown = ({ totalTime, onTimeout }) => {
  const [currentTime, setcurrentTime] = useState(totalTime);

  useEffect(() => {
    let intervalId = null;

    if (currentTime > 0) {
      intervalId = setInterval(
        () => setcurrentTime((currentTime - 0.5).toFixed(1)),
        500
      );
    } else {
      onTimeout();
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [currentTime]);

  const percentage = (currentTime / totalTime) * 100;
  // Size of the enclosing square
  const sqSize = 48;
  // SVG centers the stroke width on the radius, subtract out so circle fits in square
  const strokeWidth = 6;
  const radius = (sqSize - strokeWidth) / 2;
  // Enclose cicle in a circumscribing square
  const viewBox = `0 0 ${sqSize} ${sqSize}`;
  // Arc length at 100% coverage is the circle circumference
  const dashArray = radius * Math.PI * 2;
  // Scale 100% coverage overlay with the actual percent
  const dashOffset = dashArray - (dashArray * percentage) / 100;

  return (
    <div className="countdown-container">
      {currentTime > 0 ? (
        <Fragment>
          <svg width={sqSize} height={sqSize} viewBox={viewBox}>
            <circle
              className="circle-background"
              cx={sqSize / 2}
              cy={sqSize / 2}
              r={radius}
              strokeWidth={`${strokeWidth}px`}
            />
            <circle
              className="circle-progress"
              cx={sqSize / 2}
              cy={sqSize / 2}
              r={radius}
              strokeWidth={`${strokeWidth}px`}
              // Start progress marker at 12 O'Clock
              transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
              style={{
                strokeDasharray: dashArray,
                strokeDashoffset: dashOffset
              }}
            />
            {currentTime <= 10 && (
              <text
                className="countdown-text"
                x="50%"
                y="50%"
                dy=".3em"
                textAnchor="middle"
              >
                {Math.ceil(currentTime)}
              </text>
            )}
          </svg>
          {currentTime > 10 && (
            <span className="icon countdown-icon is-large">
              <i className="fas fa-hourglass-end"></i>
            </span>
          )}
        </Fragment>
      ) : (
        <span className="icon is-large">
          <span className="fa-stack fa-lg">
            <i className="fas fa-hourglass-end fa-stack-1x"></i>
            <i className="fas fa-ban fa-stack-2x has-text-danger"></i>
          </span>
        </span>
      )}
    </div>
  );
};

export default Countdown;
