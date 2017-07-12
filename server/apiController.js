const axios = require('axios');
<<<<<<< HEAD
const db = require('../database/dbSetup.js');
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
||||||| merged common ancestors
=======
<<<<<<< HEAD
>>>>>>> unstaged unused/dummy data  work for dbsetup, lighteningwrapper, apicontroller


const omdbUrl = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=`;
const theMovieDbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=`;
const theMovieDbPosterUrl = `http://image.tmdb.org/t/p/w185`;
<<<<<<< HEAD
||||||| merged common ancestors

const omdbUrl = `http://www.omdbapi.com/?apikey=${process.env.omdbApiKey}&t=;`;
=======
||||||| merged common ancestors
=======
||||||| merged common ancestors
const db = require('../database/dbSetup.js');
// >>>>>>> revert: configure API route and controller  for tags
=======

const async = require('async');
const db = require('../database/dbsetup.js');

<<<<<<< HEAD
>>>>>>> attempted more seed data
>>>>>>> unstaged unused/dummy data  work for dbsetup, lighteningwrapper, apicontroller
||||||| merged common ancestors
||||||| merged common ancestors
const db = require('../database/dbSetup.js');
// >>>>>>> revert: configure API route and controller  for tags
=======

const async = require('async');
const db = require('../database/dbsetup.js');

>>>>>>> attempted more seed data
=======
>>>>>>> feat($launchpad): created launchpad demo
const omdbUrl = `http://www.omdbapi.com/?apikey=${process.env.omdbApiKey}&t=;`;
>>>>>>> rebasing after merge, dbsetup
||||||| merged common ancestors
=======

>>>>>>> rebasing after merge, dbsetup
||||||| merged common ancestors
=======
||||||| merged common ancestors
const omdbUrl = `http://www.omdbapi.com/?apikey=${process.env.omdbApiKey}&t=;`;
=======
||||||| merged common ancestors
const db = require('../database/dbSetup.js');
// >>>>>>> revert: configure API route and controller  for tags
=======

const async = require('async');
const db = require('../database/dbsetup.js');

>>>>>>> attempted more seed data
const omdbUrl = `http://www.omdbapi.com/?apikey=${process.env.omdbApiKey}&t=;`;
>>>>>>> unstaged unused/dummy data  work for dbsetup, lighteningwrapper, apicontroller
>>>>>>> unstaged unused/dummy data  work for dbsetup, lighteningwrapper, apicontroller
const quoteUrl = `https://andruxnet-random-famous-quotes.p.mashape.com/?cat=movies&count=1"`;
const regex = /[^a-zA-Z0-9]+/g;
const QUOTE_API_KEY = process.env.QUOTE_API_KEY;

const getYouTubeUrl = (title) => {
  const titleForUrl = title.replace(regex, '+');
  console.log('Url is: ', titleForUrl);
  return `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${titleForUrl}+movie+trailer&key=${process.env.YOUTUBE_API_KEY}`;
};
// HARD CODED REQUESTS
module.exports.checkSession = (req, res, next) => {
  if (req.sessionID) {
    db.session.findOne({
      where: { sid: req.sessionID },
      include: [{ model: db.users, as: 'User' }]
    })
    .then((sessionSave) => {
      if (sessionSave) {
        if (sessionSave.userId) {
          return res.send({ success: true, message: 'authentication succeeded', profile: sessionSave.User });
        }
        return res.send({ success: false, message: 'session exists but userId is not assigned', profile: null });
      }
      return res.send({ success: false, message: 'no session found', profile: null });
    });
  } else {
    next();
  }
};


module.exports.getTwoMovies = (req, res) => {
  // At first, randomly select two movies from DB
  let firstMovieId = null;
  let secondMovieId = null;

  // Movie IDs from table MUST remain sequential
  // in the form this is currently coded
  db.movies.count()
    .then((maxMovieCount) => {
      firstMovieId = Math.ceil(Math.random() * maxMovieCount);
      do {
        secondMovieId = Math.ceil(Math.random() * maxMovieCount);
      } while (firstMovieId === secondMovieId);
      console.log(`Chose movie IDs ${firstMovieId} and ${secondMovieId}`);
      return [firstMovieId, secondMovieId];
    })
    .then(idArray =>
      idArray.map(id =>
        new Promise((resolve, reject) =>
          db.movies.find({ where: { id } })
            .then(foundMovie => resolve(foundMovie))
            .catch(error => reject(error))
        )
      )
    )
    .then(dbPromises => Promise.all(dbPromises))
    .then(resultsArray => res.status(200).send(resultsArray))
    .catch(error => res.status(500).send(error));
};

