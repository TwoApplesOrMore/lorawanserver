const express = require("express")
const bodyParser = require("body-parser")
const fs = require("fs-extra")
const request = require("request")

// mock base64-compliant message to send back, when testing.
const standardMessage = "eFBUQnlwM25lRXpVdzdLTXJwOE8="

// URL to reach the LoPy
const downlinkurl = "https://integrations.thethingsnetwork.org/ttn-eu/api/v2/down/team2lorawan/lorawan2?key=ttn-account-v2.TNR_kCw1V0WyaCjbZT6_n5AHv-hf9PC2KlNDB4d3f_Q"

// standard TTN response, for the mock.
const response = {
    "dev_id": "lopy",
    "port": 1,
    "confirmed": false,
    "payload_raw": standardMessage
}

// setup our web application with express
const app = express()
app.use(bodyParser.json())
app.use(express.static("../public"))

// Method to send the message received from LoPy to other countries
// TODO: Implement broker. For now, log it into a file
app.post("/", (req, res) => {
    const payload = req.body.payload_raw
    if (payload === "AA==") {
        fs.appendFile("../log.txt", payload + "\n", err => {
            if (err) throw err
        })
        //send it on to other servers.
        res.end("Received the POST")
    }
})

// send function to send mock-message to LoPy. Can be changed slightly to send actual messages, 
// one the broker has been implemented.
app.post("/send", (req, res) => {
    new Promise((resolve, reject) => {
        // use the request library to send the message to LoPy
        request({
            url: downlinkurl,
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(response)
        }, (error, response, body) => {
            if (error) reject(error)
            resolve({
                response,
                body
            })
        })
    }).then(result => {
        res.end(JSON.stringify(result))
    })
})

app.get("/raws", async (req, res) => {
    const logExists = await fs.exists("../log.txt")
    if (!logExists) {
        res.status(204).json([]);
    } else {
        const logFile = await fs.readFile("../log.txt")
        const log = logFile.split("\n")
        res.json({
            log
        })
    }
})
app.listen(3000)