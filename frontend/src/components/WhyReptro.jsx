import React from 'react';

const whyCards = [
  {
    icon: '⚡',
    title: 'Super Fast Delivery',
    desc: 'Get your essentials delivered in 10-30 minutes right at your hostel door.'
  },
  {
    icon: '💰',
    title: 'Student-Friendly Prices',
    desc: 'We understand student budgets. Enjoy the best prices on campus.'
  },
  {
    icon: '📦',
    title: '1000+ Products',
    desc: 'From groceries to medicines, snacks to stationery — we have it all.'
  },
  {
    icon: '🕐',
    title: 'Morning Fresh Sprouts',
    desc: 'Start your day healthy with fresh sprouts delivered by 7 AM daily.'
  },
  {
    icon: '🎓',
    title: 'Built for Students',
    desc: 'By college students, for college students. We get your needs.'
  },
  {
    icon: '💚',
    title: 'Quality Guaranteed',
    desc: 'Every product is quality-checked before delivery. Always fresh.'
  }
];

const WhyReptro = () => {
  return (
    <section className="why-reptro-section">
      <h2 className="why-reptro-title">Why Reptro?</h2>
      <p className="why-reptro-subtitle">What makes us the go-to choice for campus delivery</p>
      <div className="why-reptro-grid">
        {whyCards.map((card, index) => (
          <div key={index} className="why-card">
            <div className="why-card-icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyReptro;