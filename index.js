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
const WG_APP_ID = process.env.WG_APP_ID

app.get('/*', (req, res) => {
    res.render("full_stat")
})
app.get('/menu', (req, res) => {
    res.render("menu")
})

app.listen(PORT, () => {
    console.log(`Example app listening on PORT ${PORT}`)
})