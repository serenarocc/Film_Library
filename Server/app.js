'use strict'; //Impedisce comportamenti ambigui (es. usare variabili non dichiarate).
//Questa variabile abilita o disabilita la funzionalità di cancellazione dei film (mostra o nasconde l’icona del cestino nella tabella).
const deleteOption = true;  // Enable or disable the optional part of the lab

// --- Definining Film & FilmLibrary --- //


/**
 * È una funzione costruttrice, cioè crea oggetti Film con proprietà e metodi:
        Proprietà:
            - id, title, favorite, rating
            - watchDate → oggetto dayjs, se presente
        Metodi (inseriti direttamente sull'istanza):
            - isFavorite, isBestRated, isSeenLastMonth, isUnseen
            - toString(), formatWatchDate(), formatRating()
    Questi metodi servono per applicare i filtri o formattare i dati per la visualizzazione.
 */
function Film(id, title, isFavorite = false, watchDate, rating = 0) {
    this.id = id;
    this.title = title;
    this.favorite = isFavorite;
    this.rating = rating;
    // saved as dayjs object only if watchDate is truthy
    this.watchDate = watchDate && dayjs(watchDate);  //Se è stata passata una data (watchDate), la converte in oggetto dayjs, altrimenti sarà undefined

    // Filters
    this.isFavorite =   () => { return this.favorite; } //Ritorna true se il film è preferito.
    this.isBestRated =  () => { return this.rating === 5; } //Ritorna true se il film ha voto massimo (5 stelle)


    /**
     * 
     *Controlla se il film è stato visto nell’ultimo mese:
      diff è la differenza tra la data del film e oggi in mesi.
      Se è compresa tra -1 e 0, è stato visto il mese scorso.
     */
    this.isSeenLastMonth = () => {
        if(!this.watchDate) return false;         // no watchDate
        const diff = this.watchDate.diff(dayjs(),'month')
        const ret = diff <= 0 && diff > -1 ;      // last month
        return ret;
    }

    this.isUnseen = () => {//Ritorna true se non ha una data di visione → quindi non è ancora stato visto.
        if(!this.watchDate) return true;     // no watchdate
        else return false;
    }
    
    this.toString = () => {  //Restituisce una stringa descrittiva dell’oggetto film
        return `Id: ${this.id}, ` +
        `Title: ${this.title}, Favorite: ${this.favorite}, ` +
        `Watch date: ${this.formatWatchDate('YYYY-MM-DD')}, ` +
        `Score: ${this.formatRating()}`;
    }
  
    this.formatWatchDate = (format) => {  //Restituisce la data formattata (es. "2024-04-10") oppure una stringa "non definita"
        return this.watchDate ? this.watchDate.format(format) : '<not defined>';
    }
  
    this.formatRating = () => {  //Restituisce il voto se esiste, altrimenti la stringa "non assegnato".
        return this.rating ? this.rating : '<not assigned>';
    }
}

/*
Una libreria che contiene tanti Film.
Proprietà:
    - list: un array di film
Metodi:
    - add(film): aggiunge un film
    - delete(id): rimuove un film per ID
    - filterAll, filterByFavorite, filterByBestRated, filterBySeenLastMonth, filterByUnseen: filtri predefiniti
Ogni filtro restituisce una nuova lista filtrata, senza modificare l’originale.
*/
function FilmLibrary() {
    this.list = [];//Crea una libreria di film (array interno chiamato list)

    this.add = (film) => {
        this.list = [...this.list, film]; //Aggiunge un film alla libreria, usando lo spread operator (crea una nuova copia dell'array con l'elemento in più)
        
        /*
        if (!this.list.some(f => f.id == film.id))
            this.list = [...this.list, film];
        else throw new Error('Duplicate id');
        */
    };

    // In the following methods we are using the "filter" method.
    // This method RETURNS A COPY of the "list" array, not the array itself, so we PRESERVE THE ORIGINAL array.

    //Tutti questi metodi usano .filter() per creare una nuova lista filtrata:
    this.filterAll = () => {
        return this.list.filter( () => true);
    }

    this.filterByFavorite = () => {
        return this.list.filter( (film) => film.isFavorite() );
    }

    this.filterByBestRated = () => {
        return this.list.filter( (film) => film.isBestRated() );
    }

    this.filterBySeenLastMonth = () => {
        return this.list.filter( (film) => film.isSeenLastMonth() );
    }

    this.filterByUnseen = () => {
        return this.list.filter( (film) => film.isUnseen() );
    }

    // This function permanently delete one element from the library
    this.delete = (id) => {  //Rimuove il film con l’id specificato
        this.list = this.list.filter( f => f.id != id );
    }

}


// --- Functions Definitions --- //

/**
 * Function to create a single film enclosed in a <tr> tag.
 * @param {*} film the film object.
 */
/**
 * Crea dinamicamente una riga HTML <tr> per ogni film:
    - <td> con il titolo
    - Checkbox per "preferito"
    - Data (formattata)
    - Stelle per il voto
    - Icona per cancellare (se deleteOption è attivo)
 */
