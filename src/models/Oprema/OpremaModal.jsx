import React from 'react';
import './opremaModal.css';

function OpremaModal({ oprema, onClose }) {
  return (
    <div className="oprema-modal">
      {oprema.map((item) => (
        <div key={item.serijskiBrojOpreme}>
          <h3>Serijski broj: {item.serijskiBrojOpreme}</h3>
          <ul>
            <li>Naziv: {item.naziv}</li>
          </ul>
        </div>
      ))}
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default OpremaModal;
