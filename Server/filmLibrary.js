const sqlite = require('sqlite3');
const Film = require('./film');
const dayjs = require('dayjs');
const isIntegerString = (val) => Number.isInteger(Number(val)) && !isNaN(val) && val.trim() !== ''; //verificare caso spazio 5 numero con spazi - stringa spazi e nume ' 5 '
//se stringa contiene spazio dare false

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

  //torna film dato id
  this.getWithId = (id) => {
    return new Promise((resolve, reject) => {
      console.log('in promise');
      if(!isIntegerString(id)){
        console.log('errore');
        reject(new Error ('ID is not a number'));
        return;
      }
      console.log('out errore');
      const query = 'SELECT * FROM films WHERE id = ?';
      db.all(query, [id], (err, rows) => {
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

  
  //This function updates an existing film given its id and the new properties.
  this.updateFilm = (id, film) => {
      return new Promise((resolve, reject) => {
        const sql = 'UPDATE films SET title = ?, favorite = ?, watchDate = ?, rating = ? WHERE id = ?';
        db.run(sql, [film.title, film.favorite, film.watchDate, film.rating, id], function (err) {
        console.log('Updating film with values:', film, 'and id:', id);
        if (err) {
          reject(err);
        }
        if (this.changes !== 1) {
          resolve({ error: 'Film not found.' });
        } else {
          console.log('Updating film with values:', film, 'and id:', id);
          resolve(this.getWithId(id)); 
        }
        });
      });
  };

}

module.exports = FilmLibrary;