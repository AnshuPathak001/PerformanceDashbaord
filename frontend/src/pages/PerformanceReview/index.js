import { useState, useEffect, useMemo } from "react";
import Card from "../../components/card";
import { FaStar, FaClock, FaBolt, FaCode, FaCog } from "react-icons/fa";
import "./style.css";
import "react-circular-progressbar/dist/styles.css";
import Slider from "@mui/material/Slider";
import ScoreCard from "../../components/performanceScoreCard";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function PerformanceReview() {
  const [year, setYear] = useState("2024");
  const [openAir, setOpenAir] = useState(25);
  const [jira, setJira] = useState(40);
  const [git, setGit] = useState(35);
  const [username, setUsername] = useState("");
  const total = openAir + jira + git;

  // Dummy metrics - replace with actual fetched scores
  const openAirScore = 85;
  const jiraScore = 92;
  const gitScore = 88;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.name) {
      setUsername(formatName(storedUser.name));
    }
  }, []);

  // Capitalize each word
  const formatName = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // AI-style score logic
  const score = useMemo(() => {
    const normalizedScore =
      (openAirScore * openAir + jiraScore * jira + gitScore * git) / total;
    return Math.round(normalizedScore);
  }, [openAir, jira, git]);

  const getPerformanceRemark = (score) => {
    if (score >= 90) return "Outstanding";
    if (score >= 75) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  const handleSliderChange = (setter) => (_, newValue) => {
    setter(newValue);
  };

  const generatePDF = async () => {
    const element = document.getElementById("pdf-report");
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Performance_Review_${year}.pdf`);
  };

  const cardData = [
    {
      score: openAirScore,
      label: "Billable Hours",
      icon: FaClock,
      color: "#2ecc71",
      weight: openAir,
      contributionPoints: Math.round((openAirScore / 100) * (openAir || 1)),
    },
    {
      score: jiraScore,
      label: "Jira Velocity",
      icon: FaBolt,
      color: "#3498db",
      weight: jira,
      contributionPoints: Math.round((jiraScore / 100) * (jira || 1)),
    },
    {
      score: gitScore,
      label: "Git Activity",
      icon: FaCode,
      color: "#e67e22",
      weight: git,
      contributionPoints: Math.round((gitScore / 100) * (git || 1)),
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
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
          <button className="generate-button" onClick={generatePDF}>
            Generate Review
          </button>
        </div>
      </div>

      {/* Performance Overview PDF Content */}
      <div
        id="pdf-report"
        style={{ padding: "20px 40px", backgroundColor: "#fff" }}
      >
        {/* Greeting */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontWeight: 600 }}>Hi {username},</h2>
          <p style={{ marginTop: 5, fontSize: 14, color: "#333" }}>
            Here's your performance report for the year {year}. This summary
            includes a breakdown of your productivity across OpenAir, Jira, and
            GitHub.
          </p>
        </div>

        {/* Circular Overall Score */}
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
                <div
                  style={{ fontSize: 24, fontWeight: "bold", color: "#111" }}
                >
                  {score}
                </div>
                <div style={{ fontSize: 14, color: "#555" }}>Overall Score</div>
                <div
                  style={{ fontSize: 14, color: "green", fontWeight: "bold" }}
                >
                  {getPerformanceRemark(score)}
                </div>
              </div>
            </CircularProgressbarWithChildren>
          </div>
        </div>

        {/* Metric Cards */}
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

        {/* Performance Summary for PDF */}
        <div
          style={{ marginTop: 30, padding: "10px", backgroundColor: "#f9f9f9" }}
        >
          <h3>Performance Summary</h3>
          <p>
            This employee achieved an overall performance score of{" "}
            <strong>{score}</strong>, which indicates{" "}
            <strong>{getPerformanceRemark(score)}</strong> performance in the
            year {year}.
          </p>
          <ul>
            <li>
              OpenAir Contribution: {openAir}% (Score: {openAirScore})
            </li>
            <li>
              Jira Contribution: {jira}% (Score: {jiraScore})
            </li>
            <li>
              Git Contribution: {git}% (Score: {gitScore})
            </li>
          </ul>
        </div>
      </div>

      {/* Weightage Configuration */}
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
              disabled
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
              disabled
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
              disabled
            />
          </div>
        </div>

        <p className="total-text">Total: {total}% (should equal 100%)</p>
      </div>
    </div>
  );
}
