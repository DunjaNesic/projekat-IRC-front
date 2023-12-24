import React, { useState, useEffect } from 'react'
import OpremaCard from './OpremaCard';

function GetOpremaDTO() {

    const [oprema, setOprema] = useState([]);

    useEffect(() => {
        fetch('https://localhost:7286/Oprema')
          .then(response => response.json())
          .then(data => setOprema(data))
          .catch(error => console.error('Error fetching data for tipoviOpreme:', error));
      }, []);

  return (
    <div>
        {oprema.map(oprema => (
              <OpremaCard key={oprema.serijskiBroj} title={oprema.naziv}
              content={oprema.specs} imageUrl={"https://platinumlist.net/guide/wp-content/uploads/2023/03/IMG-worlds-of-adventure.webp"}
              serijskiBroj={oprema.serijskiBroj} inventarskiBroj={oprema.inventarskiBroj}
              />         
            ))}
    </div>
  )
}

export default GetOpremaDTO