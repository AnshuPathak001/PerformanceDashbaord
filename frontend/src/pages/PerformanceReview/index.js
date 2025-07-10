import { useState } from "react";
import Card from "../../components/card";
import { FaStar, FaClock, FaBolt, FaCode, FaCog } from "react-icons/fa";
import "./style.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Slider from "@mui/material/Slider";

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
    { score: "120h", label: "Billable Hours", icon: FaClock, color: "#2ecc71" },
    { score: "30", label: "Jira Velocity", icon: FaBolt, color: "#3498db" },
    { score: "18", label: "Git Activity", icon: FaCode, color: "#e67e22" },
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

      {/* Circular progress bar */}
<div className="progress-card">
  <div className="progress-bar-container">
    <CircularProgressbar
      value={score}
      text={`${score}%`}
      styles={buildStyles({
        textColor: "#333",
        pathColor: "#3498db",
        trailColor: "#eee",
      })}
    />
  </div>
</div>


      {/* Cards container */}
      <div className="performance-cards-container">
        {cardData.map((item, index) => (
          <Card
            key={index}
            score={item.score}
            label={item.label}
            Icon={item.icon}
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
      sx={{ mt: 1 }}
    />
  </div>
</div>



        <p className="total-text">Total: {total}% (should equal 100%)</p>
      </div>
    </div>
  );
}
