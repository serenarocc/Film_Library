
import { Row, Col, Button, Spinner } from 'react-bootstrap';
import { Outlet, Link, useParams, Navigate, useLocation } from 'react-router';

import { NavigationBar } from './NavigationBar';
import { Filters } from './Filters';
import { FilmTable } from './FilmList';
import { AddFilmForm } from './AddFilmForm';
import { useEffect, useState } from 'react';

import API from '../API.js';


function NotFoundLayout(props) {
    return (
      <>
        <h2>This route is not valid!</h2>
        <Link to="/">
          <Button variant="primary">Go back to the main page!</Button>
        </Link>
      </>
    );
  }
  
  function AddLayout(props) { //vedi props che passi da app.jsx riga 92
    return (
      <AddFilmForm addFilm={props.addFilm} />
    );
  }
  
  function EditLayout(props) {
    const { filmId } = useParams();
    const filmToEdit = props.films && props.films.find( f => f.id === parseInt(filmId) );
    
    return(
      <>
      {filmToEdit? 
        <AddFilmForm editFilm={props.editFilm} filmToEdit={filmToEdit} />
       : <Navigate to={"/add"} />}
      </>
    );
  }
  
  function TableLayout(props) {
  
    const { filterId } = useParams(); //filterId riga 92 app.jsx arrriva da table layout, è il parametro del path
    console.log('filetrId: ',filterId);
    const filterName = props.filters[filterId] ?  props.filters[filterId].label : 'All';
    console.log('filterName: ',filterName);
    const filterQueryId = filterId || '';
    console.log('filterQueryId : ',filterQueryId );

    // When an invalid filter is set, all the films are displayed.
   // const filteredFilms = (filterId in props.filters) ? props.filmList.filter(props.filters[filterId].filterFunction) : props.filmList;

// This is only for convenience, to avoid reloading from server when coming from /add or /edit
    // It will be removed when the add and edit operations communicate with the server
    const location = useLocation();
    console.log('location : ',location );
    const currentUrl = location.pathname;
    console.log('currentUrl : ',currentUrl );
    let reloadFromServer = true;
    if (location.state)
      reloadFromServer = location.state.reloadFromServer;

    const [waiting, setWaiting] = useState(reloadFromServer);

    useEffect(() => {
      if (reloadFromServer) {
        setWaiting(true);
        API.getFilms(filterQueryId)
        .then(films => {
          props.setFilmList(films);
          setWaiting(false);
        })
        .catch(e => { console.log(e); } ); 
      }
    }, [filterQueryId, reloadFromServer]);




      //TableLayout è quella funzione che ritorna quel codice html
    return (
      <>
        <div className="d-flex flex-row justify-content-between">
          <h1 className="my-2">Filter: <span>{filterName}</span></h1>
          <Link to={'/add'} state={{previousUrl: currentUrl}} >
            <Button variant="primary" className="my-2">&#43;</Button>
          </Link>
        </div>
        {/* permetti di passare in cascata le props che hai ora in TableLayout (ovvero films={filteredFilms} delete={props.deleteFilm} editFilm={props.editFilm}) a filmTable*/}
         {/* <FilmTable films={filteredFilms} delete={props.deleteFilm} editFilm={props.editFilm} />*/}
         { waiting? <Spinner /> :
        <FilmTable 
          films={props.filmList} delete={props.deleteFilm} editFilm={props.editFilm} />
        }
      </>
    );
  }
  
  function GenericLayout(props) {
  
    return (
      <>
        <Row>
          <Col>
            <NavigationBar />
          </Col>
        </Row>
  
        <Row>
          <Col xs={3}>
            <Filters filterArray={props.filterArray} />
          </Col>
  
          <Col xs={9}> 
            <Outlet /> {/* viene da app.jsx e' un placeholder*/}
          </Col>
        </Row>
      </>
    );
  }
  
  export { GenericLayout, NotFoundLayout, TableLayout, AddLayout, EditLayout };