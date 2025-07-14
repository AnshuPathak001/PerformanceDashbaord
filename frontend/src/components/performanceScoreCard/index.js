import React from "react";
import "./style.css";

export default function ScoreCard({
  Icon,
  title,
  score,
  maxScore,
  weight,
  contributionPoints,
  width = "220px",
  color,
}) {
  return (
    <div className="card-container" style={{ width }}>
      <div className="card-header">
        {Icon && (
          <div className="card-icon" style={{ color }}>
            <Icon size={20} color={color} />
          </div>
        )}

        <div className="card-weight">{weight}% weight</div>
      </div>
      <div className="card-title">{title}</div>
      <div className="card-score">
        {score}/{maxScore}
      </div>
      <div className="card-contribution">
        Contributes {contributionPoints} pts
      </div>
    </div>
  );
}