module.exports.handleLightningSelection = (req, res) => {
  console.log('Lightning selection: ', req.body.movie);
  res.sendStatus(201);
};

// Placeholder logic
module.exports.getUserResults = (req, res) => {
  // We don't yet need the user info in the next line
  // const { user } = req.session.passport;
  // console.log('USER IS: ', user);

  // Placeholder logic, selects five random movies.
  db.movies.count()
    .then((maxMovieCount) => {
      const moviesToGrab = [];

      // Create objects for the Movie.findAll $or operator,
      // which takes objects like this { dbColumn: columnValue }
      for (let i = 0; i < 4; i += 1) {
        let randomMovieId = Math.floor(Math.random() * (maxMovieCount + 1));

        // Need to handle if 0 bc no id 0 in table.
        // Also the linter didn't like the simple way I wrote this at first
        randomMovieId = randomMovieId === 0 ? 1 : randomMovieId;
        moviesToGrab.push({
          id: randomMovieId
        });
      }
      console.log('Calling Movie.findAll with: ', ...moviesToGrab);
      db.movies.findAll({
        where: {
          $or: [...moviesToGrab]
        }
      })
        .then(movies => res.send(movies))
        .catch(err => res.status(500).send('Error finding movies: ', err));
    });
};

module.exports.getQuote = (req, res) => {
  axios(quoteUrl, {
    method: 'GET',
    headers: { 'X-Mashape-Key': QUOTE_API_KEY }
  })
    .then(results => res.send(results.data))
    .catch(err => res.status(500).send(err));
};

module.exports.getTrailer = (req, res) => {
  const url = getYouTubeUrl(req.body.movie.title);
  axios.get(url)
    .then(results => res.send(results.data.items[0]))
    .catch(err => res.sendStatus(404).send(err));
};
<<<<<<< HEAD

module.exports.getSearchAutoComplete = (req, res) => {
  const { query } = req.body;
  const url = theMovieDbUrl + query;
  axios.get(url)
    .then(results => res.send(results.data.results))
    .catch(err => {
      console.log('Error in autocomplete: ', err);
      res.status(500).send(err);
    });
};


module.exports.handleMovieSearchTMDB = (req, res) => {
  let { movieName } = req.body;
  movieName = movieName.replace(regex, '+');
  const searchUrl = theMovieDbUrl + movieName;
  console.log(searchUrl);
  axios.post(searchUrl)
    .then(results => {

      // Shape the data from The Movie Database into
      // what OMDB API uses
      const movies = results.data.results.map((movie) => {
        const posterUrl =
          movie.poster_path ? theMovieDbPosterUrl + movie.poster_path : '';

        return {
          title: movie.title,
          plot: movie.overview,
          year: movie.release_date.slice(0, 4),
          poster: posterUrl
        };
      });
      res.send(movies);
    })
    .catch(err => res.status(500).send(err));
};

// Testing. Not currently used.
module.exports.handleMovieSearchOMDB = (req, res) => {
  let { movieName } = req.body;
  movieName = movieName.replace(regex, '+');
  const searchUrl = omdbUrl + movieName;
  console.log(searchUrl);
  axios.post(searchUrl)
    .then(results => res.send(results.data))
    .catch(err => res.status(500).send(err));
};

/*

{
    "vote_count": 5351,
    "id": 1891,
    "video": false,
    "vote_average": 8.2,
    "title": "The Empire Strikes Back",
    "popularity": 3.812604,
    "poster_path": "/6u1fYtxG5eqjhtCPDx04pJphQRW.jpg",
    "original_language": "en",
    "original_title": "The Empire Strikes Back",
    "genre_ids": [
        12,
        28,
        878
    ],
    "backdrop_path": "/amYkOxCwHiVTFKendcIW0rSrRlU.jpg",
    "adult": false,
    "overview": "The epic saga continues as Luke Skywalker, in hopes of defeating the evil Galactic Empire, learns the ways of the Jedi from aging master Yoda. But Darth Vader is more determined than ever to capture Luke. Meanwhile, rebel leader Princess Leia, cocky Han Solo, Chewbacca, and droids C-3PO and R2-D2 are thrown into various stages of capture, betrayal and despair.",
    "release_date": "1980-05-17"
}
*/
<<<<<<< HEAD
||||||| merged common ancestors
=======

