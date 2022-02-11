var express = require('express')
var app = express()
var bodyParser = require("body-parser")
const port = process.env.PORT || 3000
const https = require("https") // To deal with API requests and responses
const mailchimp = require("@mailchimp/mailchimp_marketing");

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("staticFiles"))

const apiKey = config.MY_API_KEY
var audienceId = config.AUDIENCE_ID;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html')
})

app.post('/', (req, res) => {
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            },
        }]
    }

    const jsonData = JSON.stringify(data)
    
    // PATH PARAMETERS:
    const url = "https://us14.api.mailchimp.com/3.0/lists/" + audienceId
    const options = {
        method: "POST",
        auth: "alitpc:"+apiKey
    }

    const request = https.request(url, options, function(response) {
        response.on("data", function(data) {
            console.log(JSON.parse(data))
        })

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }

    })

    request.write(jsonData);
    request.end()

})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})