import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import dayjs from 'dayjs';

import { React, useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Outlet, Link, useParams, Navigate } from 'react-router';

// import FILMS from './films';
import API from './API.js';

import { GenericLayout, NotFoundLayout, TableLayout, AddLayout, EditLayout } from './components/Layout';

function App() {

  const [filmList, setFilmList] = useState([]);
 
//ogni filtro si identifica da un nome univoco e ha i segueti campo: label, url per il router, e una filterfanction che passa i film già filtrati alla FilmTable
  const filters = {
    'all': { label: 'All', url: '/', filterFunction: () => true },
    'favorite': { label: 'Favorites', url: '/filter/favorite', filterFunction: film => film.favorite },
    'best': { label: 'Best Rated', url: '/filter/best', filterFunction: film => film.rating >= 5 },
    'lastmonth': { label: 'Seen Last Month', url: '/filter/lastmonth', filterFunction: film => isSeenLastMonth(film) },
    'unseen': { label: 'Unseen', url: '/filter/unseen', filterFunction: film => film.watchDate ? false : true }
  };
  //console.log('filters: ',filters);

  const isSeenLastMonth = (film) => {
    if ('watchDate' in film) {  // Accessing watchDate only if defined
      const diff = film.watchDate.diff(dayjs(), 'month')
      const isLastMonth = diff <= 0 && diff > -1;      // last month
      return isLastMonth;
    }
  }

  //converte oggetto in array ovvero una lista di coppie chiave-valore
  const filtersToArray = Object.entries(filters);
  //console.log('filtersToArray: ',filtersToArray);
   /*filtersToArray ritorna:
   * Array(5) [ (2) […], (2) […], (2) […], (2) […], (2) […] ]
      0: Array [ "all", {…} 
          0: "all"
          1: Object { label: "All", url: "/", filterFunction: filterFunction()
          }
      1: Array [ "favorite", {…} ]
      2: Array [ "best", {…} ]
      3: Array [ "lastmonth", {…} ]
      4: Array [ "unseen", {…} ]
   */

  const filterArray = filtersToArray.map(([filterName, obj ]) =>
     ({ filterName: filterName, ...obj }));

  //console.log('filterArray: ',filterArray);
  /*filterArray ritorna:
   * Array(5) [ {…}, {…}, {…}, {…}, {…} ]
      0: Object { filterName: "all", label: "All", url: "/", … }
      1: Object { filterName: "favorite", label: "Favorites", url: "/filter/favorite", … }
      2: Object { filterName: "best", label: "Best Rated", url: "/filter/best", … }
      3: Object { filterName: "lastmonth", label: "Seen Last Month", url: "/filter/lastmonth", … }
      4: Object { filterName: "unseen", label: "Unseen", url: "/filter/unseen", … }
   */

  function deleteFilm(filmId) {
    setFilmList(filmList => filmList.filter(e => e.id!==filmId));
  }

  function editFilm(film) {
    setFilmList( (films) => films.map( e=> {
      if (e.id === film.id)
        return Object.assign({}, film);  // Alternative:  return {...film}
      else
        return e;
    }))
  }

  function addFilm(film) {
    setFilmList( (films) => {
        const newFilmId = Math.max( ...(films.map(e => e.id)))+1;
        return [...films, {"id": newFilmId, ...film}];
      });
  }

  return (
      <Container fluid>
        <Routes>
          <Route path="/" element={<GenericLayout filterArray={filterArray} />} >
            {/* outlet al path index(homepage) è il table layout*/}
            <Route index element={ <TableLayout filmList={filmList} filters={filters} deleteFilm={deleteFilm} editFilm={editFilm} />} /> {/* tutte props che gli passo*/} 
               {/* addFilm tra graffe è la props/parametro. posso specificare più props*/}
              <Route path="add" element={<AddLayout addFilm={addFilm} />} /> 
              <Route path="edit/:filmId" element={<EditLayout films={filmList} editFilm={editFilm} />} />  {/* sto passando due props*/}
              <Route path="filter/:filterId" element={<TableLayout filmList={filmList} setFilmList={setFilmlist} filters={filters} deleteFilm={deleteFilm} editFilm={editFilm} />} />
              <Route path="*" element={<NotFoundLayout />} /> {/* asterisco * indica tutti gli altri path non definiti*/}
          </Route>
        </Routes>
      </Container>
  );

}

export default App;