'use strict';
//importo express
const express = require('express');
const film = require('./film');
const filmLibrary = require('./filmLibrary');
const library = new filmLibrary();


//avviazione server
const app = express(); //oggetto server
const PORT = 3000;
app.listen(PORT,()=>{
    console.log('Server is running on http://localhost:${PORT}');
});

//GET // dao rappresentazione tramite oggetto del db. oggetto che fa da tramite per accedere ai dati del db
app.get('/api/films', (req, res) => {
    library.getAll()
    .then((films) => {
        res.json(films);//manda a fe films in formato json
    })
    .catch((err) => {
        res.status(500).json({
            errors: [{'msg' : err}],
        });
    });
});

