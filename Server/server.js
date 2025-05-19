'use strict';
//import package express - slide 4.02 num 16
const express = require('express');
const film = require('./film');
const filmLibrary = require('./filmLibrary');
const library = new filmLibrary();
const { check, validationResult, body, } = require('express-validator'); // validation middleware

// const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
//     return `${location}[${param}]: ${msg}`;
//   };

//avviazione server 
// //create application
const app = express(); //oggetto server
app.use(express.json()); // abilita parsing JSON
const PORT = 3000;

/*** Utility Functions ***/
// This function is used to format express-validator errors as strings
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};


// Middleware per loggare tutte le richieste
app.use((req, res, next) => {
  console.log(`[LOG] ${req.method} ${req.url}`);
  next();
});


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
app.get('/api/films/:id', 
  [ check('id').isInt({min: 1}) ],    // check: is the id an integer, and is it a positive integer?
  async (req, res) => {
    // Is there any validation error?
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json( errors.errors ); // error message is sent back as a json with the error info
    }
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

//API Req 3: create a film - check interno così mi semplifica la vita - require installare express validator
app.post('/api/films',
  [
    check('favorite').isBoolean(),
    // only date (first ten chars) and valid ISO e.g. 2024-02-09
    check('watchDate').isLength({min: 10, max: 10}).isISO8601({strict: true}).optional({checkFalsy: true}),
    check('rating').isInt({min: 1, max: 5}),
  ], 
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

//API Req 4: mark an existing film as favourite or unfavourite
  app.put('/api/films/:id', [
    check('id').isInt({min: 1}),    // check: is the id an integer, and is it a positive integer?
  ],
  async (req, res) => {
    // Is there any validation error?
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json( errors.errors ); // error message is sent back as a json with the error info
    }
      const filmId = Number(req.params.id); //params lo prendi dal path del http
    
      if (req.body.id && req.body.id !== filmId) { //body del http
        return res.status(422).json({ error: 'URL and body id mismatch' }); //status(422) json ha di deafult parametro status. status indica il tipo di errore
      }
    
      try {
        // const filmArray = await library.getWithId(filmId); //db.all li da tutti mi prendo il primo dell'array
        // const film = filmArray[0];

        const film = await library.getWithId(filmId); 
    
        if (!film) {
          return res.status(404).json({ error: `Film with id ${filmId} not found.` });
        }
    
        const newFilm = {
          title: req.body.title ?? film.title, //metto titolo del body se non c'è metto quello del db
          favorite: req.body.favorite ?? film.favorite,
          watchDate: req.body.watchDate ?? film.watchDate,
          rating: req.body.rating ?? film.rating,
        };
    
        const result = await library.updateFilm(filmId, newFilm);
        if (result.error)
          res.status(404).json(result);
        else
          res.json(result); //quando la risposta è gisuta di default è status 200 (ok) ci andrebbe sempre ma quando è giusto è implicito
      } catch (err) {
        console.error('Errore durante update:', err);
        res.status(503).json({ error: `Database error during the update of film ${req.params.id}` });
      }
    });

//API Req 5: change rating of delta
app.put('/api/films/rating/:delta', async (req, res) => {
  const delta = Number(req.body.delta); //params lo prendi dal path del http
  const filmId = req.body.id;
  try {
    const film = await library.getWithId(filmId); 
    if (!film) {
      return res.status(404).json({ error: `Film with id ${filmId} not found.` });
    }
    
    if(film.rating == null){
      return res.status(404).json({ error: `Upadate denied. The film have a null rating' ${film} ` });
    }
  
    let newRating;
    if(req.body.operazione == '+'){
      newRating = film.rating + delta;
    }else if(req.body.operazione == '-'){
      newRating = film.rating - delta;
    }

    const newFilm = {
      title: req.body.title ?? film.title, //metto titolo dle body se non c'è metto quello del db
      favorite: req.body.favorite ?? film.favorite,
      watchDate: req.body.watchDate ?? film.watchDate,
      rating:  newRating, 
    };

    const result = await library.updateFilm(filmId, newFilm);
    if (result.error)
      res.status(404).json(result);
    else
      res.json(result); //quando la risposta è gisuta di default è status 200 (ok) ci andrebbe sempre ma quando è giusto è implicito
  } catch (err) {
    console.error('Errore durante update:', err);
    res.status(503).json({ error: `Database error during the update of film ${req.params.id}` });
  }
});

//API Req 6: delete an existing film given the id
app.delete('/api/films/:id', async (req, res) => {
  const filmId = Number(req.params.id); //params lo prendi dal path del http
  console.log('prima di try');
  try {

    await library.deleteWithId(filmId); 
    console.log('dopo delete');
    res.status(204).end(); //no content processato con successo ma non ritorna niente perche hai fatto delete 

  } catch (err) {
    console.error('Errore durante delete:', err);
    res.status(503).json({ error: `Database error during the delete of film ${req.params.id}` });
  }
});

//API Req 7: retive films in based a different filter
app.get('/api/films/filter/:paramfilter', (req, res) => {
  let films;
  
  if(req.params.paramfilter == 'all'){
    films = library.getAll();
  }else if(req.params.paramfilter == 'best'){
    films = library.getAllBest();
  }else if(req.params.paramfilter == 'favorite'){
    films = library.getAllFavorite();
  }else if(req.params.paramfilter == 'lastmonth'){
    films = library.getAllLastMonth();
  }else if(req.params.paramfilter == 'unseen'){
    films = library.getAllUnseen();
  }
  
  films.then((films) => {
      res.json(films);//manda a fe films in formato json
  })
  .catch((err) => {
      res.status(500).json({
          errors: [{'msg' : err}],
      });
  });
});
