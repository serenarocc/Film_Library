import { useState } from 'react'
import { NavigationBar } from './components/NavigationBar.jsx' // . è come sono in questa cartella
import { Sidebar } from './components/Sidebar.jsx'

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Row } from 'react-bootstrap';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Container >
      <Row>
          <NavigationBar/>
      </Row>

      <Row>
           <Sidebar/>
      </Row>


    </Container>
      
     
  )
}

export default App
