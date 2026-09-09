import StatusBadge from "../common/StatusBadge.jsx";
import StepFlow from "../common/StepFlow.jsx";

const nextActionMap = {
  assigned: { label: "Pick Up", nextStatus: "picked_up" },
  picked_up: { label: "Start Delivery", nextStatus: "in_transit" },
  in_transit: { label: "Mark Delivered", nextStatus: "delivered" }
};

const CourierDeliveryTable = ({ deliveries, onUpdateStatus, locationMap, showActions = true }) => (
  <div className="request-table">
    <table className="data-table">
      <thead>
        <tr>
          <th>Request ID</th>
          <th>Blood</th>
          <th>Urgency</th>
          <th>Status</th>
          <th>Live Location</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {deliveries.map((delivery) => {
          const action = nextActionMap[delivery.status];
          const location = locationMap[delivery.id];

          return (
            <tr key={delivery.id}>
              <td>#{delivery.request_id}</td>
              <td>
                <div className="request-table__primary">
                  <strong>{delivery.blood_group} {delivery.component_type}</strong>
                  <span>{delivery.units_needed} units</span>
                </div>
              </td>
              <td><StatusBadge status={delivery.urgency_level} /></td>
              <td>
                <div className="request-table__status">
                  <StatusBadge status={delivery.status} />
                  <StepFlow status={delivery.status === "picked_up" ? "accepted" : delivery.status} />
                </div>
              </td>
              <td>
                {location ? `${location.latitude}, ${location.longitude}` : "Awaiting simulation"}
              </td>
              <td>
                {showActions && action ? (
                  <button
                    type="button"
                    className="ghost-button compact-button"
                    onClick={() => onUpdateStatus(delivery.id, action.nextStatus)}
                  >
                    {action.label}
                  </button>
                ) : (
                  <span className="request-table__empty">No further action</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default CourierDeliveryTable;
