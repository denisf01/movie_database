"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mysql2_1 = __importDefault(require("mysql2"));
dotenv_1.default.config();
const conn = mysql2_1.default.createConnection({
    host: "localhost",
    user: "root",
    database: "movie_database",
    password: "root",
    rowsAsArray: true,
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = process.env.PORT;
app.get("/", (req, res) => {
    res.send({
        message: "Hello",
    });
});
app.post("/api/users", (req, res) => {
    conn.query("SELECT * FROM users WHERE email = ?", [req.body.email], (_err, result) => {
        if (result.length) {
            res.status(406).send({
                message: "User already exists!",
            });
            return;
        }
        conn.query("INSERT INTO users (email, password) VALUE (?, ?)", [req.body.email, req.body.password], (_err, result) => {
            res.send({
                id: result.insertId,
                email: req.body.email,
                password: req.body.password,
            });
        });
    });
});
app.post("/test", (req, res) => {
    const name = req.body.name;
    conn.query("INSERT INTO test (name) VALUES (?)", [name], (_err, result) => {
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
    });
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
