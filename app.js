const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https")

const app = express()

// we need to use static to transfer css style and images from localhost to server
// then on the local directory create public folder to store all local data to transfer into server

app.use(express.static("public"))

app.use(bodyParser.urlencoded({extended: true}))

const port = process.env.PORT || 3000
// when deploy to external server, the server will choose their own port number
// so should change port

app.get("/", (req, res)=>{

    res.sendFile(__dirname + "/signup.html")
    
    

})

app.post("/", (req, res) =>{
    const firstName = req.body.fname
    const lastName = req.body.lname
    const email = req.body.email

    // create JavaScript Object
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data)
    const url = "https://us12.api.mailchimp.com/3.0/lists/abcd69b23d"
    const options = {
        method : "POST",
        auth: "hoale1:e1dc9343814e339b659226cd4caf7e69-us12"
    }
    const request = https.request(url, options, (response)=>{
        console.log(response.statusCode);
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        }else{
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data",(data)=>{
            console.log(JSON.parse(data))
        })
    })
    // send jsonData to mailchimp

    request.write(jsonData)
    request.end()

    
    

})

app.post("/failure", (req, res)=>{
    res.redirect("/")
})


app.listen(port, () =>{
    console.log(`Server is running in ${port}`);
})

// API key for mailchim : e1dc9343814e339b659226cd4caf7e69-us12

// list id: abcd69b23d