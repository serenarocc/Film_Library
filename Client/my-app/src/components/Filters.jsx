//import 'bootstrap-icons/font/bootstrap-icons.css'; // Importa le icone Bootstrap (es. bi-person-circle, bi-collection-play)

import { ListGroup } from 'react-bootstrap';// Importa i componenti principali della navbar da React-Bootstrap

const Filters = (props) => {

  const {items, selected} = props;

  return (
    <div class="list-group">
      <button type="button" class="list-group-item list-group-item-action active" aria-current="true">
        The current button
      </button>
      <button type="button" class="list-group-item list-group-item-action">A second button item</button>
      <button type="button" class="list-group-item list-group-item-action">A third button item</button>
      <button type="button" class="list-group-item list-group-item-action">A fourth button item</button>
      <button type="button" class="list-group-item list-group-item-action" disabled>A disabled button item</button>
    </div>
  );
}
export { Filters };  

