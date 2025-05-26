import 'dayjs';// Importazione della libreria dayjs
import { Table, Form, Button } from 'react-bootstrap';// Importazione di componenti da React-Bootstrap per creare tabelle e form

// Componente principale che mostra una tabella di film
function FilmTable(props) {
  // const films = props.films;
  // Estrae direttamente la proprietà 'films' dall'oggetto props usando la destrutturazione
  const { films, activeFilter } = props;

  return (
    <Table>
      <thead>
        <tr>
           {/* Intestazione della tabella con i titoli delle colonne */}
          <th>Title</th>
          <th className="text-center">Favorite</th>
          <th>Last seen</th>
          <th>Rating</th>
          <th>Actions</th> 
        </tr>
      </thead>
      <tbody>
         {/* Mappa l’array di film ricevuto come prop e crea una riga per ciascun film */}
        {films.map((film) => 
          // Chiama il componente FilmRow per ogni film, passando i dati come prop
        <FilmRow filmData={film} key={film.id} delete={props.delete} />)}
      </tbody>
    </Table>
  );
}

// Componente che rappresenta una singola riga nella tabella dei film
function FilmRow(props) {

  // Funzione di utilità che formatta una data con dayjs, oppure restituisce stringa vuota se la data è assente
  const formatWatchDate = (dayJsDate, format) => {
    return dayJsDate ? dayJsDate.format(format) : '';
  }

  return (
    <tr>
      {/* Colonna del titolo */}
        <td>
           {/* Se il film è segnato come preferito, applica la classe CSS "favorite" */}
          <p className={props.filmData.favorite ? "favorite" : ""} >
            {props.filmData.title}
          </p>
        </td>

        {/* Colonna con checkbox per indicare se il film è tra i preferiti */}
        <td className="text-center">
          {/* Checkbox marcata come checked se il film è preferito */}
          <Form.Check type="checkbox" defaultChecked={props.filmData.favorite ? true : false} />
        </td>

      {/* Colonna con la data dell'ultima visione */}
        <td>
          {/* Mostra la data formattata in formato "Mese Giorno, Anno" (es. "April 15, 2024") */}
          <small>{formatWatchDate(props.filmData.watchDate, 'MMMM D, YYYY')}</small>
        </td>

        {/* Colonna con il componente Rating che mostra il numero di stelle */}
        <td>
          <Rating rating={props.filmData.rating} maxStars={5} />
        </td>

        <td>
        <Button variant='danger'
          onClick={() => { props.delete(props.filmData.id) }} >
          <i className='bi bi-trash'></i>
        </Button>
        <Button className="mx-2" variant='warning'  
          onClick={() => { props.editFilm(props.filmData); props.setShowForm(true); }} >
          <i className='bi bi-pencil'></i>
        </Button>
      </td>

    </tr>
  );
}
//editFilm  setFilmToEdit
// Componente per visualizzare una valutazione con stelle
function Rating(props) {
  // Create an array with props.maxStars elements, then run map to create the JSX elements for the array 
  // Crea un array di lunghezza pari al numero massimo di stelle (es. 5)
  // Poi lo mappa per generare le icone delle stelle (piene o vuote a seconda del rating)
  return [...Array(props.maxStars)].map((el, index) =>
    <i key={index} className={(index < props.rating) ? "bi bi-star-fill" : "bi bi-star"} /> // bi-star-fill = stella piena, bi-star = stella vuota
  )
}

export { FilmTable };// Esportazione del componente FilmTable per usarlo in altri file