import dayjs from 'dayjs';

import {useState} from 'react';
import {Form, Button, Alert} from 'react-bootstrap';
import { useNavigate, Link } from 'react-router';

const AddFilmForm = (props) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState(props.filmToEdit ? props.filmToEdit.title : '');
  const [favorite, setFavorite] = useState(props.filmToEdit ? props.filmToEdit.favorite : false);
  const [watchDate, setWatchDate] = useState((props.filmToEdit && props.filmToEdit.watchDate) ? props.filmToEdit.watchDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));
  const [rating, setRating] = useState((props.filmToEdit && props.filmToEdit.rating) ? props.filmToEdit.rating : 0);

  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (event) => { //è una call back automatica triggerata dal form
    event.preventDefault();

    const film = { "title": title.trim(), "favorite": favorite, "rating": rating }
    if (watchDate) {// adding watchDate only if it is defined
      film.watchDate = dayjs(watchDate);
    } 
      
    if (film.title.length == 0) {
      setErrorMsg('Title length cannot be 0');
    } else if (film.rating < 0 || film.rating > 5) {
      setErrorMsg('Invalid value for Rating');
    } else {
      // Proceed to update the data
      if (props.filmToEdit) {
        // Film was edited, not created from scratch
        film.id = props.filmToEdit.id;
        props.editFilm(film);
        navigate('/');//rindirizza alla home
      } else {
        props.addFilm(film);
        navigate('/');
      }
    }
  }

  return (
    <> //()=>setErrorMsg('') setta di nuovo la variabile a vuoto dopo la chiusura è come un reset
    {errorMsg? <Alert variant='danger' onClose={()=>setErrorMsg('')} dismissible>{errorMsg}</Alert> : false } //false non renderizza niente
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        {/* required={true} forces the user to insert some characters, but if they are all spaces this is not checked */}
        <Form.Control type="text" required={true} value={title} onChange={event => setTitle(event.target.value)}/>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Check type="checkbox" label="Favorite" name="favorite" checked={favorite} onChange={(event) => setFavorite(event.target.checked)} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Watch Date</Form.Label>
        { /* watchDate is an optional parameter. It have to be properly rendered only if available. */ }
        <Form.Control type="date" value={watchDate} onChange={event => {event.target.value ? setWatchDate(dayjs(event.target.value).format('YYYY-MM-DD')) : setWatchDate("")}}/>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Rating</Form.Label>
        <Form.Control type="number" min={0} max={5} step={1} value={rating} onChange={event => setRating(parseInt(event.target.value))}/>
      </Form.Group>

      <Button className="mb-3" variant="primary" type="submit">Save</Button>
      &nbsp;
      <Link to={"/"} >
        <Button className="mb-3" variant="danger">Cancel</Button>
      </Link>
    </Form>
    </>
  )

}

export { AddFilmForm };