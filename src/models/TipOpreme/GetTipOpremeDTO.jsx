import React from 'react'
import { useState, useEffect } from 'react';

function GetTipOpremeDTO() {

    const [tipoviOpreme, setTipoviOpreme] = useState([]);
    const [showDefaultOption, setShowDefaultOption] = useState(true);

    useEffect(() => {
        fetch('https://localhost:7286/TipOpreme')
          .then(response => response.json())
          .then(data => setTipoviOpreme(data))
          .catch(error => console.error('Error fetching data for tipoviOpreme:', error));
      }, []);

      const handleSelectChange = () => {
        setShowDefaultOption(false);
      };

      return (
        <div>
          <h1>Tipovi Opreme</h1>
          <label htmlFor="tipOpremeComboBox">Izaberi tip opreme:</label>
          <select id="tipOpremeComboBox" onChange={handleSelectChange}>
            {showDefaultOption && <option value="">Tipovi opreme</option>}
            {tipoviOpreme.map(tipOpreme => (
              <option key={tipOpreme.tipOpremeID} value={tipOpreme.nazivTipaOpreme}>
                {tipOpreme.nazivTipaOpreme}
              </option>
            ))}
          </select>
        </div>
      );
}

export default GetTipOpremeDTO

