const steps = ["pending", "accepted", "dispatched", "delivered"];

const StepFlow = ({ status }) => {
  const currentIndex = steps.indexOf(String(status).toLowerCase());

  return (
    <div className="step-flow">
      {steps.map((step, index) => (
        <div key={step} className={`step-flow__item ${index <= currentIndex ? "is-active" : ""}`}>
          <span className="step-flow__dot" />
          <small>{step}</small>
        </div>
      ))}
    </div>
  );
};

export default StepFlow;
