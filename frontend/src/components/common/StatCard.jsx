const StatCard = ({ label, value, accent = "red" }) => (
  <article className={`stat-card accent-${accent}`}>
    <p className="stat-card__label">{label}</p>
    <strong>{value}</strong>
    <span className="stat-card__trend">Live operational snapshot</span>
  </article>
);

export default StatCard;
