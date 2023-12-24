import React, { useState, useEffect } from 'react';
import OpremaCard from './OpremaCard';
import slicica from './slicica.png';
import './pretragaOpreme.css';

function PretragaOpreme() {
  const [searchQuery, setSearchQuery] = useState('');
  const [oprema, setOprema] = useState([]);
  const [originalOprema, setOriginalOprema] = useState([]);
  const [tipOpremeOptions, setTipOpremeOptions] = useState([]);

  useEffect(() => {
    fetch('https://localhost:7286/Oprema')
      .then(response => response.json())
      .then(data => {
        setOprema(data);
        setOriginalOprema(data);
      })
      .catch(error => console.error('Error fetching data for tipoviOpreme:', error));

    fetch('https://localhost:7286/TipOpreme')
      .then(response => response.json())
      .then(data => setTipOpremeOptions(data))
      .catch(error => console.error('Error fetching TipOpreme:', error));
  }, []);

  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    const filteredOprema = originalOprema.filter(
      opremaItem => opremaItem.naziv.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setOprema(filteredOprema);
  };

  const getStatusString = status => {
    switch (status) {
      case 1:
        return 'Raspolozivo';
      case 2:
        return 'Zauzeto';
      case 3:
        return 'U kvaru';
      default:
        return 'Unknown';
    }
  };

  function getUniqueValues(arr) {
    return [...new Set(arr)];
  }

  function handleChange(event) {
    const { name, value } = event.target;
    console.log(event.target.value);
  
    switch (name) {
      case 'Status':
        if (value === '') {
          setOprema(originalOprema);
        } else {
          const filteredOprema = originalOprema.filter(
            opremaItem => String(getStatusString(opremaItem.status)).toLowerCase() === String(value).toLowerCase()
          );
          setOprema(filteredOprema);
        }
        break;
  
        case 'TipOpreme':
      if (value === '') {
        setOprema(originalOprema);
      } else {
        const filteredOprema = originalOprema.filter(
          opremaItem => opremaItem.tipOpremeID === parseInt(value, 10)
        );
        setOprema(filteredOprema);
      }
      break;
  
      case 'InventarskiBroj':
        if (value === '') {
          setOprema(originalOprema);
        } else {
          const filteredOprema = originalOprema.filter(
            opremaItem => String(opremaItem.inventarskiBroj).toLowerCase() === String(value).toLowerCase()
          );
          setOprema(filteredOprema);
        }
        break;
      default:
        break;
    }
  }
  

  return (
    <div className="pretraga-wrapper">
      <div className="search-part">
        <h2>
          PRETRAŽI OPREMU <br /> PO NAZIVU/FILTERU
        </h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button className="btn" onClick={handleSearch}>
            Pretraži
          </button>
        </div>
      </div>
      <div className="filteri">
        <select
          name="Status"
          className="form--input prostorija-cmb btn even"
          onChange={handleChange}
        >
          <option value="">STATUS</option>
          {getUniqueValues(oprema.map(option => getStatusString(option.status))).map(status => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          name="TipOpreme"
          className="form--input prostorija-cmb btn odd"
          onChange={handleChange}
        >
          <option value="">TIP OPREME</option>
          {tipOpremeOptions.map(option => (
            <option key={option.tipOpremeID} value={option.tipOpremeID}>
              {option.nazivTipaOpreme}
            </option>
          ))}
        </select>

        <select
          name="InventarskiBroj"
          className="form--input prostorija-cmb btn even"
          onChange={handleChange}
        >
          <option value="">INVENTARSKI BROJ</option>
          {getUniqueValues(oprema.map(option => option.inventarskiBroj)).map(inventarskiBroj => (
            <option key={inventarskiBroj} value={inventarskiBroj}>
              {inventarskiBroj}
            </option>
          ))}
        </select>
      </div>
      <div className="cards">
        {oprema.map(opremaItem => (
          <OpremaCard
            key={opremaItem.serijskiBrojOpreme}
            title={opremaItem.naziv}
            content={opremaItem.specs}
            image={slicica}
            serijskiBroj={opremaItem.serijskiBrojOpreme}
            inventarskiBroj={opremaItem.inventarskiBroj}
          />
        ))}
      </div>
    </div>
  );
}

export default PretragaOpreme;