module.exports.getMovies = (req, res) => {
  db.movies.findAll().then((movie) => {
    console.log('THIS IS MY CALL', movie);
    res.send(movie);
  })
    .catch(err => res.status(500).send(err));
};

// module.exports.postTags = (req, res) => {
//   db.movies
//     .findAll()
//     .then(movies => res.status(200).send(movies))
//     .catch(err => res.status(500).send(err));
// };

<<<<<<< HEAD
<<<<<<< HEAD

// information page component that inserts a count 
||||||| merged common ancestors



<<<<<<< HEAD
// information page component that inserts a count 
>>>>>>> rebasing after merge, dbsetup
||||||| merged common ancestors
// information page component that inserts a count 
=======




// information page component that inserts a count 
=======
// information page component that inserts a count 
module.exports.postTags = (req, res) => {
  const movie = req.body.movies;
  db.tags.migrateTags().then(tag => res.json(tag))
  .catch(err => res.status(500).send(err));
}

const migrateTags = () => {
  db.movies.findAll({limit: 100}).then((movies) => {
    async.each(movies, (movie, callback) => {
      tag1 = movie.title;
      tag2 = movie.genre;
      tag3 = movie.plot;
      async.each([tag1, tag2, tag3], (tag, callback) => {
        db.tags.create({tagName: tag})
        .then((tag)=>{})
        .catch(err=> {
          console.log(err)
        })
      }, (err) => {
        console.log("errr in second")
      })
    }, (err) => {
      console.log("errr in first")
    });
  });
};
// migrateTags(); 

module.exports.postUserTags = (req, res) => {
  let clickedTag = {movie: req.body.movie};
  let user = 2;
  let tag_Id = 'The Godfather';

  // clickedTag.findAll().then((tags) => {
    async.each(clickedTag, (tag, callback) => {
      // console.log('WHATS TAG', tag.title);
      title = tag.title;
      genre = tag.genre;
      rated = tag.rated;
      year = tag.year;
      director = tag.director;
      actors = tag.actors;
      // allows to make multiple db rows 
      async.each([title, genre, rated, year, director, actors], (tag, callback) => {
        tag
        db.tags.find({where: { tagName } })
               .then(        
               db.userTags.create({user_Id: user, tag_Id: tag})
                .then((tag)=>{})
                .catch(err=> {
                  console.log(err)
                }))
        // console.log('WHATS TAG', tagName);
        console.log('WHATS TAG', tagID);
        // db.userTags.create({user_Id: user, tag_Id: tagId})
        //   .then((tag)=>{})
        //   .catch(err=> {
        //     console.log(err)
        //   })
      }, (err) => {
        console.log("errr in second")
      })
    }, (err) => {
      console.log("errr in first")
    });
    console.log('clickedMovie', clickedTag);
  // })
}

const clickUserTags = (tag, movieData) => {
  db.tags.findAll({
    where: {
      tagName: {
        $contains: movieData[tag]
      }
    }
  })
  .then(movies =>{
    console.log('USERTAGS', movies)
  })
  .catch(err => res.status(500).send(err));
};
>>>>>>> attempted more seed data
>>>>>>> unstaged unused/dummy data  work for dbsetup, lighteningwrapper, apicontroller
||||||| merged common ancestors
<<<<<<< HEAD

// information page component that inserts a count 
||||||| merged common ancestors







// information page component that inserts a count 
=======
// information page component that inserts a count 
module.exports.postTags = (req, res) => {
  const movie = req.body.movies;
  db.tags.migrateTags().then(tag => res.json(tag))
  .catch(err => res.status(500).send(err));
}

const migrateTags = () => {
  db.movies.findAll({limit: 100}).then((movies) => {
    async.each(movies, (movie, callback) => {
      tag1 = movie.title;
      tag2 = movie.genre;
      tag3 = movie.plot;
      async.each([tag1, tag2, tag3], (tag, callback) => {
        db.tags.create({tagName: tag})
        .then((tag)=>{})
        .catch(err=> {
          console.log(err)
        })
      }, (err) => {
        console.log("errr in second")
      })
    }, (err) => {
      console.log("errr in first")
    });
  });
};
// migrateTags(); 

