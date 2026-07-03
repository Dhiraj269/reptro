import React from 'react';
import { FaLinkedinIn, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const founders = [
  {
    name: 'Aditya Kumar',
    role: 'Co-Founder & CEO',
    desc: 'Turning bold ideas into reality. Building Reptro into a trusted platform.',
    image: '/images/aditya.jpg',
    linkedin: 'https://www.linkedin.com/in/aditya7667?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    instagram: 'https://www.instagram.com/_aditya_7667?igsh=NDZkbHRpNjF3cHNm'
  },
  {
    name: 'Dhiraj Kumar',
    role: 'Co-Founder & CTO',
    desc: 'Leading technology and product development. Turning ideas into solutions.',
    image: '/images/dhiraj.jpg',
    linkedin: 'https://www.linkedin.com/in/dhiraj-kumar-57926b404?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    instagram: 'https://www.instagram.com/_dhiraj999_?igsh=MWd2djBybWswb29haA=='
  }
];

const Founders = () => (
  <section className="founders-section">
    <div className="founders-content">
      <h2 className="founders-title">Meet the Team</h2>
      <p className="founders-subtitle">The people behind your daily essentials</p>
      <div className="founders-fixed-grid">
        {founders.map((f, i) => (
          <div key={i} className="founder-fixed-card">
            <img
              src={f.image}
              alt={f.name}
              className="founder-img"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="founder-img-fallback" style={{ display: 'none' }}>👤</div>
            <h3 className="founder-name">{f.name}</h3>
            <p className="founder-role">{f.role}</p>
            <p className="founder-desc">{f.desc}</p>
            <div className="founder-socials">
              <a href={f.linkedin} className="founder-social-btn" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
              <a href={f.instagram} className="founder-social-btn" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://wa.me/919279167527" className="founder-social-btn" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Founders;