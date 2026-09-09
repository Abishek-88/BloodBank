import StatusBadge from "../common/StatusBadge.jsx";

const RequestCard = ({ request }) => (
  <article className="request-card">
    <div className="request-card__header">
      <div>
        <p className="eyebrow">{request.hospital_name || request.organization_name || "Active request"}</p>
        <h3>{request.blood_group} {request.component_type}</h3>
      </div>
      <StatusBadge status={request.status || request.urgency_level} />
    </div>
    <p className="request-card__units">{request.units_needed || request.unitsAvailable} units</p>
    <div className="request-card__meta">
      <small>Priority: {request.urgency_level || "live stock"}</small>
      <small>Updated just now</small>
    </div>
  </article>
);

export default RequestCard;
