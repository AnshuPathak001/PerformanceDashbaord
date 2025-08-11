import React, { useState, useEffect } from "react";
import "./style.css";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import CustomDateInput from "../../components/customDateInput/index";

const capitalizeFirst = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

const EmployeeProfile = () => {
  const [skills, setSkills] = useState([
    { name: "React", level: "Expert" },
    { name: "TypeScript", level: "Advanced" },
    { name: "Node.js", level: "Intermediate" },
    { name: "Python", level: "Beginner" },
  ]);

  const [newSkill, setNewSkill] = useState("");
  const [newLevel, setNewLevel] = useState("Beginner");
  const [goals, setGoals] = useState(
    "Improve code quality standards, mentor junior developers, and complete React certification."
  );
  const [role, setRole] = useState("");
  const [joinDate, setJoinDate] = useState(new Date());
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");
  const [manager, setManager] = useState("");
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      if (user.name) setName(capitalizeFirst(user.name));
      if (user.employeeId) setEmployeeId(user.employeeId);
      if (user.department) setDepartment(user.department);
      if (user.joinDate) setJoinDate(new Date(user.joinDate));
      if (user.manager) setManager(user.manager);
      if (user.role) setRole(user.role);
    }
  }, []);

  const handleAddSkill = () => {
    if (newSkill.trim() === "") return;
    setSkills([...skills, { name: newSkill.trim(), level: newLevel }]);
    setNewSkill("");
    setNewLevel("Beginner");
  };

  const handleRemoveSkill = (index) => {
    const updated = [...skills];
    updated.splice(index, 1);
    setSkills(updated);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setPhoto(previewURL);
    }
  };

  return (
    <div className="profile-container">
      <div className="dashboard-left">
        <h1 className="dashboard-title">My Profile</h1>
        <p className="dashboard-subtitle">
          Manage your personal and professional information
        </p>
      </div>

      <div className="section horizontal-section">
        <div className="profile-photo">
          {photo ? (
            <img src={photo} alt="Profile" className="photo-preview" />
          ) : (
            <div className="photo-placeholder">👤</div>
          )}

          <label className="upload-btn">
            Upload Photo
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: "none" }}
            />
          </label>
        </div>

        <div className="personal-info">
          <h3>Personal Information</h3>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(capitalizeFirst(e.target.value))}
            />
          </div>
          <div className="input-group">
            <label>Employee ID</label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="section">
        <h3>Role Details</h3>
        <div className="role-details">
          <div className="input-group">
            <label>Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {[department, "Engineering", "Design", "Marketing"]
                .filter((v, i, a) => a.indexOf(v) === i)
                .map((dept, idx) => (
                  <option key={idx} value={dept}>
                    {dept}
                  </option>
                ))}
            </select>
          </div>

          <div className="input-group">
            <label>Role/Position</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Join Date</label>
            <DatePicker
              selected={joinDate}
              onChange={(date) => setJoinDate(date)}
              dateFormat="dd/MM/yyyy"
              customInput={<CustomDateInput />}
            />
          </div>

          <div className="input-group">
            <label>Direct Manager</label>
            <select
              value={manager}
              onChange={(e) => setManager(e.target.value)}
            >
              {[manager, "John Smith", "Jane Doe", "Michael Lee", "Priya Mehra"]
                .filter((v, i, a) => a.indexOf(v) === i)
                .map((mgr, idx) => (
                  <option key={idx} value={mgr}>
                    {mgr}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      <div className="section">
        <h3>Professional Goals</h3>
        <textarea
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          rows={3}
        />
      </div>

      <div className="section">
        <h3>Skills Matrix</h3>
        <div className="skills-input">
          <input
            type="text"
            placeholder="Add a skill..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
          <select
            value={newLevel}
            onChange={(e) => setNewLevel(e.target.value)}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Expert</option>
          </select>
          <button onClick={handleAddSkill}>Add</button>
        </div>

        <div className="skills-list">
          {skills.map((skill, index) => (
            <div
              key={index}
              className={`skill-tag ${skill.level.toLowerCase()}`}
            >
              {skill.name} <span className="level">({skill.level})</span>
              <button onClick={() => handleRemoveSkill(index)}>x</button>
            </div>
          ))}
        </div>
      </div>

      <button className="save-btn">Save Profile</button>
    </div>
  );
};

export default EmployeeProfile;
