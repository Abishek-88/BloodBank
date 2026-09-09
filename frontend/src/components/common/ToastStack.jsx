const ToastStack = ({ notifications, onDismiss }) => (
  <div className="toast-stack">
    {notifications.map((notification) => (
      <div
        key={notification.id}
        className={`toast-item toast-item--${notification.type || "info"}`}
      >
        <div>
          <strong>Hospital alert</strong>
          <p>{notification.message}</p>
        </div>
        <button type="button" className="toast-close" onClick={() => onDismiss(notification.id)}>
          x
        </button>
      </div>
    ))}
  </div>
);

export default ToastStack;
