import 'bootstrap-icons/font/bootstrap-icons.css'; // Importa le icone Bootstrap (es. bi-person-circle, bi-collection-play)

import { Navbar, Nav, Form } from 'react-bootstrap';// Importa i componenti principali della navbar da React-Bootstrap

const NavigationBar = () => {

    return (
        
        <Navbar bg="primary" expand="md" variant="dark" className="navbar-padding">
        
            <Navbar.Brand className="mx-2" href="index.html">
                <i className="bi bi-collection-play mx-2" />   
                Film Library  
            </Navbar.Brand>

         
            <Form className="my-2 mx-auto inline" action="#" role="search" aria-label="Quick search">
                <Form.Control type="search" 
                placeholder="Search" 
                aria-label="Search query" 
                />
            </Form>

          
            <Nav>
                <Nav.Item>
                    <Nav.Link href="#">
                        <div className="fs-4 mx-2">
                            <i className="bi bi-person-circle icon-size" /> 
                        </div>
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </Navbar>
    );
}

export { NavigationBar };  