import StatusBadge from "../common/StatusBadge.jsx";

const DeliveriesTable = ({ deliveries, onDeliver, allowComplete = true }) => (
  <div className="request-table">
    <table className="data-table">
      <thead>
        <tr>
          <th>Request ID</th>
          <th>Courier</th>
          <th>Blood</th>
          <th>Status</th>
          <th>Urgency</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {deliveries.map((delivery) => (
          <tr key={delivery.id}>
            <td>#{delivery.request_id}</td>
            <td>
              <div className="request-table__courier">
                <strong>{delivery.courier_name}</strong>
                <span>{delivery.courier_contact}</span>
              </div>
            </td>
            <td>{delivery.blood_group} {delivery.component_type}</td>
            <td><StatusBadge status={delivery.status} /></td>
            <td><StatusBadge status={delivery.urgency_level} /></td>
            <td>
              {allowComplete && delivery.request_status !== "delivered" ? (
                <button
                  type="button"
                  className="ghost-button compact-button"
                  onClick={() => onDeliver(delivery.request_id)}
                >
                  Mark Delivered
                </button>
              ) : (
                <span className="request-table__empty">Completed</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DeliveriesTable;
