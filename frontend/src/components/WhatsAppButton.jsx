import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { getWhatsAppURL } from '../utils/helpers';

const WhatsAppButton = () => {
  return (
    <a
      href={getWhatsAppURL()}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      title="Chat on WhatsApp"
    >
      <FaWhatsapp />
    </a>
  );
};

export default WhatsAppButton;