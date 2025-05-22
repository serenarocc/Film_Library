import {ListGroup} from 'react-bootstrap'; //importa componente listgroup da react-bootsrap
/**questo componente mostra una listai filtri. richiede due props:
 * - items: array di oggetti ciascuno con filterName, label
 * - selected: nome filtro attualmente selezionato
 */
/**
 * This components requires:
 * - the list of filters labels to show, 
 * - the filter that is currenctly selected 
 */ 
const Filters = (props) => {
  const {items, selected } = props; // Estrae i props: items (lista filtri), selected (filtro attivo)

  return (
      // Crea una lista bootstrap (ul), con margine verticale
    <ListGroup as="ul" className="my-2">
        {
            // Mappa ogni elemento della lista items e genera un <ListGroup.Item> per ognuno
          items.map( e => {
            return (
                <ListGroup.Item 
                as="li" // Ogni item sarà un <li> 
                key={e.filterName}   // React richiede una key univoca per ogni elemento della lista
                href={'#'}   // Link fittizio (non fa nulla al click)
                  action  // Permette stile "cliccabile"
                  active={selected === e.filterName ? true : false} // Evidenzia se è il filtro selezionato
                >
                    {e.label} // Mostra l'etichetta testuale del filtro (es: "All", "Favorites")
                </ListGroup.Item>
            );
          })
        }
    </ListGroup>
  )
}

export { Filters };// Esporta il componente Filters per poterlo usare in altri file