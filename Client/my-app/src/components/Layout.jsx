
import { Row, Col, Button } from 'react-bootstrap';
import { Outlet, Link, useParams, Navigate } from 'react-router';

import { NavigationBar } from './NavigationBar';
import { Filters } from './Filters';
import { FilmTable } from './FilmList';
import { AddFilmForm } from './AddFilmForm';


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
  
  function AddLayout(props) { //vd props cmmenti app.jsx
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
  
    const { filterId } = useParams(); //filterId r 78 app.jsx arrriva da table layoy è il parametro del path
    const filterName = props.filters[filterId] ?  props.filters[filterId].label : 'All';
  
    // When an invalid filter is set, all the films are displayed.
    const filteredFilms = (filterId in props.filters) ? props.filmList.filter(props.filters[filterId].filterFunction) : props.filmList;
      //funz che ritorna quel codice html
    return (
      <>
        <div className="d-flex flex-row justify-content-between">
          <h1 className="my-2">Filter: <span>{filterName}</span></h1>
          <Link to={'/add'}>
            <Button variant="primary" className="my-2">&#43;</Button>
          </Link>
        </div>
        <FilmTable 
          films={filteredFilms} delete={props.deleteFilm} editFilm={props.editFilm} />//gli permetti di passare in cascata le props che hai ora
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
            <Outlet /> //viene da app.jsx e' un placeholder
          </Col>
        </Row>
      </>
    );
  }
  
  export { GenericLayout, NotFoundLayout, TableLayout, AddLayout, EditLayout };