import dayjs from 'dayjs';

const SERVER_URL = 'http://localhost:3000/api/';


/**
 * A utility function for parsing the HTTP response.
 */
function getJson(httpResponsePromise) {
  // server API always return JSON, in case of error the format is the following { error: <message> } 
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {

         // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
         response.json()
            .then( json => resolve(json) )
            .catch( err => reject({ error: "Cannot parse server response" }))

        } else {
          // analyzing the cause of error
          response.json()
            .then(obj => 
              reject(obj)
              ) // error msg in the response body
            .catch(err => reject({ error: "Cannot parse server response" })) // something else
        }
      })
      .catch(err => 
        reject({ error: "Cannot communicate"  })
      ) // connection error
  });
}

/**
 * Getting from the server side and returning the list of films.
 * The list of films could be filtered in the server-side through the optional parameter: filter.
 */
const getFilms = async (filter) => {
  console.log('filter: ', filter);
  const url = filter
    ? SERVER_URL + 'films/filter/' + filter   
    : SERVER_URL + 'films';

    console.log('url: ', url);

  return getJson(fetch(url)).then(json => {
    return json.map((film) => {
      const clientFilm = {
        id: film.id,
        title: film.title,
        favorite: film.favorite,
        rating: film.rating,
        user: film.user
      };
      if (film.watchDate != null)
        clientFilm.watchDate = dayjs(film.watchDate);
      return clientFilm;
    });
  });
};


const API = { getFilms };
export default API;