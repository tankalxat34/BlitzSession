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
        // res.render("stat", { lesta: { nickname: "nkatnt" } })
        // console.log(resp)
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            let parsedData = JSON.parse(data);
            try {
                res.render("stat", {lesta: parsedData.data[req.query.id], queryParams: req.query})                
            } catch {
                res.send("Ошибка! Необходим параметр id в запросе")
            }
        });
    })
})

app.get('/', (req, res) => {
    console.log(req)
    res.render("full_stat", { lesta_auth: {} })
    // res.render("full_stat", {lesta_auth: })
})

app.listen(PORT, () => {
    console.log(`Example app listening on PORT ${PORT}`)
})