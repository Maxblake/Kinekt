import React, { useState, useEffect } from "react";

const Countdown = ({ totalTime }) => {
  const [countdownState, setCountdownState] = useState({
    interval: null,
    currentTime: totalTime
  });

  const { currentTime, interval } = countdownState;

  useEffect(() => {}, []);

  const percentage = (currentTime / totalTime) * 100;
  // Size of the enclosing square
  const sqSize = 40;
  // SVG centers the stroke width on the radius, subtract out so circle fits in square
  const strokeWidth = 5;
  const radius = (sqSize - strokeWidth) / 2;
  // Enclose cicle in a circumscribing square
  const viewBox = `0 0 ${sqSize} ${sqSize}`;
  // Arc length at 100% coverage is the circle circumference
  const dashArray = radius * Math.PI * 2;
  // Scale 100% coverage overlay with the actual percent
  const dashOffset = dashArray - (dashArray * percentage) / 100;

  return (
    <div className="countdown-container">
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
        <text
          className="countdown-text"
          x="50%"
          y="50%"
          dy=".3em"
          textAnchor="middle"
        >
          {currentTime}
        </text>
      </svg>
    </div>
  );
};

export default Countdown;
