import { useState } from "react";
import Card from "../../components/card";
import { FaStar, FaClock, FaBolt, FaCode, FaCog } from "react-icons/fa";
import "./style.css";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Slider from "@mui/material/Slider";
import ScoreCard from "../../components/performanceScoreCard";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";

export default function PerformanceReview() {
  const [year, setYear] = useState("2024");
  const score = 75; // Example score
  const [openAir, setOpenAir] = useState(30);
  const [jira, setJira] = useState(40);
  const [git, setGit] = useState(28);

  const total = openAir + jira + git;

  const handleSliderChange = (setter) => (_, newValue) => {
    setter(newValue);
  };

  const cardData = [
    {
      score: "85",
      label: "Billable Hours",
      icon: FaClock,
      color: "#2ecc71",
      weight: openAir,
      contributionPoints: Math.round((openAir / 100) * 25), // example logic
    },
    {
      score: "92",
      label: "Jira Velocity",
      icon: FaBolt,
      color: "#3498db",
      weight: jira,
      contributionPoints: Math.round((jira / 100) * 25),
    },
    {
      score: "88",
      label: "Git Activity",
      icon: FaCode,
      color: "#e67e22",
      weight: git,
      contributionPoints: Math.round((git / 100) * 25),
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Title and controls */}
      <div className="performance-header">
        <div>
          <h1 className="dashboard-title">Performance Review</h1>
          <p className="dashboard-subtitle">
            Comprehensive performance analysis and review generation
          </p>
        </div>
        <div className="year-controls">
          <select
            className="year-select"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
          <button className="generate-button">Generate Review</button>
        </div>
      </div>

      <div className="progress-card">
        <div className="progress-bar-container">
          <CircularProgressbarWithChildren
            value={score}
            styles={buildStyles({
              pathColor: "#1884f0",
              trailColor: "#eee",
            })}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: "bold", color: "#111" }}>
                {score}
              </div>
              <div style={{ fontSize: 14, color: "#555" }}>Overall Score</div>
              <div style={{ fontSize: 14, color: "green", fontWeight: "bold" }}>
                Excellent
              </div>
            </div>
          </CircularProgressbarWithChildren>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {cardData.map((item, index) => (
          <ScoreCard
            key={index}
            Icon={item.icon}
            title={item.label}
            score={item.score}
            maxScore={100}
            weight={item.weight}
            contributionPoints={item.contributionPoints}
            width="220px"
            color={item.color}
          />
        ))}
      </div>

      {/* Weightage Configuration card */}
      <div className="weightage-card">
        <div className="weightage-header">
          <FaCog size={18} className="weightage-icon" />
          <h3 className="weightage-title">Weightage Configuration</h3>
        </div>

        <div className="slider-row">
          <div className="slider-block">
            <div className="slider-header">
              <span className="slider-label">OpenAir</span>
              <span className="slider-value">{openAir}%</span>
            </div>
            <Slider
              value={openAir}
              onChange={handleSliderChange(setOpenAir)}
              min={0}
              max={100}
              className="custom-slider"
              sx={{ mt: 1 }}
            />
          </div>

          <div className="slider-block">
            <div className="slider-header">
              <span className="slider-label">Jira</span>
              <span className="slider-value">{jira}%</span>
            </div>
            <Slider
              value={jira}
              onChange={handleSliderChange(setJira)}
              min={0}
              max={100}
              className="custom-slider"
              sx={{ mt: 1 }}
            />
          </div>

          <div className="slider-block">
            <div className="slider-header">
              <span className="slider-label">Git</span>
              <span className="slider-value">{git}%</span>
            </div>
            <Slider
              value={git}
              onChange={handleSliderChange(setGit)}
              min={0}
              max={100}
              className="custom-slider"
              sx={{ mt: 1 }}
            />
          </div>
        </div>

        <p className="total-text">Total: {total}% (should equal 100%)</p>
      </div>
    </div>
  );
}
