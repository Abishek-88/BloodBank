const ChartBar = ({ data = [] }) => {
  const max = Math.max(...data.map((item) => Number(item.total)), 1);

  return (
    <div className="chart-bar">
      {data.map((item) => (
        <div key={item.urgency_level} className="chart-bar__item">
          <div
            className={`chart-bar__fill urgency-${item.urgency_level}`}
            style={{ height: `${(Number(item.total) / max) * 100}%` }}
          />
          <strong>{item.total}</strong>
          <span>{item.urgency_level}</span>
        </div>
      ))}
    </div>
  );
};

export default ChartBar;
