import React from 'react'

function OpremaCard({ title, content, image, serijskiBroj, inventarskiBroj }) {
  return (
    <div className="card">
      {image && <img src={image}
        alt="Oprema"
          style={{ width: '200px', height: '350px' }} className="card-image" />}
      <div className="card-content">
        <h2 className="oprema-naziv">Naziv: {title}</h2>
        <p className="oprema-specs">Opis: {content}</p>
        <h3 className='inventarski-broj'>Inventarski broj: {inventarskiBroj}</h3>
        <h3 className='serijski-broj'>Serijski broj: {serijskiBroj}</h3>
      </div>
    </div>
  )
}

export default OpremaCard