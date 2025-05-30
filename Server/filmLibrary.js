const sqlite = require('sqlite3');
const Film = require('./film');
const dayjs = require('dayjs');
const isIntegerString = (val) => {
  return (
      Number.isInteger(Number(val)) &&   //Number(val) converte val (che può essere una stringa in un numero). isInteger verifica se l'argomento è un numero intero (senza decimali) 
      !isNaN(val) &&  //"Il valore val può essere interpretato come un numero" (cioè è numerico o convertibile in numero).
      String(val).trim() !== '' && //trim Rimuove tutti gli spazi bianchi all'inizio e alla fine della stringa.
      !String(val).includes(' ') //non ci devono essere spazi come ' 5 '
    );
};

const convertFilmFromDbRecord = (dbRecord) => {
  const film = {};
  film.id = dbRecord.id;
  film.title = dbRecord.title;
  film.favorite = dbRecord.favorite;
  // Note that the column name is all lowercase, JSON object requires camelCase as per the API specifications we defined.
  // We convert "watchdate" to the camelCase version ("watchDate").


  // FIXME
  // Also, here you decide how to transmit an empty date in JSON. We decided to use the empty string.
  // Using the null value is an alternative, but the API documentation must be updated and the client must be modified accordingly.
  //film.watchDate = dbRecord.watchdate ? dayjs(dbRecord.watchdate) : "";
  film.watchDate = dbRecord.watchdate;
  film.rating = dbRecord.rating;

  /* // ALTERNATIVE:
  // WARNING: the column names in the database are all lowercases. JSON object requires camelCase as per the API specifications we defined.
  // We convert "watchdate" to the camelCase version ("watchDate").
  // Object.assign will copy all fields returned by the DB (i.e., all columns if SQL SELECT did not specify otherwise)
  const film = Object.assign({}, e, { watchDate: e.watchdate? dayjs(e.watchdate) : "" });  // adding camelcase "watchDate"
  delete film.watchdate;  // removing lowercase "watchdate"
  */
  return film;
}


