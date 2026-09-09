import StatusBadge from "../common/StatusBadge.jsx";

const IncomingRequestTable = ({ requests, inventoryIndex, onAccept, onReject }) => (
  <div className="request-table">
    <table className="data-table">
      <thead>
        <tr>
          <th>Hospital</th>
          <th>Blood Group</th>
          <th>Units</th>
          <th>Urgency</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((request) => {
          const key = `${request.blood_group}-${request.component_type}`;
          const available = inventoryIndex[key]?.available_units ?? 0;
          const canAccept = available >= request.units_needed;

          return (
            <tr key={request.id}>
              <td>{request.hospital_name || `Request #${request.id}`}</td>
              <td>{request.blood_group} {request.component_type}</td>
              <td>{request.units_needed}</td>
              <td><StatusBadge status={request.urgency_level} /></td>
              <td><StatusBadge status={request.status} /></td>
              <td>
                <div className="inline-actions">
                  <button
                    type="button"
                    className="ghost-button compact-button"
                    disabled={!canAccept}
                    onClick={() => onAccept(request.id)}
                  >
                    {canAccept ? "Accept" : "Insufficient Stock"}
                  </button>
                  <button
                    type="button"
                    className="ghost-button compact-button compact-button--muted"
                    onClick={() => onReject(request.id)}
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default IncomingRequestTable;
