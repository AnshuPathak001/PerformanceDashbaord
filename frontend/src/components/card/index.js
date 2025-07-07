import { FaStar } from "react-icons/fa";
import "./card.css";

export default function Card({ score = "50/100", label = "Overall score" }) {
  return (
    <div className="card">
      <FaStar size={24} color="#333" className="card-icon" />
      <p className="card-score">{score}</p>
      <p className="card-label">{label}</p>
    </div>
  );
}
