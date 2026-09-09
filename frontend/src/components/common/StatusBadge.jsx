const StatusBadge = ({ status }) => (
  <span className={`status-badge ${String(status).toLowerCase()}`}>{status}</span>
);

export default StatusBadge;