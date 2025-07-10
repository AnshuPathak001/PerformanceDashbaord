import "./style.css";

export default function Card({
  score = "50/100",
  label = "Overall score",
  Icon,
  color = "#333",
}) {
  // Create a transparent background color using the icon color with opacity
  const backgroundColor = `${color}20`; // e.g., #3498db20 for a light blue (hex with alpha)

  return (
    <div className="card">
      {Icon && (
        <div className="icon-wrapper" style={{ backgroundColor }}>
          <Icon size={20} color={color} />
        </div>
      )}
      <p className="card-score">{score}</p>
      <p className="card-label">{label}</p>
    </div>
    );
// end
}
