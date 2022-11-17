// dotenv init
require('dotenv').config()

// express init
const express = require('express')
const app = express()

// ejs init
app.set('view engine', 'ejs');

// get constants from .env file
const PORT = process.env.PORT || 3000
const LESTA_APP_ID = process.env.LESTA_APP_ID

// https init
const https = require('https')

// set up default path to content
app.use(express.static(`${__dirname}/views`));

app.get('/auth', (req, res) => {
    res.redirect(`https://api.tanki.su/wot/auth/login/?application_id=${LESTA_APP_ID}&redirect_uri=http://localhost:${PORT}/auth_back`)
})

app.get("/auth_back", (req, res) => {
    res.redirect("/", {
        lesta_auth: req.query
    })
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
                    res.render("stat", { lesta: parsedData.data[req.query.id], queryParams: req.query })
                } else {
                    res.send("Такого игрока не существует!")
                }
            } catch {
                res.render("stat_searchPlayer", { lesta: { nickname: null } })
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
                res.render("search", { lesta: parsedData, q: req.query.q })
            })
        })
    }
})

app.get('/*', (req, res) => {
    res.redirect("/stat")
})

app.listen(PORT, () => {
    console.log(`BlitzSession app listening on PORT ${PORT}`)
})