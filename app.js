const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
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
//Helper Function
const convertDbObjToResponseObj = (dbObj) => {
  return {
    movieId: dbObj.movie_id,
    directorId: dbObj.director_id,
    movieName: dbObj.movie_name,
    leadActor: dbObj.lead_actor,
  };
};
const convertDbObjToDirectorObj = (dbObj) => {
  return {
    directorId: dbObj.director_id,
    directorName: dbObj.director_name,
  };
};

//API 1

module.exports = app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
    SELECT
      *
    FROM
      movie
    ORDER BY
      movie_id;`;
  const moviesArray = await db.all(getMoviesQuery);
  let result = moviesArray.map(convertDbObjToResponseObj);
  response.send(result);
});
//API 2

module.exports = app.post("/movies/", async (request, response) => {
  const postMoviesQuery = `
    INSERT INTO
      movie(director_id,movie_name,lead_actor)
    VALUES
      (
        ${directorId},
        ${movieName},
        ${leadActor}
           
      );`;
  const dbResponse = await db.run(postMoviesQuery);
  response.send("Movie Successfully Added");
});
//API 3

module.exports = app.get("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const getMoviesQuery = `
    SELECT
      *
    FROM
      movie
    ORDER BY
      movie_id =${movieId};`;
  const movie = await db.get(getMoviesQuery);

  response.send(convertDbObjToResponseObj(movie));
});
//API 4
module.exports = app.put("/movies/:movieID", async (request, response) => {
  const { movieID } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const updateMovieQuery = `
    UPDATE
      movie
    SET
      director_id = ${directorID},
      movie_name = ${movieName},
      lead_actor = ${leadActor}
    WHERE
      movie_id = ${movieID};`;
  await db.run(updateMovieQuery);
  response.send("Movie Details updated");
});
//API 5
module.exports = app.delete("/movies/:movieID", async (request, response) => {
  const { movieID } = request.params;
  const deleteMovieQuery = `
    DELETE FROM
      movie
    WHERE
      movie_id = ${movieID};`;

  await db.run(deleteMovieQuery);
  response.send("Movie Removed");
});
//API 6
module.exports = app.get("/directors/", async (request, response) => {
  const getDirectorQuery = `
    SELECT
      *
    FROM
      director
    ORDER BY
      director_id;`;
  const directorsArray = await db.all(getDirectorQuery);
  const result = convertDbObjToDirectorObj(directorsArray);
  response.send(result);
});
//API 7
module.exports = app.get(
  "/directors/:directorId/movies/",
  async (request, response) => {
    const { directorID } = request.params;
    const getDirectorQuery = `
    SELECT
      *
    FROM
      director
    WHERE
      director_id =${directorId};
      `;
    const director = await db.get(getDirectorQuery);
    response.send(director);
  }
);
