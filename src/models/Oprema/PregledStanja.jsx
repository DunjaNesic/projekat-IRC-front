import React, { useState, useEffect } from 'react';
import './pregledStanja.css';
import OpremaModal from './OpremaModal';

function PregledStanja() {
  const [sale, setSale] = useState([]);
  const [zaposleni, setZaposleni] = useState([]);
  const [zaduzenja, setZaduzenja] = useState([]);

  const [selectedProstorija, setSelectedProstorija] = useState(null);
  const [selectedZaposleni, setSelectedZaposleni] = useState(null);
  const [selectedCount, setSelectedCount] = useState(-1);
  const [oprema, setOprema] = useState([]);
  const [opremaZaSlanje, setOpremaZaSlanje] = useState();

  useEffect(() => {
    fetch('https://localhost:7296/Prostorija')
      .then(response => response.json())
      .then(data => setSale(data))
      .catch(error => console.error('Error fetching prostorije:', error));

      fetch('https://localhost:7296/Zaposleni')
      .then(response => response.json())
      .then(data => setZaposleni(data))
      .catch(error => console.error('Error fetching zaposleni:', error));

      fetch('https://localhost:7296/Oprema')
      .then(response => response.json())
      .then(data => setOprema(data))
      .catch(error => console.error('Error fetching oprema:', error));

      fetch('https://localhost:7296/Zaduzenje')
      .then(response => response.json())
      .then(data => setZaduzenja(data))
      .catch(error => console.error('Error fetching zaduzenja:', error));
  }, []);


  const handlePrikaziClick = (prostorija) => {
    console.log(prostorija);
    console.log(oprema);
    const filteredOprema = oprema.filter(item => item.prostorijaOznakaSale === prostorija.oznakaSale);
    console.log(filteredOprema);
    setOpremaZaSlanje(filteredOprema);
    setSelectedProstorija(prostorija);
  };

  const handlePrikaziClickZap = (zaposleni) => { 
    const filteredZaduzenja = zaduzenja.filter((zaduzenje) => zaduzenje.zaposleniID === zaposleni.zaposleniID);
  
    const serijskiBrojevi = filteredZaduzenja.map((zaduzenje) => zaduzenje.serijskiBrojOpreme);
  
    const filteredOprema = oprema.filter((item) => serijskiBrojevi.includes(item.serijskiBrojOpreme));
  
    setOpremaZaSlanje(filteredOprema);
    setSelectedZaposleni(zaposleni);
  };
  
  const handlePrikaziSvuOpremu = (oprema) => {
    const opremaCount = oprema.length;
    setSelectedCount(opremaCount);
    console.log(`Total number of items in oprema: ${opremaCount}`);
  };
  
  const handleCloseModal = () => {
    setSelectedProstorija(null);
    setSelectedZaposleni(null);
    setSelectedCount(-1);
  };

  return (
    <div className='wholePregledStanja'> 
    <div className='pregledStanja-wrapper'>
      <h2>PREGLED <br /> STANJA <br /> OPREME</h2>
        <div className='pomoc'>
      <table className='tabelaProstorija shad'>
        <tbody>
        <tr>
        <th colSpan={2}>PRIKAZ OPREME PO PROSTORIJAMA</th>
        </tr>
        </tbody>
        <tbody>
          {sale.map((sala) => (
            <tr key={sala.oznakaSale}>
              <td className='sala'>{sala.oznakaSale}</td>
              <td><button className='btnPrikazi' onClick={() => handlePrikaziClick(sala)}>Prikaži</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <table className='tabelaProstorija shad'>
        <tbody>
        <tr>
        <th colSpan={2}>PRIKAZ OPREME PO ZAPOSLENIMA</th>
        </tr>
        </tbody>
        <tbody>
          {zaposleni.map((zap) => (
            <tr key={zap.zaposleniID}>
              <td className='sala'>{zap.imePrezime}</td>
              <td><button className='btnPrikazi' onClick={() => handlePrikaziClickZap(zap)}>Prikaži</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
     
    </div>
    <table className='tabelaProstorija pt2 shad'>
      <tbody>
        <tr>
        <td>UKUPNA KOLICINA OPREME NA FAKULTETU</td>
        <td><button className='btnPrikazi' onClick={() => handlePrikaziSvuOpremu(oprema)}>Prikaži</button></td>
        </tr>
      </tbody>
    </table>
    {selectedProstorija && (
        <OpremaModal oprema={opremaZaSlanje} onClose={handleCloseModal} />
      )}
      {selectedZaposleni && (
        <OpremaModal oprema={opremaZaSlanje} onClose={handleCloseModal} />
      )}
       {selectedCount!=-1 && (
        <div className="oprema-modal count-modal">
        <h3>{selectedCount}</h3>
        <button onClick={handleCloseModal}>Close</button>
      </div>
      )}
    </div>
  );
}

export default PregledStanja;