module.exports.postUserTags = (req, res) => {
  let clickedTag = {movie: req.body.movie};
  let user = 2;
  let tag_Id = 'The Godfather';

  // clickedTag.findAll().then((tags) => {
    async.each(clickedTag, (tag, callback) => {
      // console.log('WHATS TAG', tag.title);
      title = tag.title;
      genre = tag.genre;
      rated = tag.rated;
      year = tag.year;
      director = tag.director;
      actors = tag.actors;
      // allows to make multiple db rows 
      async.each([title, genre, rated, year, director, actors], (tag, callback) => {
        tag
        db.tags.find({where: { tagName } })
               .then(        
               db.userTags.create({user_Id: user, tag_Id: tag})
                .then((tag)=>{})
                .catch(err=> {
                  console.log(err)
                }))
        // console.log('WHATS TAG', tagName);
        console.log('WHATS TAG', tagID);
        // db.userTags.create({user_Id: user, tag_Id: tagId})
        //   .then((tag)=>{})
        //   .catch(err=> {
        //     console.log(err)
        //   })
      }, (err) => {
        console.log("errr in second")
      })
    }, (err) => {
      console.log("errr in first")
    });
    console.log('clickedMovie', clickedTag);
  // })
}

const clickUserTags = (tag, movieData) => {
  db.tags.findAll({
    where: {
      tagName: {
        $contains: movieData[tag]
      }
    }
  })
  .then(movies =>{
    console.log('USERTAGS', movies)
  })
  .catch(err => res.status(500).send(err));
};
>>>>>>> attempted more seed data
=======
// information page component that inserts a count
>>>>>>> feat($launchpad): created launchpad demo
||||||| merged common ancestors
=======
||||||| merged common ancestors
=======

<<<<<<< HEAD
// information page component that inserts a count 
||||||| merged common ancestors
=======
<<<<<<< HEAD

// information page component that inserts a count 
||||||| merged common ancestors


>>>>>>> unstaged unused/dummy data  work for dbsetup, lighteningwrapper, apicontroller

<<<<<<< HEAD
||||||| merged common ancestors
// information page component that inserts a count 
=======



<<<<<<< HEAD
>>>>>>> rebasing after merge, dbsetup
||||||| merged common ancestors
=======

// information page component that inserts a count 
=======
// information page component that inserts a count 
module.exports.postTags = (req, res) => {
  const movie = req.body.movies;
  db.tags.migrateTags().then(tag => res.json(tag))
  .catch(err => res.status(500).send(err));
}

const migrateTags = () => {
  db.movies.findAll({limit: 100}).then((movies) => {
    async.each(movies, (movie, callback) => {
      tag1 = movie.title;
      tag2 = movie.genre;
      tag3 = movie.plot;
      async.each([tag1, tag2, tag3], (tag, callback) => {
        db.tags.create({tagName: tag})
        .then((tag)=>{})
        .catch(err=> {
          console.log(err)
        })
      }, (err) => {
        console.log("errr in second")
      })
    }, (err) => {
      console.log("errr in first")
    });
  });
};
// migrateTags(); 

module.exports.postUserTags = (req, res) => {
  let clickedTag = {movie: req.body.movie};
  let user = 2;
  let tag_Id = 'The Godfather';

  // clickedTag.findAll().then((tags) => {
    async.each(clickedTag, (tag, callback) => {
      // console.log('WHATS TAG', tag.title);
      title = tag.title;
      genre = tag.genre;
      rated = tag.rated;
      year = tag.year;
      director = tag.director;
      actors = tag.actors;
      // allows to make multiple db rows 
      async.each([title, genre, rated, year, director, actors], (tag, callback) => {
        tag
        db.tags.find({where: { tagName } })
               .then(        
               db.userTags.create({user_Id: user, tag_Id: tag})
                .then((tag)=>{})
                .catch(err=> {
                  console.log(err)
                }))
        // console.log('WHATS TAG', tagName);
        console.log('WHATS TAG', tagID);
        // db.userTags.create({user_Id: user, tag_Id: tagId})
        //   .then((tag)=>{})
        //   .catch(err=> {
        //     console.log(err)
        //   })
      }, (err) => {
        console.log("errr in second")
      })
    }, (err) => {
      console.log("errr in first")
    });
    console.log('clickedMovie', clickedTag);
  // })
}

const clickUserTags = (tag, movieData) => {
  db.tags.findAll({
    where: {
      tagName: {
        $contains: movieData[tag]
      }
    }
  })
  .then(movies =>{
    console.log('USERTAGS', movies)
  })
  .catch(err => res.status(500).send(err));
};
>>>>>>> attempted more seed data
>>>>>>> unstaged unused/dummy data  work for dbsetup, lighteningwrapper, apicontroller
>>>>>>> unstaged unused/dummy data  work for dbsetup, lighteningwrapper, apicontroller
