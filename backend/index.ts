import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mysql, { ResultSetHeader } from "mysql2";

dotenv.config();
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "movie_database",
  password: "root",
  rowsAsArray: true,
});

const app: Express = express();

app.use(express.json());
const port = process.env.PORT;

app.delete("/api/movies/:id", (req: Request, res: Response) => {
  const id = +req.params.id;
  conn.query("DELETE FROM movie_genres WHERE movie_id = ?", [id]);
  conn.query("DELETE FROM ratings_reviews WHERE movie_id = ?", [id]);
  conn.query("DELETE FROM user_watchlist WHERE movie_id = ?", [id]);
  conn.query("DELETE FROM movies WHERE id = ?", [id]);
});

app.delete("/api/reviews/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  conn.query("DELETE FROM ratings_reviews WHERE id = ?", [id]);
  res.send(null);
});

app.delete("/api/watchlist/:userId/:movieId", (req: Request, res: Response) => {
  const userId = req.params.userId;
  const movieId = req.params.movieId;
  conn.query("DELETE FROM user_watchlist WHERE user_id = ? AND movie_id = ?", [
    userId,
    movieId,
  ]);
});

app.post("/api/reviews", (req: Request, res: Response) => {
  conn.query<ResultSetHeader>(
    "INSERT INTO ratings_reviews(movie_id, user_id, rating_value, review_text) VALUES (?, ?, ?, ?)",
    [
      req.body.movie_id,
      req.body.user_id,
      req.body.rating_value,
      req.body.review_text,
    ],
    (_err, result: ResultSetHeader) => {
      if (!!_err) {
        console.log(_err);
        return;
      }
      res.send({
        id: result.insertId,
      });
    }
  );
});

app.post("/api/watchlist", (req: Request, res: Response) => {
  conn.query("INSERT INTO user_watchlist(user_id, movie_id) VALUES(?, ?)", [
    req.body.user_id,
    req.body.movie_id,
  ]);
});

app.get("/api/watchlist/:userId", (req: Request, res: Response) => {
  const userId = req.params.userId;
  conn.query(
    "SELECT movies.id FROM movies INNER JOIN user_watchlist ON movies.id = user_watchlist.movie_id WHERE user_id = ? ",
    [userId],
    (_err, result: any[]) => {
      if (!!_err) {
        console.log(_err);
        return;
      }
      res.send(
        result.map((el) => {
          return { movie_id: el[0] };
        })
      );
    }
  );
});

app.put("/api/movies/:id", (req: Request, res: Response) => {
  const movie: Movie = {
    id: req.body.id,
    title: req.body.title,
    description: req.body.description,
    img_url: req.body.img_url,
    release_year: req.body.release_year,
    genres: req.body.genres,
    reviews: [],
  };
  conn.query("DELETE FROM movie_genres WHERE movie_id = ?", [movie.id], () => {
    conn.query(
      "UPDATE movies SET title=?, description=?, release_year=?, img_url = ? WHERE id = ? ",
      [
        movie.title,
        movie.description,
        movie.release_year,
        movie.img_url,
        movie.id,
      ],
      () => {
        for (let genre of movie.genres) {
          conn.query("INSERT INTO movie_genres VALUES (?, ?)", [
            movie.id,
            genre.id,
          ]);
        }
      }
    );
  });
});

app.post("/api/movies", (req: Request, res: Response) => {
  const movie: Movie = {
    id: -1,
    title: req.body.title,
    description: req.body.description,
    img_url: req.body.img_url,
    release_year: req.body.release_year,
    genres: req.body.genres,
    reviews: [],
  };
  conn.query<ResultSetHeader>(
    "INSERT INTO movies(title, description, img_url, release_year) VALUES (?, ?, ?, ?)",
    [movie.title, movie.description, movie.img_url, movie.release_year],
    (_err, result: ResultSetHeader) => {
      if (!!_err) {
        console.log(_err);
        return;
      }
      movie.id = result.insertId;
      res.send(movie);
      for (let genre of movie.genres) {
        conn.query(
          "INSERT INTO movie_genres VALUES(?, ?)",
          [movie.id, genre.id],
          (_err, result) => {
            if (!!_err) {
              console.log(_err);
              return;
            }
          }
        );
      }
    }
  );
});

app.get("/api/movies", (req: Request, res: Response) => {
  let movies: Movie[] = [];

  conn.query("SELECT * FROM movies", (_err, result: [any]) => {
    for (let i = 0; i < result.length; ++i) {
      // single movie
      let movie: Movie = {
        id: result[i][0],
        title: result[i][1],
        description: result[i][2],
        img_url: result[i][3],
        release_year: result[i][4],
        genres: [],
        reviews: [],
      };
      conn.query(
        "SELECT genres.id, genres.name FROM genres INNER JOIN movie_genres ON genres.id = movie_genres.genre_id WHERE movie_genres.movie_id = ?",
        [result[i][0]],
        (_err, res1: [any]) => {
          if (!!_err) {
            console.log(_err);
            return;
          }
          for (let i = 0; i < res1.length; ++i) {
            // single genre
            movie.genres.push({ id: res1[i][0], name: res1[i][1] });
          }

          conn.query(
            "SELECT ratings_reviews.id, users.email, review_text, rating_value FROM ratings_reviews INNER JOIN movies ON movies.id = ratings_reviews.movie_id INNER JOIN users ON users.id = ratings_reviews.user_id WHERE movie_id = ? ",
            [result[i][0]],
            (_err, res1: [any]) => {
              if (!!_err) {
                console.log(_err);
                return;
              }

              for (let i = 0; i < res1.length; ++i) {
                // single review
                movie.reviews.push({
                  id: res1[i][0],
                  userEmail: res1[i][1],
                  message: res1[i][2],
                  rating: res1[i][3],
                });
              }
              movies.push(movie);
              if (movies.length === result.length) res.send(movies);
            }
          );
        }
      );
    }
  });
});

app.get("/api/genres", (req: Request, res: Response) => {
  conn.query("SELECT * FROM genres", (_err, result: [any]) => {
    if (!!_err) {
      console.log(_err);
      return;
    }
    res.send(
      result.map((result) => {
        return {
          id: result[0],
          name: result[1],
        };
      })
    );
  });
});

app.post("/api/users/register", (req: Request, res: Response) => {
  conn.query(
    "SELECT * FROM users WHERE email = ?",
    [req.body.email],
    (_err, result: [any]) => {
      if (result.length) {
        res.status(406).send({
          message: "User already exists!",
        });
        return;
      }
      conn.query<ResultSetHeader>(
        "INSERT INTO users (email, password) VALUE (?, ?)",
        [req.body.email, req.body.password],
        (_err, result: ResultSetHeader) => {
          res.send({
            id: result.insertId,
            email: req.body.email,
            password: req.body.password,
          });
        }
      );
    }
  );
});

app.post("/api/users/login/", (req: Request, res: Response) => {
  conn.query(
    "SELECT * FROM users WHERE email = ?",
    [req.body.email],
    (_err, result: [any]) => {
      if (!result.length) {
        res.status(404).send({
          message: "User does not exists!",
        });
      } else if (result[0][2] !== req.body.password) {
        res.status(403).send({
          message: "Wrong password!",
        });
      } else {
        res.send({
          id: result[0][0],
          email: result[0][1],
          password: result[0][2],
        });
      }
    }
  );
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
