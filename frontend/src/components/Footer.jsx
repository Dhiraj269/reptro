import React from 'react';
import { FaInstagram, FaFacebookF, FaWhatsapp, FaLinkedinIn } from 'react-icons/fa';
import { FiPhone, FiMapPin, FiClock } from 'react-icons/fi';

const Footer = () => (
  <footer className="footer-new">
    <div className="footer-new-container">
      <div className="footer-top">
        <div className="footer-brand-new">
          <h2>Reptro</h2>
          <p>Daily essentials delivered to your campus</p>
        </div>
        <div className="footer-socials-new">
          <a href="https://www.instagram.com/reptroindia?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="footer-social-btn" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          <a href="https://www.facebook.com/profile.php?id=61590202431796" className="footer-social-btn" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
          <a href="https://whatsapp.com/channel/0029Vb7oXqnBFLgPLoHWme3G" className="footer-social-btn" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
          <a href="https://www.linkedin.com/company/reptro/" className="footer-social-btn" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
        </div>
      </div>

      <div className="footer-cols">
        <div className="footer-col">
          <h4>Links</h4>
          <a href="/">Home</a>
          <a href="/#search">Search</a>
          <a href="/#products">Products</a>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <a href="/category/fruits-and-vegetables">Vegetables</a>
          <a href="/category/dairy-and-eggs">Dairy</a>
          <a href="/category/snacks-and-fast-food">Snacks</a>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <a href="tel:+919279167527"><FiPhone size={10} /> +91 92791 67527</a>
          <a href="https://wa.me/919279167527"><FaWhatsapp size={10} /> WhatsApp</a>
          <p><FiMapPin size={10} /> GEC Arwal</p>
        </div>
      </div>

      <div className="footer-bottom-new">
        <p>© 2024 Reptro India • Made with ❤️ for students</p>
      </div>
    </div>
  </footer>
);

export default Footer;