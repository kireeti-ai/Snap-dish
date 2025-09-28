import React from 'react';
import './OrderStatusTracker.css';
import { FaCheckCircle, FaBoxOpen, FaTruck, FaHome } from 'react-icons/fa';

const OrderStatusTracker = ({ status }) => {
  const steps = [
    { name: 'Order Placed', icon: <FaCheckCircle /> },
    { name: 'Preparing', icon: <FaBoxOpen /> },
    { name: 'Out for Delivery', icon: <FaTruck /> },
    { name: 'Delivered', icon: <FaHome /> },
  ];

  const currentStepIndex = steps.findIndex(step => step.name === status);

  return (
    <div className="status-tracker">
      {steps.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;
        
        let statusClass = '';
        if (isCompleted) statusClass = 'completed';
        if (isCurrent) statusClass = 'current';

        return (
          <React.Fragment key={step.name}>
            <div className={`step ${statusClass}`}>
              <div className="step-icon">{step.icon}</div>
              <div className="step-name">{step.name}</div>
            </div>
            {index < steps.length - 1 && <div className={`connector ${isCompleted || isCurrent ? 'completed' : ''}`}></div>}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default OrderStatusTracker;