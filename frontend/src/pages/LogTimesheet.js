"use client"

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";

export default function OpenAirAutomationBox() {
  const [email, setEmail] = useState("");
  const [statement, setStatement] = useState("");
  const [status, setStatus] = useState("");
  const [twoFACode, setTwoFACode] = useState("");
  const [loader, setLoader] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  const { data: session } = useSession();
  const abortControllerRef = useRef(null);
  const statusRef = useRef(null);

  // Auto-scroll console to bottom
  useEffect(() => {
    if (statusRef.current) {
      statusRef.current.scrollTop = statusRef.current.scrollHeight;
    }
  }, [status]);

  // Session से email set करें
  useEffect(() => {
    if (!email && session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [email, session?.user?.email]);

  // Component unmount पर request cancel करें
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        console.log("Component unmounting, aborting fetch request.");
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSubmit = async () => {
    // Cancel existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setLoader(true);
    setStatus("🚀 Initializing automation...");
    setTwoFACode("");
    setConnectionStatus("connecting");

    if (!statement.trim() || !email.trim()) {
      setStatus("❌ Please fill in all required fields.");
      setLoader(false);
      setConnectionStatus("disconnected");
      return;
    }

    const url = "http://localhost:5000/openair/fill-timesheet-stream";

    try {
      console.log("📡 Connecting to server...");
      setStatus(prev => prev + "\n📡 Connecting to server...");

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive"
        },
        body: JSON.stringify({
          email: email.trim(),
          statement: statement.trim(),
          password: ""
        }),
        signal: signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      setConnectionStatus("connected");
      console.log("✅ Response received, starting to read stream...");

      // **CRITICAL FIX**: Proper stream reading without early termination
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        let messageCount = 0;

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            console.log("✅ Stream completed naturally");
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          console.log("📦 Raw chunk received:", chunk);

          // Process each line in the chunk
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const message = line.slice(6).trim(); // Remove 'data: ' prefix
              if (!message) continue;

              messageCount++;
              console.log(`📥 Message ${messageCount}: ${message}`);

              // Handle different message types
              if (message.startsWith("2FA:")) {
                const code = message.replace("2FA:", "").trim();
                setTwoFACode(code);
                setStatus(prev => prev + `\n🔐 2FA Code: ${code}`);
              } else if (message === "DONE") {
                setStatus(prev => prev + `\n🎉 Automation finished successfully!`);
                setStatus(prev => prev + `\n📋 Total messages received: ${messageCount}`);
                console.log("🏁 Automation completed");
                setLoader(false);
                setConnectionStatus("completed");
                break; // Exit the loop on DONE
              } else if (message.includes("Connection established")) {
                setStatus("🔗 Connected to server successfully!");
                setConnectionStatus("connected");
              } else {
                // Add all messages to status
                setStatus(prev => prev + `\n${message}`);
              }
            }
          }

          // **IMPORTANT**: Small delay to prevent overwhelming the UI
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      } finally {
        reader.releaseLock();
      }

    } catch (err) {
      console.error("❌ Stream error:", err);

      if (err.name === 'AbortError') {
        setStatus(prev => prev + '\n⏹️ Operation cancelled by user.');
        setConnectionStatus("cancelled");
      } else {
        setStatus(prev => prev + `\n❌ Connection Error: ${err.message}`);
        setConnectionStatus("error");
      }
    } finally {
      setLoader(false);
      abortControllerRef.current = null;
    }
  };

  const stopAutomation = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setStatus(prev => prev + '\n🛑 Stopping automation...');
      setLoader(false);
      setConnectionStatus("cancelled");
    }
  };

  const clearForm = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setStatement("");
    setStatus("");
    setTwoFACode("");
    setLoader(false);
    setConnectionStatus("disconnected");
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connecting": return "text-yellow-600";
      case "connected": return "text-green-600";
      case "completed": return "text-blue-600";
      case "error": return "text-red-600";
      case "cancelled": return "text-gray-600";
      default: return "text-gray-400";
    }
  };

  const getConnectionStatusText = () => {
    return connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1);
  };

  return (
    <div className="openair-automation-container">
      <div className="automation-wrapper">
        {/* Header Section */}
        <div className="automation-header">
          <div className="header-icon">
            <span>🚀</span>
          </div>
          <div className="header-content">
            <h1 className="header-title">OpenAir Automation</h1>
            <p className="header-subtitle">
              Fill your Valtech timesheet using natural language + automation.
              Just describe your work and let AI handle the rest.
            </p>
            {/* Connection Status Indicator */}
            <div className={`connection-status ${getConnectionStatusColor()}`}>
              <span className="status-indicator"></span>
              Status: {getConnectionStatusText()}
            </div>
          </div>
        </div>

        {/* 2FA Code Display */}
        {twoFACode && (
          <div className="twofa-alert-card">
            <div className="twofa-icon">
              <span>🔐</span>
            </div>
            <div className="twofa-content">
              <h4 className="twofa-title">2FA Code Generated</h4>
              <p className="twofa-code">{twoFACode}</p>
              <p className="twofa-instruction">
                Enter this code in your Microsoft Authenticator app
              </p>
            </div>
          </div>
        )}

        {/* Main Form Card */}
        <div className="automation-card">
          <div className="card-header">
            <span className="card-header-icon">📋</span>
            <h2 className="card-header-title">Timesheet Information</h2>
          </div>

          <div className="card-content">
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📧</span>
                Microsoft Email
              </label>
              <input
                type="email"
                placeholder="Enter your Microsoft email address"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loader}
              />
            </div>

            {/* Work Description Field */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📝</span>
                Current Week Work Description
              </label>
              <textarea
                className="form-textarea"
                placeholder="Example: I worked on AI CoE on Monday and Tuesday for 8 hours for Development task, sustainability project on Wed/Thu for 8 hrs on sustainability task and on Friday, I was on sick leave."
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                rows={6}
                disabled={loader}
              />
              <p className="form-hint">
                <span className="hint-icon">💡</span>
                Describe your work in natural language - mention days, hours, projects, and tasks
              </p>
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button
                onClick={handleSubmit}
                disabled={loader}
                className={`btn btn-primary ${loader ? 'btn-loading' : ''}`}
              >
                {loader ? (
                  <div className="btn-loading-content">
                    <div className="spinner"></div>
                    Running Automation...
                  </div>
                ) : (
                  <div className="btn-content">
                    <span className="btn-icon">🚀</span>
                    Run Automation
                  </div>
                )}
              </button>

              {loader && (
                <button
                  onClick={stopAutomation}
                  className="btn btn-danger"
                >
                  <span className="btn-icon">⏹️</span>
                  Stop
                </button>
              )}

              <button
                onClick={clearForm}
                disabled={loader}
                className="btn btn-secondary"
              >
                <span className="btn-icon">🗑️</span>
                Clear Form
              </button>
            </div>
          </div>
        </div>

        {/* Status Display */}
        {status && (
          <div className="status-card">
            <div className="status-header">
              <span className="status-header-icon">📊</span>
              <h3 className="status-header-title">Live Status Feed</h3>
              <div className="status-header-actions">
                <button
                  onClick={() => setStatus("")}
                  className="clear-status-btn"
                  title="Clear Status"
                >
                  🗑️
                </button>
              </div>
            </div>

            <div className="status-content">
              <div className="status-console">
                <div className="console-header">
                  <div className={`console-indicator ${connectionStatus === 'connected' ? 'active' : ''}`}></div>
                  <span className="console-title">Live Status Feed</span>
                  <div className="console-actions">
                    <span className="console-lines">
                      Connection: {connectionStatus}
                    </span>
                  </div>
                </div>
                <pre
                  ref={statusRef}
                  className="console-content"
                >
                  {status}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="help-section">
          <h3 className="help-title">
            <span className="help-icon">📋</span>
            Instructions
          </h3>
          <div className="help-grid">
            <div className="help-item">
              <span className="help-number">1️⃣</span>
              <p>Enter your Microsoft email used for OpenAir login</p>
            </div>
            <div className="help-item">
              <span className="help-number">2️⃣</span>
              <p>Describe your work in natural language</p>
            </div>
            <div className="help-item">
              <span className="help-number">3️⃣</span>
              <p>Keep the browser window open during automation</p>
            </div>
            <div className="help-item">
              <span className="help-number">4️⃣</span>
              <p>Do not close the browser manually until completion</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .openair-automation-container {
          padding: 1.5rem;
          background: var(--bg-primary, #f8fafc);
          min-height: 100%;
          transition: all 0.3s ease;
        }

        .automation-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Header Section */
        .automation-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: var(--card-bg, #ffffff);
          border-radius: 12px;
          box-shadow: var(--shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.1));
          border: 1px solid var(--border-color, #e2e8f0);
        }

        .header-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          border-radius: 12px;
          font-size: 1.5rem;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .header-content {
          flex: 1;
        }

        .header-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--text-primary, #1e293b);
          margin: 0 0 0.25rem 0;
        }

        .header-subtitle {
          font-size: 1rem;
          color: var(--text-secondary, #64748b);
          margin: 0 0 0.5rem 0;
          line-height: 1.5;
        }

        /* Connection Status */
        .connection-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
        }

        .text-yellow-600 { color: #d97706; }
        .text-green-600 { color: #059669; }
        .text-blue-600 { color: #2563eb; }
        .text-red-600 { color: #dc2626; }
        .text-gray-600 { color: #4b5563; }
        .text-gray-400 { color: #9ca3af; }

        /* 2FA Alert Card */
        .twofa-alert-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          border: 2px solid #f59e0b;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .twofa-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: #f59e0b;
          border-radius: 50%;
          font-size: 1.25rem;
        }

        .twofa-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #92400e;
          margin: 0 0 0.25rem 0;
        }

        .twofa-code {
          font-size: 1.5rem;
          font-weight: 700;
          font-family: 'Courier New', monospace;
          color: #b45309;
          margin: 0 0 0.25rem 0;
        }

        .twofa-instruction {
          font-size: 0.875rem;
          color: #92400e;
          margin: 0;
        }

        /* Main Card */
        .automation-card {
          background: var(--card-bg, #ffffff);
          border-radius: 16px;
          box-shadow: var(--shadow-lg, 0 10px 25px rgba(0, 0, 0, 0.1));
          border: 1px solid var(--border-color, #e2e8f0);
          overflow: hidden;
        }

        .card-header {
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .card-header-icon {
          font-size: 1.25rem;
        }

        .card-header-title {
          color: white;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }

        .card-content {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Form Elements */
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary, #374151);
        }

        .label-icon {
          font-size: 1rem;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid var(--border-color, #d1d5db);
          border-radius: 10px;
          font-size: 0.875rem;
          background: var(--input-bg, #f9fafb);
          color: var(--text-primary, #111827);
          transition: all 0.2s ease;
          resize: vertical;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          background: var(--card-bg, #ffffff);
        }

        .form-input:disabled, .form-textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-hint {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: var(--text-secondary, #6b7280);
          margin-top: 0.25rem;
        }

        .hint-icon {
          font-size: 0.875rem;
        }

        /* Buttons */
        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }

        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.875rem 1.5rem;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          text-decoration: none;
        }

        .btn-primary {
          flex: 1;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          min-width: 200px;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .btn-danger {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .btn-danger:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
        }

        .btn-secondary {
          background: var(--gray-200, #e5e7eb);
          color: var(--text-primary, #374151);
        }

        .btn-secondary:hover:not(:disabled) {
          background: var(--gray-300, #d1d5db);
        }

        .btn-content, .btn-loading-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-icon {
          font-size: 1rem;
        }

        .spinner {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Status Card */
        .status-card {
          background: var(--card-bg, #ffffff);
          border-radius: 16px;
          box-shadow: var(--shadow-lg, 0 10px 25px rgba(0, 0, 0, 0.1));
          border: 1px solid var(--border-color, #e2e8f0);
          overflow: hidden;
        }

        .status-header {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .status-header-icon {
          font-size: 1.25rem;
        }

        .status-header-title {
          color: white;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
          flex: 1;
        }

        .status-header-actions {
          display: flex;
          gap: 0.5rem;
        }

        .clear-status-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          padding: 0.5rem;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .clear-status-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .status-content {
          padding: 1.5rem;
        }

        /* Console */
        .status-console {
          background: #1a1a1a;
          border-radius: 12px;
          overflow: hidden;
        }

        .console-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: #2d2d2d;
        }

        .console-indicator {
          width: 12px;
          height: 12px;
          background: #6b7280;
          border-radius: 50%;
          transition: all 0.3s;
        }

        .console-indicator.active {
          background: #10b981;
          animation: pulse 2s infinite;
        }

        .console-title {
          color: #10b981;
          font-size: 0.875rem;
          font-weight: 600;
          flex: 1;
        }

        .console-actions {
          display: flex;
          gap: 1rem;
        }

        .console-lines {
          color: #6b7280;
          font-size: 0.75rem;
        }

        .console-content {
          padding: 1.5rem;
          color: #10b981;
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
          line-height: 1.6;
          white-space: pre-wrap;
          max-height: 400px;
          overflow-y: auto;
          margin: 0;
          scroll-behavior: smooth;
        }

        /* Custom scrollbar for console */
        .console-content::-webkit-scrollbar {
          width: 8px;
        }

        .console-content::-webkit-scrollbar-track {
          background: #2d2d2d;
        }

        .console-content::-webkit-scrollbar-thumb {
          background: #10b981;
          border-radius: 4px;
        }

        .console-content::-webkit-scrollbar-thumb:hover {
          background: #059669;
        }

        /* Help Section */
        .help-section {
          background: var(--card-bg, #ffffff);
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid var(--border-color, #e2e8f0);
        }

        .help-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary, #1e293b);
          margin: 0 0 1rem 0;
        }

        .help-icon {
          font-size: 1.25rem;
        }

        .help-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }

        .help-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .help-number {
          font-size: 1.25rem;
        }

        .help-item p {
          font-size: 0.875rem;
          color: var(--text-secondary, #64748b);
          margin: 0;
          line-height: 1.5;
        }

        /* Dark theme support */
        .dark-theme .openair-automation-container {
          --bg-primary: #0f172a;
          --card-bg: #1e293b;
          --text-primary: #f1f5f9;
          --text-secondary: #94a3b8;
          --border-color: #334155;
          --input-bg: #334155;
          --gray-200: #475569;
          --gray-300: #64748b;
          --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
          --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        /* Animations */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .openair-automation-container {
            padding: 1rem;
          }

          .automation-header {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .header-title {
            font-size: 1.5rem;
          }

          .form-actions {
            flex-direction: column;
          }

          .btn {
            min-width: auto;
          }

          .help-grid {
            grid-template-columns: 1fr;
          }

          .twofa-alert-card {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  )
}
