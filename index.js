// dotenv init
require('dotenv').config()

// express init
const express = require('express')
const app = express()

// ejs init
app.set('view engine', 'ejs');

// fs init
const fs = require('fs');

// get constants from .env file
const PORT = process.env.PORT || 3000
const LESTA_APP_ID = process.env.LESTA_APP_ID

// init application name
const APP_NAME = "Tanks Session"

// https init
const https = require('https')

// set up default path to content
app.use(express.static(`${__dirname}/views`));


app.get("/example", (req, res) => {
    
    let rawdata = fs.readFileSync('views/src/examplePlayerData.json');
    let parsedData = JSON.parse(rawdata);
    req.query.id = 32416623
    try {
        if (parsedData.data[req.query.id]) {
            res.render("stat", { lesta: parsedData.data[req.query.id], queryParams: req.query, APP_NAME: APP_NAME })
        } else {
            res.send("Такого игрока не существует!")
        }
    } catch {
        res.render("stat_searchPlayer", { lesta: { nickname: null, APP_NAME: APP_NAME } })
    }

})

app.get("/stat", (req, res) => {
    https.get(`https://api.wotblitz.ru/wotb/account/info/?application_id=${LESTA_APP_ID}&account_id=${req.query.id}`, (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            let parsedData = JSON.parse(data);
            try {
                if (parsedData.data[req.query.id]) {
                    res.render("stat", { lesta: parsedData.data[req.query.id], queryParams: req.query, APP_NAME: APP_NAME })
                } else {
                    res.send("Такого игрока не существует!")
                }
            } catch {
                res.render("stat_searchPlayer", { lesta: { nickname: null, APP_NAME: APP_NAME } })
            }
        });
    })
})

app.get('/search', (req, res) => {
    if (new Number(req.query.q).valueOf(req.query.q)) {
        res.redirect(`/stat?id=${req.query.q}`);
    } else {
        https.get(`https://api.wotblitz.ru/wotb/account/list/?application_id=${LESTA_APP_ID}&search=${req.query.q}`, (resp) => {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                let parsedData = JSON.parse(data);
                if (parsedData.status === "ok" && parsedData.meta.count === 1) {
                    res.redirect(`/stat?id=${parsedData.data[0].account_id}`);
                }
                res.render("search", { lesta: parsedData, q: req.query.q, APP_NAME: APP_NAME })
            })
        })
    }
})

app.get('/about', (req, res) => {
    res.render("about", {port: PORT, APP_NAME: APP_NAME})
})

app.get('/*', (req, res) => {
    res.redirect("/stat")
})

app.listen(PORT, () => {
    console.log(`BlitzSession app listening on PORT ${PORT}`)
})