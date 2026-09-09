const InventoryTable = ({ inventory, onUpdate }) => (
  <div className="request-table">
    <table className="data-table">
      <thead>
        <tr>
          <th>Blood Group</th>
          <th>Component</th>
          <th>Units Available</th>
          <th>Reserved Units</th>
          <th>Free Units</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {inventory.map((item) => (
          <tr key={`${item.blood_group}-${item.component_type}`}>
            <td>{item.blood_group}</td>
            <td>{item.component_type}</td>
            <td>{item.units_available}</td>
            <td>{item.reserved_units}</td>
            <td>{item.available_units}</td>
            <td>
              <button
                type="button"
                className="ghost-button compact-button"
                onClick={() =>
                  onUpdate({
                    bloodGroup: item.blood_group,
                    componentType: item.component_type,
                    unitsAvailable: item.units_available + 1,
                    reservedUnits: item.reserved_units
                  })
                }
              >
                Add Unit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default InventoryTable;
