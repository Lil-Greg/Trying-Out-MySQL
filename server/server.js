// dotenv is in use so one does not have to continuously
// do the env stuff explained below lol

require("dotenv").config({ path: "../.env" });

const mysql = require('mysql2');
const express = require('express');
const cors = require("cors");

const corsOptions = {
    origin: [`http://${process.env.VITE_CLIENT_HOST}:${process.env.VITE_CLIENT_PORT}`]
};

// to get the env stuff, make the env file
// then do word for word (if the name of the file is simply .env):
// node --env-file=.env server.js

const connection = mysql.createConnection({
    host: process.env.VITE_SERVER_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: 'testing'
});

connection.connect();

const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors(corsOptions));

const PORT = process.env.VITE_SERVER_PORT || 8080;

app.get('/api/users', (req, res) => {
    console.log("Called!!!");
    connection.query('SELECT * FROM users', (error, results) => {
        if (error) res.status(500).send(error);
        res.json(results); // Send data as JSON
    });
});

app.post('/api/users', (req, res, next) => {
    const formData = req.body;

    // There was a problem with fetching where the req.body 
    // was being returned as undefined and the problem was resolved
    // by simply adding a Content-Type property to the headers in the
    // fetch options lol
    if (!formData || !req.body) {
        console.log("FormData: ", req.body);
        console.log("Entire Request Object: ", req, "____ END");
        next();
    }
    if (formData.username.length === 0) {
        res.status(400).send("Actually make a Username");
        next();
    }
    if (formData.email.length === 0) {
        res.status(400).send("Actually make an Email");
        next();
    }
    connection.execute(
        'INSERT INTO Users(username, email, bio) VALUES (?, ?, ?)',
        [formData.username, formData.email, formData.bio], // these are the placeholders
        (error, results) => {
            if (error) res.status(500).send(error);
            res.json(results);
        }
    );
});

app.delete('/api/users', (req, res, next) => {
    const formData = req.body;

    if (!formData || !req.body) {
        res.status(435).send("Kore ga, Requiem... da");
        next();
    }
    if (!formData.id) {
        res.status(469).send("BRING ME THANOS!!");
        next();
    }

    connection.execute(
        'DELETE FROM Users WHERE id=?',
        [formData.id],
        (error, results) => {
            if (error) res.status(500).send(error);
            res.json(results);
        }
    )
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));