function FilmLibrary() {
    /** 
     * 
     *   const path = require('path');
  const dbPath = path.resolve(__dirname, 'films2.db');
  console.log("Utilizzo DB da:", dbPath);
  const db = new sqlite.Database(dbPath, (err) => { if (err) throw err; });
    */


  const db = new sqlite.Database('./db/films.db', (err) => { if (err) throw err; });

  this.closeDB = () => {
    try {
      db.close();
    }
    catch (error) {
      console.error(`Impossible to close the database! ${error}`);
    }
  }

  this.getAll = () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM films' ;
      db.all(query, [], (err, rows) => {
        if(err) {
          reject(err);
        }
        else {
          const films = rows.map(record => new Film(record.id, record.title, record.favorite == 1, record.watchdate, record.rating));
          resolve(films);
        }
      });
    });
  };

  this.getFavorites = () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM films WHERE favorite = True';
      db.all(query, [], (err, rows) => {
        if(err) {
          reject(err);
        }
        else {
          const films = rows.map(record => new Film(record.id, record.title, record.favorite == 1, record.watchdate, record.rating));
          resolve(films);
        }
      });
    });
  };

  this.getToday = () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM films WHERE watchdate = ?';
      const today = dayjs().format('YYYY-MM-DD');  // match the format used in SQL to represent the date
      db.all(query, [today], (err, rows) => {
        if(err) {
          reject(err);
        }
        else {
          const films = rows.map(record => new Film(record.id, record.title, record.favorite == 1, record.watchdate, record.rating));
          resolve(films);
        }
      });
   });
  }

  this.getBeforeDate = (watchdate) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM films WHERE watchdate < ?';
      db.all(query, [watchdate.format('YYYY-MM-DD')], (err, rows) => {
        if(err) {
          reject(err);
        }
        else {
          const films = rows.map(record => new Film(record.id, record.title, record.favorite == 1, record.watchdate, record.rating));
          resolve(films);
        }
      });
    });
  };

  this.getRated = (rating) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM films WHERE rating >= ?';
      db.all(query, [rating], (err, rows) => {
        if(err) {
          reject(err);
        }
        else {
          const films = rows.map(record => new Film(record.id, record.title, record.favorite == 1, record.watchdate, record.rating));
          resolve(films);
        }
      });
    });
  };

  this.getWithWord = (word) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM films WHERE title LIKE ?';
      db.all(query, ["%" + word + "%"], (err, rows) => {
        if(err) {
          reject(err);
        }
        else {
          const films = rows.map(record => new Film(record.id, record.title, record.favorite == 1, record.watchdate, record.rating));
          resolve(films);
        }
      });
    });
  };

  this.deleteFilm = (filmID) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM films WHERE id = ?';
      db.run(sql, [filmID], function (err) {  // use function; this.changes would not be available with an arrow function here
        if (err)
          reject(err);
        else
          // returning the number of affected rows: if nothing is deleted, returns 0
          resolve(this.changes);
      });
    });
  };

  this.addFilm = (film) => {
    return new Promise((resolve, reject) => {
      // film.id is ignored since the unique id can only come from the database
      const query = 'INSERT INTO films(title, favorite, watchdate, rating) VALUES(?, ?, ?, ?)';
      const parameters = [film.title, film.favorite, film.watchDate.format('YYYY-MM-DD'), film.rating];
      db.run(query, parameters, function (err) {  // use function; this.lastID would not be available with an arrow function here
        if (err)
          reject(err);
        else
          resolve(this.lastID);
      });
    });
  };

  this.resetWatchDate = () => {
    return new Promise((resolve, reject) => {
      const updateQuery = 'UPDATE films SET watchdate = NULL';
      db.run(updateQuery, [], function (err) {  // use function; this.changes would not be available with an arrow function here
        if (err)
          reject(err);
        else
          // returning the number of affected rows: if nothing is updated, returns 0
          resolve(this.changes);
      });
    });
  };

  //API Req 2: torna film dato id
  this.getWithId = (id) => {
    return new Promise((resolve, reject) => { //promise oggetto che rappresenta un dato che ottieni in modo asincrono. Ritorna subito una promise(non un valore) , quando la funz asincroa termina la promise viene valorizzata e ti da il valore
      if(!isIntegerString(id)){
        reject(new Error ('ID is not a number'));
        return;
      }
      const query = 'SELECT * FROM films WHERE id = ?';
      //db.all(query, [id], (err, rows) => { //ritorna tutti
      db.get(query, [id], (err, row) => { //ritorna 1
        if(err) {
          reject(err);
        }
        else {
          if (row == undefined) { //check if the id that i'm serching for currently exist in db
            resolve({ error: 'Film not found.' });
          } else {
            //const films = rows.map(record => new Film(record.id, record.title, record.favorite == 1, record.watchdate, record.rating)); //map va solo sulle collezioni e non sul singolo oggetto
            //const films = new Film(row.id, row.title, row.favorite == 1, row.watchdate, row.rating);
            const film = convertFilmFromDbRecord(row);
            resolve(film); 
          }
        }
      });
    });
  };

  //API Req3:  crea film senza dare id
  this.createFilm = (film) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO films (title, favorite, watchDate, rating) VALUES(?, ?, ?, ?)';
      
      const self = this;  // salva il contesto

      db.run(sql, [film.title, film.favorite, film.watchDate, film.rating], function (err) {
        if (err) {
          reject(err);
        }
        // Returning the newly created object with the DB additional properties (i.e., unique id) to the client.
        //lastId lo ho solo se faccio db.run
        //qui dentro this è db.run
        resolve(self.getWithId(this.lastID));// siamo in db.run, per lui this è sqlite3. lastid è una variabile / proprietà di sqlite3. è una funzione del db. proprietà interna
      });
    });
  };

  //API Req4: This function updates an existing film given its id and the new properties.
  //modificare usando exports
  this.updateFilm = (id, film) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE films SET title = ?, favorite = ?, watchDate = ?, rating = ? WHERE id = ?';
  
      const self = this;  // salva il contesto quindi this per me è FilmLibrary
  
      db.run(sql, [film.title, film.favorite, film.watchDate, film.rating, id], function (err) {
        console.log('Updating film with values:', film, 'and id:', id);
        if (err) {
          reject(err);
        } else if (this.changes !== 1) {
          resolve({ error: 'Film not found.' });
        } else {
          self.getWithId(id)
            .then(f => resolve(f)) //
            .catch(e => reject(e)); //cattura errore la promise e lo stampa lato server
        }
      });
    });
  };

  //api 6
  this.deleteWithId = (id) => {
    return new Promise((resolve, reject) => { //promise oggetto che rappresenta un dato che ottieni in modo asincrono. Ritorna subito una promise(non un valore) , quando la funz asincroa termina la promise viene valorizzata e ti da il valore
      if(!isIntegerString(id)){
        reject(new Error ('ID is not a number'));
        return;
      }
      const query = 'DELETE FROM films WHERE id = ?';
      db.run(query, [id], (err, row) => { 
        if(err) {
          reject(err);
        }
        else {
          if (row == undefined) { //check if the id that i'm serching for currently exist in db
            resolve({ error: 'Film not found.' });
          } else {
            console.log(' delete db.run');
            resolve(null);
          }
        }
      });
    });
  };

  //api 7
  this.getAllFavorite = () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM films WHERE favorite = 1' ;
      db.all(query, [], (err, rows) => {
        if(err) {
          reject(err);
        }
        else {
          const films = rows.map(record => new Film(record.id, record.title, record.favorite == 1, record.watchdate, record.rating));
          resolve(films);
        }
      });
    });
  };

  //api 7 film seen in the last 30 days
  this.getAllLastMonth = () => {
    return new Promise((resolve, reject) => {
      const today = dayjs();
      const thirtyDaysAgo = today.subtract(30, 'day');
  
      const query = `
        SELECT * FROM films 
        WHERE watchdate IS NOT NULL 
        AND watchdate >= ? 
        AND watchdate <= ?
      `;
      db.all(query, [thirtyDaysAgo.format('YYYY-MM-DD'), today.format('YYYY-MM-DD')], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const films = rows.map(record => new Film(record.id, record.title, record.favorite == 1, record.watchdate, record.rating));
          resolve(films);
        }
      });
    });
  };

  //api 7
  this.getAllUnseen = () => { 
    return new Promise((resolve, reject) => { //watchdate
      const query = "SELECT * FROM films WHERE watchdate IS NULL OR watchdate = '' OR watchdate = '[object Object]'";
      db.all(query, [], (err, rows) => {
        if(err) {
          reject(err);
        }
        else {
          const films = rows.map(record => new Film(record.id, record.title, record.favorite == 1, record.watchdate, record.rating));
          console.log('unseen films: ', films);
          resolve(films);
        }
      });
    });
  };

  //api 7
  this.getAllBest = () => { 
    return new Promise((resolve, reject) => { //watchdate
      const query = 'SELECT * FROM films WHERE rating =5' ;
      db.all(query, [], (err, rows) => {
        if(err) {
          reject(err);
        }
        else {
          const films = rows.map(record => new Film(record.id, record.title, record.favorite == 1, record.watchdate, record.rating));
          resolve(films);
        }
      });
    });
  };

}

module.exports = FilmLibrary;