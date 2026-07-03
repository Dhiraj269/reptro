import React from 'react';
import { FiClock, FiTruck, FiZap } from 'react-icons/fi';

const DeliveryInfo = () => {
  return (
    <div className="delivery-info-section">
      <div className="delivery-info-item">
        <FiClock className="icon" size={16} />
        <span><strong>Normal Delivery:</strong> By 7 PM • ₹9 per 4 items</span>
      </div>
      <div className="delivery-info-item">
        <FiZap className="icon" size={16} />
        <span><strong>Fast Delivery:</strong> 30 minutes • ₹20 flat</span>
      </div>
      <div className="delivery-info-item">
        <FiTruck className="icon" size={16} />
        <span><strong>Sprouts:</strong> By 7 AM • FREE delivery 🌱</span>
      </div>
    </div>
  );
};

export default DeliveryInfo;