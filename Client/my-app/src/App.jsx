import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter, Routes, Route, Outlet, Link, useParams, Navigate } from 'react-router-dom';

import dayjs from 'dayjs'; // Importazione della libreria dayjs per la gestione delle date

import { React, useState } from 'react'; // Importazione di React e dello useState hook 
import { Container, Row, Col, Button} from 'react-bootstrap'; // Importazione dei componenti di layout da React-Bootstrap

import FILMS from './films'; // Importazione della lista dei film

// Importazione dei componenti personalizzati
import { NavigationBar } from './components/NavigationBar.jsx' // . è come sono in questa cartella
import { Filters } from './components/Filters.jsx'
import { FilmTable } from './components/FilmList.jsx';
import {AddFilmForm} from './components/AddFilmForm.jsx';

import { GenericLayout, NotFoundLayout, TableLayout, AddLayout, EditLayout } from './components/Layout';


function App() {
    
  //const activeFilter = 'filter-all';// Filtro attivo
  // primo variabile che matiene lo stato attuale
  //secondo la funz che setta quello stato
  const [filmList, setFilmList] = useState(FILMS); //hook mantiene lo stato - stato iniziale

  // const [activeFilter, setActiveFilter] = useState('filter-all');//use state ritorna un valore e una funzione

  // const [activeAddFilm, setActiveAddFilm] = useState(false);

   const [activeEditFilm, setActiveEditFilm] = useState(false);

  // const [filmToEdit, setFilmToEdit] = useState(null);//cosi sai quale film devi modificare

  // Definizione dei filtri disponibili, con etichetta, id e funzione per filtrare
  //mappa json
  const filters = {
    //key                //value
    'filter-all': { label: 'All', id: 'filter-all', filterFunction: () => true }, //applica funz che ritorna sempre true

    'filter-favorite': { 
      label: 'Favorites', 
      id: 'filter-favorite', 
      filterFunction: film => film.favorite 
    }, //nome temporaneo al singolo elem dell'array a cui apllico quella funz
    //e come se facessi un foreach. favorite è booleano 

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
  const filtersToArray = Object.entries(filters);// traforma in un array di entries. dove entries sono le coppie chiave, valore di quella mappa
  console.log(JSON.stringify(filtersToArray));
  //                                       nomi fitizzi tupla 1 key della entry, 2 solo la label 
  const filterArray = filtersToArray.map(([filterName, { label }]) => ({
     filterName: filterName,
      label: label 
    })); 

  function deleteFilm(filmId){
    setFilmList(filmList => filmList.filter (e => e.id !==filmId)); //resti
  }

  function addFilm (film){
    setFilmList(filmList => [...filmList,film]);
    console.log(filmList);
   // setActiveAddFilm(false);
  }

  function editFilm(film) {
    setFilmList( (films) => films.map( e=> {
      if (e.id === film.id){
        setActiveEditFilm(false);
        return Object.assign({}, film);
      }
      else{
        setActiveEditFilm(false);
        return e;
      }
        
    }))
  }

  // Render dell’interfaccia utente
  return (
    <Container fluid>
      <Routes>
        <Route path="/" element={<GenericLayout filterArray={filterArray} />} >
          <Route index element={<TableLayout 
               filmList={filmList} filters={filters} deleteFilm={deleteFilm} editFilm={editFilm} />} />
          <Route path="add" element={<AddLayout addFilm={addFilm} />} />
          <Route path="edit/:filmId" element={<EditLayout films={filmList} editFilm={editFilm} />} />
          <Route path="filter/:filterId" element={<TableLayout 
               filmList={filmList} filters={filters} deleteFilm={deleteFilm} editFilm={editFilm} />} />
          <Route path="*" element={<NotFoundLayout />} />
        </Route>
      </Routes>
    </Container>
  ); 
}

export default App;