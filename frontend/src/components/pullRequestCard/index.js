import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./style.css";

const PullRequestCards = ({ username, token }) => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [username, token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const payload = {
        query: `List all the open and closed pull requests created by user '${username}' across all repositories they own.`,
        token: token || "", // Optional
      };

      const res = await axios.post("http://localhost:8000/ask", payload);
      setResponse(res.data.result);
    } catch (err) {
      console.error("Error:", err);
      setResponse("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const cardBlocks = response
    ?.trim()
    .split(/\n\s*\n/)
    .filter(Boolean);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
          fontFamily: "sans-serif",
          fontSize: 16,
          color: "#333",
        }}
      >
        <div className="loader"></div>
        Loading pull requests...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        padding: 20,
        width: "100%",
        overflowY: "scroll",
        maxHeight: 500,
      }}
    >
      {cardBlocks.map((block, idx) => (
        <div
          key={idx}
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 20,
            width: "100%",
            backgroundColor: "#fff",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            fontFamily: "sans-serif",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          <ReactMarkdown>{block}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
};

export default PullRequestCards;
