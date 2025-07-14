import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import "./style.css";

const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
  <div className="date-input-wrapper" onClick={onClick} ref={ref}>
    <input type="text" value={value} readOnly />
    <FaCalendarAlt className="calendar-icon" />
  </div>
));

export default CustomDateInput;
