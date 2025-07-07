import Card from "../../components/card";
import { FaStar, FaClock, FaBolt, FaCode } from "react-icons/fa";
import "./dashboard.css";

export default function Dashboard() {
  const cardData = [
    { score: "85/100", label: "Overall Score", icon: FaStar, color: "#f1c40f" },
    { score: "8h", label: "Billable Hours", icon: FaClock, color: "#2ecc71" },
    { score: "24", label: "Jira Velocity", icon: FaBolt, color: "#3498db" },
    { score: "10", label: "Code Contribution", icon: FaCode, color: "#e67e22" },
  ];

  const activities = [
    {
      icon: FaCode,
      title: "Merged PR #234: Implement user authentication",
      subtitle: "2 hours ago",
    },
    {
      icon: FaBolt,
      title: "Completed PROJ-156: Database optimization",
      subtitle: "Yesterday",
    },
    {
      icon: FaStar,
      title: "Performance review scheduled for next week",
      subtitle: "3 days ago",
    },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard Overview</h1>
      <p className="dashboard-subtitle">
        Welcome back, Sarah! Here's your performance summary.
      </p>

      <div className="cards-container">
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

      <div className="bottom-cards-container">
        <div className="bottom-card">
          <h3>Recent Activities</h3>
          <ul className="activities-list">
            {activities.map((activity, idx) => (
              <li key={idx} className="activity-item">
                <div className="activity-icon-wrapper">
                  <activity.icon className="activity-icon" size={20} />
                </div>
                <div className="activity-texts">
                  <p className="activity-title">{activity.title}</p>
                  <p className="activity-subtitle">{activity.subtitle}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bottom-card">
          <h3>AI-Powered Insights</h3>
          <p style={{ marginTop: "10px", color: "grey" }}>
            Your productivity increased by 12% compared to last sprint. Keep it
            up!
          </p>
        </div>
      </div>
    </div>
  );
}
