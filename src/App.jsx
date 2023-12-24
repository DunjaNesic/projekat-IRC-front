import './App.css';
import OpremaForm from './models/Oprema/OpremaForm';
import PregledStanja from './models/Oprema/PregledStanja';
import PretragaOpreme from './models/Oprema/PretragaOpreme';
import ZaduzivanjeOpreme from './models/Oprema/ZaduzivanjeOpreme';

function App() {
  return (
    <div className="App">
      <nav>PROJEKAT IRC</nav>
      <div className='dodavanje-opreme'>
        <OpremaForm/>
        </div>
        <PregledStanja/>
        <PretragaOpreme/>
        <ZaduzivanjeOpreme/>
    </div>
  );
}

export default App;
