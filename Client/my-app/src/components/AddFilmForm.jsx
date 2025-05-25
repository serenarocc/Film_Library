import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import dayjs from 'dayjs';

function AddFilmForm(props) {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const title = event.target.elements.title.value;
    const favorite = event.target.elements.favorite.checked;
    const rating = event.target.elements.rating.value;
    const watchdate = event.target.elements.watchdate.value;

    const newFilm = {
      id: Math.floor(Math.random() * 10000),  // meglio un id dinamico se non hai un gestore di ID
      title,
      favorite,
      watchDate: watchdate ? dayjs(watchdate) : undefined,
      rating: parseInt(rating)
    };

    props.addFilm(newFilm);
    setValidated(true);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom01">
          <Form.Label>Title</Form.Label>
          <Form.Control required type="text" name="title" placeholder="Film title" />
        </Form.Group>

        <Form.Group as={Col} md="6" controlId="validationCustom02">
          <Form.Label>Favorite</Form.Label>
          <Form.Check type="checkbox" name="favorite" label="Mark as Favorite" />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustomUsername">
          <Form.Label>Watch Date</Form.Label>
          <Form.Control type="date" name="watchdate" />
        </Form.Group>

        <Form.Group as={Col} md="6" controlId="validationCustom03">
          <Form.Label>Rating</Form.Label>
          <Form.Control type="number" name="rating" placeholder="Rating (0-5)" required min={0} max={5} />
        </Form.Group>
      </Row>

      <Button type="submit">Submit</Button>
    </Form>
  );
}

export { AddFilmForm };