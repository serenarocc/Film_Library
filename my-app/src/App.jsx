import 'bootstrap/dist/css/bootstrap.min.css';  //carica css di bootstrap 5 - permette di usare le classi di stile
import 'bootstrap-icons/font/bootstrap-icons.css'; //carica css bootstrap icons
import './App.css'; //carica css App.css

import dayjs from 'dayjs'; //libreria per gestire le date

import { React, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap'; //mappano le classi di layout bootstrap su componenti react

import FILMS from './films'; //è l'array di films

import { Navigation } from './components/Navigation';  //componenti di prestazione
import { Filters } from './components/Filters'; //componenti di prestazione
import { FilmTable } from './components/FilmLibrary'; //componenti di prestazione

//è il root component dell'app. Tutto ciò è eseuito ad ogni render
function App() { 

  const activeFilter = 'filter-all'; //stato filto attivo

  /**
   * Defining a structure for Filters
   * Each filter is identified by a unique name and is composed by the following fields:
   * - A label to be shown in the GUI
   * - An ID (equal to the unique name), used as key during the table generation
   * - A filter function applied before passing the films to the FilmTable component
   */
  const filters = {
    'filter-all': { label: 'All', id: 'filter-all', filterFunction: () => true },
    'filter-favorite': { label: 'Favorites', id: 'filter-favorite', filterFunction: film => film.favorite },
    'filter-best': { label: 'Best Rated', id: 'filter-best', filterFunction: film => film.rating >= 5 },
    'filter-lastmonth': { label: 'Seen Last Month', id: 'filter-lastmonth', filterFunction: film => isSeenLastMonth(film) },
    'filter-unseen': { label: 'Unseen', id: 'filter-unseen', filterFunction: film => film.watchDate ? false : true }
  };

  const isSeenLastMonth = (film) => {
    if ('watchDate' in film) {  // Accessing watchDate only if defined
      const diff = film.watchDate.diff(dayjs(), 'month')
      const isLastMonth = diff <= 0 && diff > -1;      // last month
      return isLastMonth;
    }
  }

  const filtersToArray = Object.entries(filters);
  //console.log(JSON.stringify(filtersToArray));

  // NB: to implicitly return an object in an arrow function, use () around the object {}
  const filterArray = filtersToArray.map( e => ({filterName: e[0], label: e[1].label}) );
  // alternative with destructuring directly in the parameter of the callback 
  //const filterArray = filtersToArray.map(([filterName, { label }]) => ({ filterName: filterName, label: label }));
  // or even without explicit property names, since they are the same as the name of the variable
  //const filterArray = filtersToArray.map(([filterName, { label }]) => ({ filterName, label }));

  return (
    <Container fluid> //tutto è racchiuso nel conteiner bootstrap a tutta larghezza
      <Row>
        <Col>
          <Navigation /> //barra di navigazione
        </Col>
      </Row>

      <Row> //area principle divisa in due colonne
        <Col xs={3}> //sx lista dei filtri
          <Filters items={filterArray} selected={activeFilter} />
        </Col>

        <Col xs={9}> //dx titolo filtro corrrente, bottone +, tabella dei film
          <div className="d-flex flex-row justify-content-between">  //d-flex flexbox d-flex tiene il titolo a sx e il bottone + a dx
            <h1 className="my-2">Filter: <span>{filters[activeFilter].label}</span></h1>
            <Button variant="primary" className="my-2">&#43;</Button>
          </div>
          <FilmTable activeFilter={filters[activeFilter].label}//label da mostrare nel componente
            films={FILMS.filter(filters[activeFilter].filterFunction)} />//array films che viene filtrato in base al filtro attivo
        </Col>
      </Row>
    </Container>

  );
}

export default App; //esportazione