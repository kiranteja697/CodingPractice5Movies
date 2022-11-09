const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
//Helper Function1
const movieObjConversion = (dbObj) => {
  return {
    movieId: dbObj.movie_id,
    directorId: dbObj.director_id,
    movieName: dbObj.movie_name,
    leadActor: dbObj.lead_actor,
  };
};
//Helper Function2
const movieNameConversion = (Obj) => {
  return {
    movieName: Obj.movie_name,
  };
};
//Helper Function 3
const directorObjConversion = (Obj) => {
  return {
    directorId: Obj.director_id,
    directorName: Obj.director_name,
  };
};

//API 1---------------------

module.exports = app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
    SELECT
      movie_name
    FROM
      movie;`;
  const moviesArray = await db.all(getMoviesQuery);
  let result = moviesArray.map(movieNameConversion);
  response.send(result);
});
//API 2-------------------------

module.exports = app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;

  const postMoviesQuery = `
    INSERT INTO
      movie(director_id,movie_name,lead_actor)
    VALUES(
        '${directorId}',
        '${movieName}',
        '${leadActor}'      
      )`;
  const dbResponse = await db.run(postMoviesQuery);
  response.send("Movie Successfully Added");
});
//API 3------------------------------

module.exports = app.get("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const getMoviesQuery = `
    SELECT
      *
    FROM
      movie
    WHERE
      movie_id =${movieId};`;
  const movie = await db.get(getMoviesQuery);

  response.send(movieObjConversion(movie));
});
//API 4
module.exports = app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const updateMovieQuery = `
    UPDATE
      movie
    SET
      director_id = '${directorId}',
      movie_name = '${movieName}',
      lead_actor = '${leadActor}'
    WHERE
      movie_id = ${movieId};`;
  await db.run(updateMovieQuery);
  response.send("Movie Details Updated");
});
//API 5----------------------------------
module.exports = app.delete("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
    DELETE FROM
      movie
    WHERE
      movie_id = ${movieId};`;

  await db.run(deleteMovieQuery);
  response.send("Movie Removed");
});
//API 6------------------------------------
module.exports = app.get("/directors/", async (request, response) => {
  const getDirectorQuery = `
    SELECT
      *
    FROM
      director
     `;
  const directorsArray = await db.all(getDirectorQuery);
  const result = directorsArray.map(directorObjConversion);
  response.send(result);
});
//API 7-------------------------
module.exports = app.get(
  "/directors/:directorId/movies/",
  async (request, response) => {
    const { directorId } = request.params;
    const getDirectorQuery = `
    SELECT
      movie_name
    FROM
      movie
    WHERE
      director_id =${directorId};`;

    const director = await db.all(getDirectorQuery);
    let result = director.map(movieNameConversion);

    response.send(result);
  }
);
