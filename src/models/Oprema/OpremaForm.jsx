import React, { useState, useEffect } from 'react';
import './opremaForm.css';
import Confetti from 'react-confetti'

function OpremaForm() {
  const [formData, setFormData] = useState({
    serijskiBrojOpreme: '',
    inventarskiBroj: '',
    naziv: '',
    TipOpremeID: '',
    specs: '',
    ProstorijaOznakaSale: '',
  });

  const [tipOpremeOptions, setTipOpremeOptions] = useState([]);
  const [salaOptions, setSalaOptions] = useState([]);
  const [message, setMessage] = useState(null); 
  const [tipOpremeSelected, setTipOpremeSelected] = useState(true);
  const [salaSelected, setSalaSelected] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('https://localhost:7286/TipOpreme')
      .then((response) => response.json())
      .then((data) => setTipOpremeOptions(data))
      .catch((error) => console.error('Error fetching TipOpreme:', error));

    fetch('https://localhost:7286/Prostorija')
      .then((response) => response.json())
      .then((data) => setSalaOptions(data))
      .catch((error) => console.error('Error fetching prostorije:', error));

  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === 'TipOpremeID') setTipOpremeSelected(false);
    if (name === 'ProstorijaOznakaSale') setSalaSelected(false);

    let errorMessage = null;

    switch (name) {
      case 'serijskiBrojOpreme':   
         if (/\s/.test(value)) {
          errorMessage = 'Serijski broj ne sme sadržati razmake.';
        }
        break;

      case 'inventarskiBroj':
        if (/\s/.test(value)) {
          errorMessage = 'Inventarski broj ne sme sadržati razmake.';
        }
        break;

      case 'naziv':
        if (/\d/.test(value)) {
          errorMessage = 'Naziv ne sme sadržati brojeve.';
        }
        break;

      case 'specs':
        if (value.length < 4) {
          errorMessage = 'Opis mora biti duži od 3 karaktera.';
        }
        break;

      default:
        break;
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      [`error_${name}`]: errorMessage,
    }));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const requiredFields = ['serijskiBrojOpreme', 'inventarskiBroj', 'naziv', 'specs', 'TipOpremeID', 'ProstorijaOznakaSale'];
    const emptyField = requiredFields.find(field => !formData[field].trim());
  
    if (emptyField) {
      setMessage(`Polje "${emptyField}" ne sme biti prazno.`);
      return;
    }

    const apiUrl = 'https://localhost:7286/Oprema';
  
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          setSubmitted(false);
          throw new Error('Greška prilikom dodavanja opreme :(');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
        setMessage('Oprema uspešno dodata');
        setSubmitted(true);
      })
      .catch((error) => {
        console.error('Error:', error.message);
        setSubmitted(false);
        setMessage(error.message);
      });
  };
  

  return (
    <div className="form-container">
      <h2>
        FORMA ZA <br /> DODAVANJE OPREME
      </h2>
      <form className="form">
        <div className="field">
          <h5>SERIJSKI BROJ</h5>
          <input
            type="text"
            placeholder="Serijski broj opreme"
            className="form--input"
            name="serijskiBrojOpreme"
            onChange={handleChange}
            value={formData.serijskiBrojOpreme}
          />
        </div>

        <div className="field">
          <h5>INVENTARSKI BROJ</h5>
          <input
            type="text"
            placeholder="Inventarski broj opreme"
            className="form--input"
            name="inventarskiBroj"
            onChange={handleChange}
            value={formData.inventarskiBroj}
          />
        </div>

        <div className="field">
          <h5>NAZIV</h5>
          <input
            type="text"
            placeholder="Naziv predmeta"
            className="form--input"
            name="naziv"
            onChange={handleChange}
            value={formData.naziv}
          />
        </div>

        <div className="field">
          <h5>OPIS</h5>
          <input
            type="text"
            placeholder="Opis..."
            className="form--input"
            name="specs"
            onChange={handleChange}
            value={formData.specs}
          />
        </div>

        <div className="field">
          <h5>TIP OPREME</h5>
          <select
            name="TipOpremeID"
            className="form--input tipOpreme-cmb"
            onChange={handleChange}
            value={formData.TipOpremeID}
          >
            {tipOpremeSelected && <option value="">Izaberi tip opreme</option>}
            {tipOpremeOptions.map((option) => (
              <option key={option.tipOpremeID} value={option.tipOpremeID}>
                {option.nazivTipaOpreme}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <h5>SMEŠTA SE U SALU</h5>
          <select
            name="ProstorijaOznakaSale"
            className="form--input prostorija-cmb"
            onChange={handleChange}
            value={formData.ProstorijaOznakaSale}
          >
            {salaSelected && <option value="">Izaberi salu</option>}
            {salaOptions.map((option) => (
              <option key={option.oznakaSale} value={option.oznakaSale}>
                {option.oznakaSale}
              </option>
            ))}
          </select>
        </div>

        {Object.entries(formData).map(([key, value]) => {
  if (key.startsWith('error_') && value) {
    const fieldName = key.replace('error_', ''); 
    return (
      <span key={fieldName} className="error-message">
        {value}
      </span>
    );
  }
  return null;
})}
      </form>
     <div className="message">
  {message && <p className={message.includes('uspešno') ? 'success-message' : 'error-message2'}>{message}</p>}
  {submitted && message && message.includes('uspešno') && !Object.entries(formData).some(([key, value]) => key.startsWith('error_') && value) && <Confetti/> }
</div>
      <button className="form-submit" onClick={handleSubmit}>
        DODAJ
      </button>
   
    </div>
  );
}

export default OpremaForm;
