import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import PullRequestCards from "../../components/pullRequestCard";

const GithubDetails = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [submittedData, setSubmittedData] = useState(null);

  const goBack = () => {
    navigate("/integrations");
  };

  const handleSubmit = () => {
    if (!username.trim()) {
      alert("Please enter your GitHub username.");
      return;
    }

    setSubmittedData({ username: username.trim(), token: token.trim() });
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
        <FaArrowLeft
          size={20}
          style={{ cursor: "pointer", marginRight: 10 }}
          onClick={goBack}
        />
        <h2 style={{ margin: 0 }}>My GitHub Pull Requests Details</h2>
      </div>

      <div style={{ marginBottom: 30 }}>
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 15,
            borderRadius: 8,
            border: "1px solid #ccc",
            fontSize: 14,
          }}
        />
        <input
          type="text"
          placeholder="Enter GitHub token (optional)"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc",
            fontSize: 14,
          }}
        />
        <div style={{ fontSize: 12, marginTop: 5, color: "#666" }}>
          * Optional token. If provided, private repositories belonging to the
          token’s GitHub account will also be shown.
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            onClick={handleSubmit}
            style={{
              padding: "10px 30px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </div>
      </div>

      {submittedData && (
        <PullRequestCards
          username={submittedData.username}
          token={submittedData.token}
        />
      )}
    </div>
  );
};

export default GithubDetails;
