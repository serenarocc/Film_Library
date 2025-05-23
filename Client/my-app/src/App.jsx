import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import dayjs from 'dayjs';

import { React, useState } from 'react';
import { Container, Row, Col, Button} from 'react-bootstrap';

import FILMS from './films';

import { NavigationBar } from './components/NavigationBar.jsx' // . è come sono in questa cartella
import { Filters } from './components/Filters.jsx'
import { FilmTable } from './components/FilmList.jsx';


function App() {

  const activeFilter = 'filter-all';

  const filters = {
    'filter-all': {label: 'All', id: 'filter-all', filterFunction: () => true},
    'filter-favorite': {label: 'Favorites', id: 'filter-favorite', filterFunction: () => film.favorite},
    'filter-best': {label: 'Best Rated', id: 'filter-best', filterFunction: () => film.rating >= 5},
    'filter-lastmonth': {label: 'Seen Last Month', id: 'filter-lasthmonth', filterFunction: () => isSeenLastMonth(film)},
    'filter-unseen': {label: 'Unseen', id: 'filter-unseen', filterFunction: () => film.watchDate ? false : true},
  }

  const isSeenLastMonth = (film) => {
    if('watchDate' in film) {
      const diff = film.watchDate.diff(dayjs(), 'month');
      const isLastMonth = diff <= 0 && diff > -1;
      return isLastMonth;
    }
  }

  const filtersToArray = Object.entries(filters);
  const filterArray = filtersToArray.map( e => ({filterName: e[0], label: e[1].label}));

  return (
    <Container fluid>

        <Row>
          <Col>
              <NavigationBar/>
          </Col>
        </Row>

        <Row>

          <Col xs={3}>
               <Filters items={filterArray} selected={activeFilter} />
          </Col>

          <Col xs={9}>
              <div className="d-flex flex-row justify-content-between">
                <h1 className="my-2">Filter: <span>{filters[activeFilter].label}</span></h1>
                <Button variant="primary" className="my-2">&#43;</Button>
              </div>
              <FilmTable activeFilter={filters[activeFilter].label}
                films={FILMS.filter(filters[activeFilter].filterFunction)} />
           </Col>

        </Row>


    </Container>
      
     
  );
}

export default App;
