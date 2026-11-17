import React from "react";
import "./successAnimation.css";

export default function SuccessAnimation() {
  return (
    <div className="success-container">
      <div className="checkmark-circle">
        <div className="background"></div>
        <div className="checkmark draw"></div>
      </div>
      <div className="confetti">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`confetti-piece c${i}`}></div>
        ))}
      </div>
    </div>
  );
}