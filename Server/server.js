'use strict';
//import package express - slide 4.02 num 16
const express = require('express');
const film = require('./film');
const filmLibrary = require('./filmLibrary');
const library = new filmLibrary();
// const { validationResult } = require('express-validator');
// const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
//     return `${location}[${param}]: ${msg}`;
//   };

//avviazione server 
// //create application
const app = express(); //oggetto server
app.use(express.json()); // abilita parsing JSON
const PORT = 3000;

        // Middleware per loggare tutte le richieste
        app.use((req, res, next) => {
          console.log(`[LOG] ${req.method} ${req.url}`);
          next();
        });

        // // Route test PUT
        // app.put('/api/films/:id', (req, res) => {
        //   const filmId = Number(req.params.id);
        //   console.log('[PUT] Richiesta ricevuta per ID:', filmId);
        //   console.log('Body ricevuto:', req.body);

        //   if (req.body.id && req.body.id !== filmId) {
        //     return res.status(422).json({ error: 'URL and body id mismatch' });
        //   }

        //   // Simula una risposta di successo
        //   return res.json({
        //     message: `Film con ID ${filmId} aggiornato correttamente`,
        //     updatedFields: req.body,
        //   });
        // });



app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});

//API Req 1: retrive all film
// dao rappresentazione tramite oggetto del db. oggetto che fa da tramite per accedere ai dati del db
//routing
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

//API Req 2: retrive a film given the ID
app.get('/api/films/:id', (req, res) => {
    library.getWithId(req.params.id)
    .then((films) => {
        res.json(films);//manda a fe films in formato json
    })
    .catch((err) => {
        res.status(500).json({
            errors: [{'msg' : err.message}],
        });
    });
});

//API Req 3: create a film 
app.post('/api/films',
  // [
  //   check('favorite').isBoolean(),
  //   // only date (first ten chars) and valid ISO e.g. 2024-02-09
  //   check('watchDate').isLength({min: 10, max: 10}).isISO8601({strict: true}).optional({checkFalsy: true}),
  //   check('rating').isInt({min: 1, max: 5}),
  // ], 
  async (req, res) => {
    // Is there any validation error?
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json( errors.errors ); // error message is sent back as a json with the error info
    }

    const film = {
      title: req.body.title,
      favorite: req.body.favorite,
      watchDate: req.body.watchDate,
      rating: req.body.rating,
    };

    try {
      const result = await library.createFilm(film); // NOTE: createFilm returns the newly created object
      res.json(result);
    } catch (err) {
      res.status(503).json({ error: `Database error during the creation of new film: ${err}` }); 
    }
  }
);

//Req 4
//API mark an existing film as favourite or unfavourite
app.put('/api/films/:id', async (req, res) => {
    const filmId = Number(req.params.id);
  
    if (req.body.id && req.body.id !== filmId) {
      return res.status(422).json({ error: 'URL and body id mismatch' });
    }
  
    try {
      const filmArray = await library.getWithId(filmId);
      const film = filmArray[0];
  
      if (!film) {
        return res.status(404).json({ error: `Film with id ${filmId} not found.` });
      }
  
      const newFilm = {
        title: req.body.title ?? film.title,
        favorite: req.body.favorite ?? film.favorite,
        watchDate: req.body.watchDate ?? film.watchDate,
        rating: req.body.rating ?? film.rating,
      };
  
      const result = await library.updateFilm(filmId, newFilm);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch (err) {
      console.error('Errore durante update:', err);
      res.status(503).json({ error: `Database error during the update of film ${req.params.id}` });
    }
  });
