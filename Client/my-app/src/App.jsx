import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import dayjs from 'dayjs';

import { React, useState } from 'react';
import { Container, Row, Col, Button} from 'react-bootstrap';

import FILMS from './films';

import { NavigationBar } from './components/NavigationBar.jsx' // . è come sono in questa cartella
import { Filters } from './components/Filters.jsx'


function App() {

  return (
    <Container fluid>

        <Row>
          <Col>
              <NavigationBar/>
          </Col>
        </Row>

        <Row>
          <Col xs={3}>
               <Filters/>
          </Col>
        </Row>


    </Container>
      
     
  );
}

export default App;
