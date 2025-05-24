import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import dayjs from 'dayjs'; // Importazione della libreria dayjs per la gestione delle date

import { React, useState } from 'react'; // Importazione di React e dello useState hook 
import { Container, Row, Col, Button} from 'react-bootstrap'; // Importazione dei componenti di layout da React-Bootstrap

import FILMS from './films'; // Importazione della lista dei film

// Importazione dei componenti personalizzati
import { NavigationBar } from './components/NavigationBar.jsx' // . è come sono in questa cartella
import { Filters } from './components/Filters.jsx'
import { FilmTable } from './components/FilmList.jsx';


function App() {
    
  //const activeFilter = 'filter-all';// Filtro attivo
  const [filmList, setFilmList] = useState(FILMS);

  const [activeFilter, setActiveFilter] = useState('filter-all');

  // Definizione dei filtri disponibili, con etichetta, id e funzione per filtrare
  const filters = {
    'filter-all': { label: 'All', id: 'filter-all', filterFunction: () => true },
    'filter-favorite': { label: 'Favorites', id: 'filter-favorite', filterFunction: film => film.favorite },
    'filter-best': { label: 'Best Rated', id: 'filter-best', filterFunction: film => film.rating >= 5 },
    'filter-lastmonth': { label: 'Seen Last Month', id: 'filter-lastmonth', filterFunction: film => isSeenLastMonth(film) },
    'filter-unseen': { label: 'Unseen', id: 'filter-unseen', filterFunction: film => film.watchDate ? false : true }
  };

  // Funzione che verifica se un film è stato visto l'ultimo mese
  const isSeenLastMonth = (film) => {
    if('watchDate' in film) {
      const diff = film.watchDate.diff(dayjs(), 'month');
      const isLastMonth = diff <= 0 && diff > -1;
      return isLastMonth;
    }
  }

  //Conversione dell’oggetto filters in un array, utile per i componenti figli
  const filtersToArray = Object.entries(filters);
  console.log(JSON.stringify(filtersToArray));
  const filterArray = filtersToArray.map(([filterName, { label }]) => ({ filterName: filterName, label: label })); 

  function deleteFilm(filmId){
    setFilmList(filmList => filmList.filter (e => e.id !==filmId));
  }

  // Render dell’interfaccia utente
  return (
    <Container fluid>

        <Row>
          <Col>
              <NavigationBar/>   {/* Barra di navigazione in alto blu*/}
          </Col>
        </Row>

        <Row>

          <Col xs={3}> 
                {/* Colonna dei filtri */}
                <Filters items={filterArray} selected={activeFilter} onSelect={setActiveFilter} />
               
          </Col>


          {/* Colonna principale con lista dei film */}
          <Col xs={9}> 

              <div className="d-flex flex-row justify-content-between">
                  {/* Titolo dinamico con il nome del filtro attivo */}
                  <h1 className="my-2">Filter: <span>{filters[activeFilter].label}</span></h1>
                  {/* Bottone per aggiungere un film */}
                  <Button variant="primary" className="my-2">&#43;</Button>
              </div>
              
               {/* Tabella dei film filtrati in base al filtro attivo */}
              <FilmTable activeFilter={filters[activeFilter].label}
                films={filmList.filter(filters[activeFilter].filterFunction)}
                delete = {deleteFilm} />
           </Col>

        </Row>


    </Container>
      
     
  );
}

export default App;
