import 'bootstrap-icons/font/bootstrap-icons.css'; // Importa le icone Bootstrap (es. bi-person-circle, bi-collection-play)

import { Navbar, Nav, Form } from 'react-bootstrap';// Importa i componenti principali della navbar da React-Bootstrap

const NavigationBar = () => {// Componente funzionale `NavigationBar` che rappresenta l'intestazione dell'app

    return (
        // Componente principale della navbar
        // bg="primary": usa il colore primario di Bootstrap come sfondo
        // expand="md": navbar espandibile a partire da dispositivi con larghezza >= "md" (medium)
        // variant="dark": imposta testo e icone su un tema scuro
        // className="navbar-padding": eventuale classe CSS personalizzata per padding
        <Navbar bg="primary" expand="md" variant="dark" className="navbar-padding">
        
             {/* Brand/logo della navbar (in alto a sinistra) */}
            <Navbar.Brand className="mx-2" href="index.html">
                 {/* Icona Bootstrap con classe spacing mx-2 */}
                <i className="bi bi-collection-play mx-2" />   
                Film Library  
            </Navbar.Brand>

         
            {/* Campo di ricerca posizionato centralmente nella navbar 
                className="my-2 mx-auto inline" // margini verticali + centratura orizzontale
                action="#"                      // placeholder per futura funzionalità di ricerca
                role="search"                   // migliora l’accessibilità
                aria-label="Quick search"       // descrizione per screen reader
                type="search"                   // tipo input "search" per dispositivi mobili
                placeholder="Search"            // testo segnaposto
                aria-label="Search query"       // migliora accessibilità
            */}
            <Form className="my-2 mx-auto inline" action="#" role="search" aria-label="Quick search">
                <Form.Control type="search" 
                placeholder="Search" 
                aria-label="Search query" 
                />
            </Form>

           {/* Sezione della navbar a destra con icona profilo utente */}
            <Nav>
                <Nav.Item>
                    <Nav.Link href="#">
                        <div className="fs-4 mx-2"> {/* fs-4 = font-size Bootstrap medio-grande */}
                            <i className="bi bi-person-circle icon-size" /> {/* Icona utente */}
                        </div>
                    </Nav.Link>
                </Nav.Item>
            </Nav>
            
        </Navbar>
    );
}

export { NavigationBar };  