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

// set up default path to content
app.use(express.static(`${__dirname}/views`));

app.get('/auth', (req, res) => {
    res.redirect(`https://api.tanki.su/wot/auth/login/?application_id=${LESTA_APP_ID}&redirect_uri=http://localhost:${PORT}`)
})

app.get('/', (req, res) => {
    lesta_auth = req.query
    res.render("full_stat", {
        lesta_auth: lesta_auth
    })
})

app.listen(PORT, () => {
    console.log(`Example app listening on PORT ${PORT}`)
})