function createFilmNode(film) {//

    const tr = document.createElement('tr'); 
    //tr.id = "film" + film.id;

    // creating a <p> for the title
    const titleP = document.createElement('p');
    if(film.isFavorite()) 
        titleP.className = 'favorite';
    titleP.innerText = film.title;

    const td1 = document.createElement('td');
    td1.appendChild(titleP);
    tr.appendChild(td1);


    // creating the checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = "check-f" + film.id;
    checkbox.className = 'custom-control-input';
    checkbox.checked = film.isFavorite();
   
    const td2 = document.createElement('td');
    td2.className = 'text-center';
    td2.appendChild(checkbox);
    tr.appendChild(td2);
    

    // creating a <small> element for the date
    const dateText = document.createElement('small');
    dateText.innerText = film.formatWatchDate('MMMM D, YYYY');

    const td3 = document.createElement('td');
    td3.appendChild(dateText);
    tr.appendChild(td3);


    // creating a <span> for the rating stars
    const ratingSpan = document.createElement('span');
    ratingSpan.className = 'empty-star';
    for(let i=0; i<5; i++) {
        const star = document.createElement('i');
        star.classList.add('bi');
        if (i < film.rating)
            star.classList.add('bi-star-fill');
        else
            star.classList.add('bi-star');
        ratingSpan.appendChild(star); 
    }

    const td4 = document.createElement('td');
    td4.appendChild(ratingSpan);
    tr.appendChild(td4);

    if (deleteOption) {
        const deleteSpan = document.createElement('span');
        deleteSpan.className = 'delete-icon';
        deleteSpan.id = 'film' + film.id;

        const trash = document.createElement('i');
        trash.className = 'bi bi-trash';
        deleteSpan.appendChild(trash);

        const td5 = document.createElement('td');
        td5.appendChild(deleteSpan);
        tr.appendChild(td5);
    }

    return tr;
}

/**
 * Function to create the list of films.
 */
function createListFilms(films) {
    const listFilms = document.getElementById("list-films");
    
    // Create table header
    const tr = document.createElement('tr');

    // Be careful using innerHTML for XSS, however with constant strings this is safe
    tr.innerHTML = '<th>Title</th> \
        <th class="text-center">Favorite</th> \
        <th>Last seen</th> \
        <th>Rating</th>'+ (deleteOption? '<th>Delete</th>' : '');
    listFilms.appendChild(tr);

    for (const film of films) {
        const filmNode = createFilmNode(film);
        listFilms.appendChild(filmNode);
    }
}

/**
 * Function to destroy the list of films.
 */
function clearListFilms() {
    const listFilms = document.getElementById("list-films");
    listFilms.innerHTML = '';    // Be careful using innerHTML for XSS, however with constant strings this is safe
}

/**
 * Function to manage film filtering in the web page.
 * @param {string}   filterId  The filter node id.
 * @param {string}   titleText The text to put in the film list content h1 header.
 * @param {function} filterFn  The function that does the filtering and returns an array of gilms.
 */

/*Gestisce i filtri selezionati dalla sidebar:
   - Toglie la classe active da tutti i link.
   - Imposta il titolo attuale.
    - Applica il filtro.
    Se deleteOption è attivo, registra l'evento di cancellazione su ogni icona cestino. */
function filterFilms( filterId, titleText, filterFn ) {
    
    document.querySelectorAll('#left-sidebar div a ').forEach( node => node.classList.remove('active'));
    document.getElementById('active-filter-name').innerText = titleText;
    document.getElementById(filterId).classList.add('active');
    clearListFilms();
    createListFilms(filterFn());

    if (deleteOption) {
        // register delete event handler for each film item
        document.querySelectorAll(".delete-icon").forEach(item => item.addEventListener('click', event => {
            const stringFilmId = event.currentTarget.id;
            //console.log(stringFilmId);
            const filmId = stringFilmId.slice('film'.length); // remove the initial 'film' string and leave only the number (filmId)
            filmLibrary.delete(filmId);
            filterFilms(filterId, titleText, filterFn);
            event.preventDefault();
        }));

    }

}



// ----- Main ----- //
/**Crea una nuova libreria.
Aggiunge tutti i film da un array globale FILMS 
Applica subito il filtro "All". */
const filmLibrary = new FilmLibrary();
FILMS.forEach(f => { filmLibrary.add(new Film(...f)); })
filterFilms( 'filter-all', 'All', filmLibrary.filterAll );
// ---------------- //


// --- Creating Event Listeners for filters --- //
/**
Un handler è una funzione che viene eseguita automaticamente quando accade un certo evento nella pagina web.
Un handler è "quello che succede quando clicchi" su qualcosa.
*/
/*Quando clicchi su un filtro: Viene richiamata filterFilms(...)
Si aggiorna il contenuto della tabella*/
document.getElementById("filter-all").addEventListener( 'click', event => 
    filterFilms( 'filter-all', 'All', filmLibrary.filterAll )
);

document.getElementById("filter-favorites").addEventListener( 'click', event => 
    filterFilms( 'filter-favorites', 'Favorites', filmLibrary.filterByFavorite )
);

document.getElementById("filter-best").addEventListener( 'click', event => 
    filterFilms( 'filter-best', 'Best Rated', filmLibrary.filterByBestRated )
);

document.getElementById("filter-seen-last-month").addEventListener( 'click', event => 
    filterFilms( 'filter-seen-last-month', 'Seen Last Month', filmLibrary.filterBySeenLastMonth )
);

document.getElementById("filter-unseen").addEventListener( 'click', event => 
    filterFilms( 'filter-unseen', 'Unseen', filmLibrary.filterByUnseen )
);