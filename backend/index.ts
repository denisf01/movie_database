import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mysql, { Connection, ConnectionOptions, ResultSetHeader } from "mysql2";

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

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Hello",
  });
});

app.post("/api/users", (req: Request, res: Response) => {
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

app.post("/test", (req: Request, res: Response) => {
  const name = req.body.name;
  conn.query<ResultSetHeader>(
    "INSERT INTO test (name) VALUES (?)",
    [name],
    (_err, result: ResultSetHeader) => {
      console.log(result);
      /**
     * @result: ResultSetHeader {
      fieldCount: 0,
      affectedRows: 0,
      insertId: 0,
      info: '',
      serverStatus: 2,
      warningStatus: 0,
      changedRows: 0
    }
     */
      res.send(result.insertId.toString());
    }
  );
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
