import {
  FaClock,
  FaCheckCircle,
  FaSyncAlt,
  FaCog,
  FaPlus,
} from "react-icons/fa";
import "./style.css";
import { useNavigate } from "react-router-dom";

export default function Integrations() {
  const navigate = useNavigate(); // ✅ initialize navigate

  const goToGitHubDetails = () => {
    navigate("/github-details"); // ✅ programmatic navigation
  };

  const goToOpenAir = () => {
    navigate("/logtimesheet"); // ✅ programmatic navigation
  };

  return (
    <div className="integrations-container">
      {/* Header with title and button */}
      <div className="integration-header">
        <div>
          <h1 className="page-title">System Integrations</h1>
          <p className="page-description">
            Connect your tools to automatically track performance data
          </p>
        </div>
        <button className="add-integration-button">
          <FaPlus /> Add Integration
        </button>
      </div>

      {/* Connection Status */}
      <div className="status-container">
        <h2 className="section-title">Connection Status</h2>
        <div className="status-cards">
          <div className="status-card">
            <div className="status-value green">3</div>
            <div className="status-label">Connected</div>
          </div>
          <div className="status-card">
            <div className="status-value red">1</div>
            <div className="status-label">Disconnected</div>
          </div>
          <div className="status-card">
            <div className="status-value blue">5m</div>
            <div className="status-label">Last Sync</div>
          </div>
          <div className="status-card">
            <div className="status-value">98%</div>
            <div className="status-label">Sync Success</div>
          </div>
        </div>
      </div>

      {/* Tool Cards */}
      <div className="tools-grid">
        {/* OpenAir Timesheet */}
        <div className="tool-card" onClick={goToOpenAir}>
          <div className="tool-header">
            <div className="tool-icon green-bg">
              <FaClock />
            </div>
            <div className="tool-info">
              <h3 className="tool-name">OpenAir Timesheet</h3>
              <p className="tool-description">
                Track billable hours and project time
              </p>
            </div>
            <div className="tool-status connected">
              <FaCheckCircle /> Connected
            </div>
          </div>

          <div className="tool-stats">
            <div>
              <div className="label">Hours</div>
              <div className="value">152h this month</div>
            </div>
            <div>
              <div className="label">Projects</div>
              <div className="value">8</div>
            </div>
          </div>

          <div className="tool-footer">
            <div className="last-sync">Last sync: 2 hours ago</div>
            <div className="tool-actions">
              <FaSyncAlt className="action-icon" />
              <button className="disconnect-btn">Disconnect</button>
              <FaCog className="action-icon" />
            </div>
          </div>
        </div>

        {/* Jira Integration */}
        <div className="tool-card">
          <div className="tool-header">
            <div className="tool-icon green-bg">
              <FaCheckCircle />
            </div>
            <div className="tool-info">
              <h3 className="tool-name">Jira Integration</h3>
              <p className="tool-description">
                Project management and issue tracking
              </p>
            </div>
            <div className="tool-status connected">
              <FaCheckCircle /> Connected
            </div>
          </div>

          <div className="tool-stats">
            <div>
              <div className="label">Tickets</div>
              <div className="value">24 closed this sprint</div>
            </div>
            <div>
              <div className="label">Velocity</div>
              <div className="value">+12%</div>
            </div>
          </div>

          <div className="tool-footer">
            <div className="last-sync">Last sync: 15 minutes ago</div>
            <div className="tool-actions">
              <FaSyncAlt className="action-icon" />
              <button className="disconnect-btn">Disconnect</button>
              <FaCog className="action-icon" />
            </div>
          </div>
        </div>

        {/* Git Repository */}
        <div
          className="tool-card"
          onClick={goToGitHubDetails}
          style={{ cursor: "pointer" }}
        >
          <div className="tool-header">
            <div className="tool-icon green-bg">
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M17.707 9.293l-7-7a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L9 5.414V17a1 1 0 102 0V5.414l5.293 5.293a1 1 0 001.414-1.414z" />
              </svg>
            </div>
            <div className="tool-info">
              <h3 className="tool-name">Git Repository</h3>
              <p className="tool-description">Code commits and pull requests</p>
            </div>
            <div className="tool-status connected">
              <FaCheckCircle /> Connected
            </div>
          </div>

          <div className="tool-stats">
            <div>
              <div className="label">PRs</div>
              <div className="value">18 merged this month</div>
            </div>
            <div>
              <div className="label">Commits</div>
              <div className="value">156 commits</div>
            </div>
          </div>

          <div className="tool-footer">
            <div className="last-sync">Last sync: 5 minutes ago</div>
            <div className="tool-actions">
              <FaSyncAlt className="action-icon" />
              <button className="disconnect-btn">Disconnect</button>
              <FaCog className="action-icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
