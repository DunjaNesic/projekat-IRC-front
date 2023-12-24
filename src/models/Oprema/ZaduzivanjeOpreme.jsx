import React from 'react'
import './zaduzivanjeOpreme.css';
import { useState, useEffect } from 'react';

function ZaduzivanjeOpreme() {

  const [zaposleni, setZaposleni] = useState([]);
  const [oprema, setOprema] = useState([]);
  const [showDefaultOption, setShowDefaultOption] = useState(true);
  const [opremaForCmb, setOpremaForCmb] = useState([]);
  const [rowwVersion, setRowVersion] = useState("");
  const [zaduzenja, setZaduzenja] = useState([]);
  const [selectedZaposleni, setSelectedZaposleni] = useState('');
  const [selectedOprema, setSelectedOprema] = useState('');
  const [buttonClickCount, setButtonClickCount] = useState(0);

    useEffect(() => {
        fetch('https://localhost:7286/Zaposleni')
          .then(response => response.json())
          .then(data => setZaposleni(data))
          .catch(error => console.error('Error fetching data for Zaposleni:', error));

          fetch('https://localhost:7286/Oprema')
          .then(response => response.json())
          .then(data => {setOprema(data)
            setOpremaForCmb(data.filter(item => item.status === 1))
          })
          .catch(error => console.error('Error fetching data for Oprema:', error));
      }, [buttonClickCount]);

      const handleSelectChangeZaposleni = (event) => {
        setShowDefaultOption(false);
        setSelectedZaposleni(event.target.value);
      };

      const handleSelectChangeOprema = (event) => {
        setShowDefaultOption(false);      
        setSelectedOprema(event.target.value);

        const selectedOpremaObject = oprema.find(op => op.serijskiBrojOpreme === event.target.value);
        if (selectedOpremaObject) {
          setRowVersion(selectedOpremaObject.rowVersion);
        } else {
          console.error('Selected Oprema not found');
        }
   
      console.log(selectedOpremaObject.rowVersion);
      };

      const handleZaduziClick = () => {  
        if (selectedZaposleni==null || selectedOprema == null) {
          console.error('Please select Zaposleni and Oprema before zaduzivanje.');
          return;
        }
      
        const zaduzenjeData = {
          datumZaduzivanja: new Date().toISOString(),
          zaposleniID: selectedZaposleni,
          serijskiBrojOpreme: selectedOprema,      
        };
      
        fetch('https://localhost:7286/Zaduzenje', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(zaduzenjeData),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            
            return fetch(`https://localhost:7286/Oprema/${selectedOprema}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ status: 2, rowVersion: rowwVersion}), 
            });
          })
          .then(statusUpdateResponse => {
            if (!statusUpdateResponse.ok) {
              throw new Error('Failed to update status of Oprema');
            }    
            setButtonClickCount((prevCount) => prevCount + 1);    
          })
          .catch(error => console.error('Error making POST request:', error));
      };


      useEffect(() => {
        fetch('https://localhost:7286/Zaduzenje')
          .then(response => response.json())
          .then(data => {
            const fetchDetails = data.map(zaduzenje => {
              const { datumZaduzivanja, zaposleniID, serijskiBrojOpreme } = zaduzenje;
      
              const fetchZaposleni = fetch(`https://localhost:7286/Zaposleni/${zaposleniID}`)
                .then(response => response.json())
                .then(zaposleniData => {
                  zaduzenje.imePrezime = zaposleniData.imePrezime;
                })
                .catch(error => console.error('Error fetching Zaposleni:', error));
      
              const fetchOprema = fetch(`https://localhost:7286/Oprema/${serijskiBrojOpreme}`)
                .then(response => response.json())
                .then(opremaData => {
                  zaduzenje.naziv = opremaData.naziv;
                  zaduzenje.prostorija = opremaData.prostorijaOznakaSale;
                })
                .catch(error => console.error('Error fetching Oprema:', error));
      
              return Promise.all([fetchZaposleni, fetchOprema])
                .then(() => zaduzenje)
                .catch(error => console.error('Error in Promise.all:', error));
            });
      
            Promise.all(fetchDetails)
              .then(zaduzenjeWithDetails => {
                setZaduzenja(zaduzenjeWithDetails);
              })
              .catch(error => console.error('Error in final Promise.all:', error));
          })
          .catch(error => console.error('Error fetching data for Zaduzenje:', error));
      }, [buttonClickCount]);
      

    
  return (
    <div className='zaduzivanjeWholeWrapper'>
        <div className="zaduzivanjeSmallerWrapper">
            <h2>ZADUZIVANJE OPREME</h2>
            <div className="zaduzivanje">
              <div className="zaposleni">
                <h4>ZAPOSLENI</h4>
          <select className='cmb' onChange={handleSelectChangeZaposleni}>
            {showDefaultOption && <option value="">Zaposleni</option>}
            {zaposleni.map(zap => (
              <option key={zap.zaposleniID} value={zap.zaposleniID}>
                {zap.imePrezime}
              </option>
            ))}
          </select>
              </div>
              <div className="oprema">
              <h4>OPREMA</h4>
          <select className='cmb' onChange={handleSelectChangeOprema}>
            {showDefaultOption && <option value="">Oprema</option>}
            {opremaForCmb.map(op => (
              <option key={op.serijskiBrojOpreme} value={op.serijskiBrojOpreme}>
                {op.naziv}
              </option>
            ))}
          </select>
              </div>
              <button className='btn btnZaduzi' onClick={handleZaduziClick}>ZADUŽI OVAJ PREDMET <br /> ZA OVOG ZAPOSLENOG</button>
            </div>
            <div className="infoZaduzenje">
            <table className='tabelaProstorija'>
  <thead>
    <tr>
      <th>Ime i prezime zaposlenog koji je zaduzio opremu</th>
      <th>Naziv zaduzene opreme</th>
      <th>Prostorija iz koje je zaduzena oprema</th>
      <th>Datum zaduzivanja</th>
    </tr>
  </thead>
  <tbody className='tabelica'>
  {zaduzenja.map((zaduzenje, index) => (
    <tr key={index}>     
      <td>{zaduzenje.imePrezime}</td>
      <td>{zaduzenje.naziv}</td>
      <td>{zaduzenje.prostorija}</td>
      <td>{zaduzenje.datumZaduzivanja}</td>
    </tr>
  ))}
</tbody>

</table>
        </div>
        </div>
       
    </div>
  )
}

export default ZaduzivanjeOpreme