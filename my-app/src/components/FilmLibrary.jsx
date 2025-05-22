import 'dayjs';  //importa libreria per lavorare con le date
import { Table, Form } from 'react-bootstrap'; //importa componenti table e form da react-bootstraè per creare òa tabeòòa e il checkbox

function FilmTable(props) {
  // const films = props.films;
  const { films } = props; 

  return (
    <Table>//crea struttura dell'intstazione della tabella con 4 colonne
      <thead>
        <tr>
          <th>Title</th>
          <th className="text-center">Favorite</th>
          <th>Last seen</th>
          <th>Rating</th>
        </tr>
      </thead>
      <tbody> //per ogni film nell'array films crea una riga FilmRow. Passa al compponente figlio filmData
        {films.map((film) => <FilmRow filmData={film} key={film.id} />)} //key identifica ogni elem univocamente
      </tbody>
    </Table>
  );
}

function FilmRow(props) {

  const formatWatchDate = (dayJsDate, format) => { //funz helper per formattare la data
    return dayJsDate ? dayJsDate.format(format) : '';
  }

  return (
    <tr>
      <td>
        <p className={props.filmData.favorite ? "favorite" : ""} > // se favorite è true aggiunge la clsse favorite
          {props.filmData.title}
        </p>
      </td>
      <td className="text-center">
        <Form.Check type="checkbox" defaultChecked={props.filmData.favorite ? true : false} /> //check box che dice se il film è preferito
      </td>
      <td>
        <small>{formatWatchDate(props.filmData.watchDate, 'MMMM D, YYYY')}</small> //data ultima visione
      </td>
      <td>
        <Rating rating={props.filmData.rating} maxStars={5} /> //componente di rating
      </td>
    </tr>
  );
}

function Rating(props) {//componente di rating
  // Create an array with props.maxStars elements, then run map to create the JSX elements for the array 
  //crea array vuoto props.maxStars 
  return [...Array(props.maxStars)].map((el, index) =>
    <i key={index} className={(index < props.rating) ? "bi bi-star-fill" : "bi bi-star"} /> // se l'indice è miore di props.rating mostra stella piena bi bi-star-fill altrimenti mostra una stella vuota
  )
}

export { FilmTable }; //esportazione