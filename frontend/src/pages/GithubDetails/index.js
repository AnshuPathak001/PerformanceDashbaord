import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import PullRequestCards from "../../components/pullRequestCard";

const GithubDetails = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/integrations");
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

      <PullRequestCards />
    </div>
  );
};

export default GithubDetails;
