import Card from "../../components/card";
import "./dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard Overview</h1>
      <p className="dashboard-subtitle">
        Welcome back, Sarah! Here's your performance summary.
      </p>

      <div className="cards-container">
        {[1, 2, 3, 4].map((_, index) => (
          <Card key={index} />
        ))}
      </div>
    </div>
  );
}
