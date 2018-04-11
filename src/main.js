const express = require("express")
const bodyParser = require("body-parser")
const fs = require("fs")

const standardMessage = "DBC00001000C0134000000005ACDEE6448656C6C6F210000"

const app = express()
app.use(bodyParser.json())

app.post("/", (req, res) => {
    fs.appendFile("log.txt", JSON.stringify(req.body), err => {
        if(err) throw err
    })
    res.end()
})

app.listen(3000)