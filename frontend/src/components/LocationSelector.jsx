import React, { useState, useEffect } from 'react';
import { FiMapPin, FiChevronDown, FiLock } from 'react-icons/fi';
import { locationAPI, authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LocationSelector = () => {
  const { user, updateUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('GEC Arwal');

  useEffect(() => { fetchLocations(); }, []);
  useEffect(() => { if (user?.selectedLocation) setSelectedLocation(user.selectedLocation); }, [user]);

  const fetchLocations = async () => {
    try { const { data } = await locationAPI.getAll(); setLocations(data); }
    catch (e) {
      setLocations([
        { _id: '1', name: 'GEC Arwal', isActive: true, isDefault: true },
        { _id: '2', name: 'Arwal Town', isActive: false },
        { _id: '3', name: 'Polytechnic Arwal', isActive: false }
      ]);
    }
  };

  const handleSelect = async (loc) => {
    if (!loc.isActive) return;
    setSelectedLocation(loc.name);
    if (user) {
      try {
        const { data } = await authAPI.updateProfile({
          selectedLocation: loc.name,
          deliveryAddress: loc.name
        });
        updateUser(data);
        toast.success('Delivery address: ' + loc.name);
      } catch (e) {
        updateUser({ selectedLocation: loc.name, deliveryAddress: loc.name });
      }
    }
    setShowModal(false);
  };

  return (
    <>
      <div className="location-bar">
        <div className="location-content">
          <div className="location-info">
            <FiMapPin className="location-pin" size={18} />
            <div><div className="location-label">Delivering to</div><div className="location-name">{selectedLocation}</div></div>
          </div>
          <button className="location-change-btn" onClick={() => setShowModal(true)}>Change <FiChevronDown size={16} /></button>
        </div>
      </div>
      {showModal && (
        <div className="location-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="location-modal" onClick={e => e.stopPropagation()}>
            <h3>📍 Select Delivery Location</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Your delivery address will be set to selected location
            </p>
            {locations.map(loc => (
              <div key={loc._id} className={`location-item ${loc.name === selectedLocation ? 'active' : ''} ${!loc.isActive ? 'locked' : ''}`} onClick={() => handleSelect(loc)}>
                <div className="location-item-name"><FiMapPin size={16} />{loc.name}{!loc.isActive && <FiLock className="lock-icon" size={14} />}</div>
                {!loc.isActive && <span className="coming-soon-badge">Coming Soon</span>}
                {loc.name === selectedLocation && loc.isActive && <span style={{ color: '#e87b35', fontWeight: 700, fontSize: 13 }}>✓</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default LocationSelector;