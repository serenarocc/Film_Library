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
app.use(express.json());
const PORT = 3000;
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
// app.get('/api/films', (req, res) => {
//     library.addFilm(film)
//     .then((films) => {
//         res.json(films);//manda a fe films in formato json
//     })
//     .catch((err) => {
//         res.status(500).json({
//             errors: [{'msg' : err}],
//         });
//     });
// });

//Req 4
//API mark an existing film as favourite or unfavourite
// app.put('/api/films/:id',
//     // [
//     //   check('id').isInt({min: 1}),    // check: is the id an integer, and is it a positive integer?
//     // ],
//     async (req, res) => {
//       // Is there any validation error?
//     //   const errors = validationResult(req).formatWith(errorFormatter); // format error message
//     //   if (!errors.isEmpty()) {
//     //     return res.status(422).json( errors.errors ); // error message is sent back as a json with the error info
//     //   }
  
//       const filmId = Number(req.params.id);
//       // Is the id in the body present? If yes, is it equal to the id in the url?
//       if (req.body.id && req.body.id !== filmId) {
//         return res.status(422).json({ error: 'URL and body id mismatch' });
//       }
  
  
//       try {
//         const film = await library.getWithId(filmId);
//   //      const film = await filmDao.getFilm(filmId);
//         if (film.error)   // If not found, the function returns a resolved promise with an object where the "error" field is set
//           return res.status(404).json(film);
//         const newFilm = {
//           title: req.body.title || film.title,
//           favorite: req.body.favorite || film.favorite,
//           watchDate: req.body.watchDate || film.watchDate,
//           rating: req.body.rating || film.rating,
//         };
//         const result = await library.updateFilm(film.id, newFilm);
//         if (result.error)
//           res.status(404).json(result);
//         else
//           res.json(result); 
//       } catch (err) {
//         res.status(503).json({ error: `Database error during the update of film ${req.params.id}` });
//       }
//     }
//   );

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
  
      console.log('Film trovato:', film);
  
      const newFilm = {
        title: req.body.title ?? film.title,
        favorite: req.body.favorite ?? film.favorite,
        watchDate: req.body.watchDate ?? film.watchDate,
        rating: req.body.rating ?? film.rating,
      };
  
      console.log('Updating film with:', newFilm);
  
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
