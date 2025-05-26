import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import {Alert} from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import dayjs from 'dayjs';

function AddFilmForm({ addFilm, editFilm, filmToEdit }) {
  const [validated, setValidated] = useState(false);

  const isEdit = !!filmToEdit;

  const [formData, setFormData] = useState({
    title: filmToEdit? filmToEdit.title : "",
    favorite: filmToEdit? filmToEdit.favorite : false,
    rating: filmToEdit? filmToEdit.rating : 0,
    watchDate: filmToEdit? filmToEdit.watchDate?.format("YYYY-MM-DD") : ""
  });

  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const newFilm = {
      id: isEdit ? filmToEdit.id : Math.floor(Math.random() * 10000),
      title: formData.title,
      favorite: formData.favorite,
      watchDate: formData.watchDate ? dayjs(formData.watchDate) : undefined,
      rating: parseInt(formData.rating)
    };
   
     // Here some data validation can be inserted, if not yet forced with HTML5 attributes on form controls
     if (newFilm.title.length == 0) {
      setErrorMsg('Title length cannot be 0');
    } else if (newFilm.rating < 0 || newFilm.rating > 5) {
      setErrorMsg('Invalid value for Rating');
    }
    isEdit ? editFilm(newFilm) : addFilm(newFilm);
    setValidated(true);
  };


  return (
    <>
     {errorMsg? <Alert variant='danger' onClose={()=>setErrorMsg('')} dismissible>{errorMsg}</Alert> : false }
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom01">
          <Form.Label>Title</Form.Label>
           <Form.Control
              required
              type="text"
              name="title"
              placeholder="Film title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
        </Form.Group>

        <Form.Group as={Col} md="6" controlId="validationCustom02">
          <Form.Label>Favorite</Form.Label>
          <Form.Check
            type="checkbox"
            name="favorite"
            label="Mark as Favorite"
            checked={formData.favorite}
            onChange={(e) => setFormData({ ...formData, favorite: e.target.checked })}
          />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustomUsername">
          <Form.Label>Watch Date</Form.Label>
          <Form.Control
            type="date"
            name="watchdate"
            value={formData.watchDate}
            onChange={(e) => setFormData({ ...formData, watchDate: e.target.value })}
          />

        </Form.Group>

        <Form.Group as={Col} md="6" controlId="validationCustom03">
          <Form.Label>Rating</Form.Label>
          <Form.Control
            type="number"
            name="rating"
            placeholder="Rating (0-5)"
            required
            min={0}
            max={5}
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
          />
        </Form.Group>
      </Row>

      <Button type="submit">Submit</Button>
    </Form>
    </>
   
  );
}

export { AddFilmForm };