const express = require("express")
const bodyParser = require("body-parser")
const fs = require("fs")
const request = require("request")

const standardMessage = "DBC00001000C0134000000005ACDEE6448656C6C6F210000"

const downlinkurl = "https://integrations.thethingsnetwork.org/ttn-eu/api/v2/down/team2lorawan/lorawan2?key=ttn-account-v2.TNR_kCw1V0WyaCjbZT6_n5AHv-hf9PC2KlNDB4d3f_Q"

const app = express()
app.use(bodyParser.json())
app.use(express.static("../public"))

app.post("/", (req, res) => {
    fs.appendFile("log.txt", JSON.stringify(req.body), err => {
        if(err) throw err
    })
    //send it on to other servers.
    res.end("Received the POST")
})

const response = {
    "dev_id": "lopy",
    "port": 1,
    "confirmed": false,
    "payload_raw": "zKq7"
}

app.post("/send", (req, res) => {
    new Promise((resolve, reject) => {
        request.post(downlinkurl, response, (error, response, body) => {
            if(error) reject(error)
            resolve({
                response, body
            })
        })
    }).then(result => {
        res.end(result.body)
    })
})


// res.end("<!DOCTYPE html>\n<html><head><title>FirePy.nl</title></head><body>Welcome to FirePy.nl</body></html>")


app.listen(3000)