import {ListGroup} from 'react-bootstrap'; // Importazione del componente ListGroup da React-Bootstrap

/**
 * This components requires:
 * - the list of filters labels to show, 
 * - the filter that is currenctly selected 
 */ 

/**
 * Componente `Filters` che mostra una lista di filtri selezionabili.
 * 
 * Props richieste:
 * - `items`: un array di oggetti filtro, ciascuno con:
 * - `filterName`: nome identificativo del filtro
 * - `label`: etichetta testuale da visualizzare nell'interfaccia
 * - `selected`: nome del filtro attualmente selezionato, per evidenziare il filtro attivo
 */ 

const Filters = (props) => {
  const {items, selected } = props; // Destrutturazione delle props per ottenere `items` (la lista dei filtri) e `selected` (filtro attivo)

  return (
     // Creazione di una lista visuale (ListGroup) con margine verticale (my-2)
    <ListGroup as="ul" className="my-2">
        {
           // Itera sull'array dei filtri per creare un ListGroup.Item per ognuno
          items.map( e => {
            return (
              <ListGroup.Item
                  as="li"                         // Ogni item sarà renderizzato come <li> (lista non ordinata)
                  key={e.filterName}              // Chiave unica richiesta da React per il rendering efficiente
                  href={'#'}                      // Attributo richiesto da Bootstrap per rendere l'item cliccabile
                  action                          // Abilita l'interattività visiva sull'item
                  active={selected === e.filterName ? true : false} // Attiva lo stile se il filtro corrente è selezionato
                  >
                  {e.label}                        // Etichetta visibile del filtro (es. "All", "Favorites", etc.)
              </ListGroup.Item>
            );
          })
        }
    </ListGroup>
  )
}

export { Filters };// Esporta il componente Filters per poterlo usare in altri moduli