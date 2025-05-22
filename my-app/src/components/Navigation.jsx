import 'bootstrap-icons/font/bootstrap-icons.css'; // Importa le icone Bootstrap (es. bi-person-circle, bi-collection-play)

import { Navbar, Nav, Form } from 'react-bootstrap';// Importa i componenti principali della navbar da React-Bootstrap

const Navigation = () => {

    return (
     // Navbar di Bootstrap, con colore di sfondo "primary", stile scuro e responsive da "md" in su
        <Navbar bg="primary" expand="md" variant="dark" className="navbar-padding">

            <Navbar.Brand className="mx-2" href="index.html">/* logo della navbar (posizionato a sinistra) */
                <i className="bi bi-collection-play mx-2" />   /* Icona di Bootstrap a forma di collezione film */
                Film Library   /* Testo del logo */
            </Navbar.Brand>

            /* Barra di ricerca centrale */
            <Form className="my-2 mx-auto inline" action="#" role="search" aria-label="Quick search">
                <Form.Control type="search" 
                placeholder="Search" 
                aria-label="Search query" 
                />
            </Form>

            /* Area profilo utente (posizionata a destra) */
            <Nav>
                <Nav.Item>
                    <Nav.Link href="#">
                        <div className="fs-4 mx-2">
                            <i className="bi bi-person-circle icon-size" /> /* Icona utente tonda (Bootstrap icon) */
                        </div>
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </Navbar>
    );
}

export { Navigation };  // Esporta il componente Navigation per poterlo usare altrove