import StatusBadge from "../common/StatusBadge.jsx";
import StepFlow from "../common/StepFlow.jsx";

const RequestTable = ({ requests, showCourier = true, showDeliveredAt = false }) => (
  <div className="request-table">
    <table className="data-table">
      <thead>
        <tr>
          <th>Request</th>
          <th>Urgency</th>
          <th>Status Flow</th>
          {showCourier ? <th>Assigned Courier</th> : null}
          {showDeliveredAt ? <th>Completed</th> : null}
        </tr>
      </thead>
      <tbody>
        {requests.map((request) => (
          <tr key={request.id}>
            <td>
              <div className="request-table__primary">
                <strong>{request.blood_group}</strong>
                <span>{request.units_needed} units</span>
              </div>
            </td>
            <td>
              <StatusBadge status={request.urgency_level} />
            </td>
            <td>
              <div className="request-table__status">
                <StatusBadge status={request.status} />
                <StepFlow status={request.status} />
              </div>
            </td>
            {showCourier ? (
              <td>
                {request.assignedCourier ? (
                  <div className="request-table__courier">
                    <strong>{request.assignedCourier.name}</strong>
                    <span>{request.assignedCourier.contact}</span>
                    <small>{request.assignedCourier.deliveryStatus}</small>
                  </div>
                ) : (
                  <span className="request-table__empty">Awaiting courier assignment</span>
                )}
              </td>
            ) : null}
            {showDeliveredAt ? (
              <td>{request.delivered_at ? new Date(request.delivered_at).toLocaleDateString() : "-"}</td>
            ) : null}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RequestTable;
