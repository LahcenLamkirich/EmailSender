const express = require('express');
const app = express() ;
const nodemailer = require('nodemailer');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const linereader = require("line-reader");

require('dotenv').config()

// Body Parser Middleware : 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// the views : 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
// public css 
app.use('/public', express.static('public'));

// the routes : 

var urlencoded = bodyParser.urlencoded({extended:false});

app.get("/", (req,res) => {
    res.render('index', {text: "This is lahcen Lamkirich"})
});


app.post('/sendEmail', urlencoded, (req,res) => {

    // console.log("The file is : " + req.body.emailList);
    // const fileContent = fs.readFileSync(req.body.emailList);
    // console.log('content : ' + fileContent)

    console.log("---------------------------------------")


    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "lahcen.lamkirich@gmail.com",
            pass: "kpgjknmrbllzbcyx"
        },
        tls: {
            rejectUnauthorized: false 
        }
    });

    linereader.eachLine(req.body.emailList, (email) => {
        console.log(email)
    })

    let options = {
        from: req.body.emailSender,
        to: "lam06.dev@gmail.com, l.lamkirich_etu@enset-media.ac.ma",
        subject: req.body.subject,
        text: req.body.bodyMsg,
    };

    transporter.sendMail(options, (err, data) => {
            if(err){
                console.error(err)
                res.send("Error" + err)
            }else {
                console.log("Message %s sent : %s ", data.messageId, data.response)
                res.send("Email Sent Succesfully !")
            }
    });

})

app.listen(8000, () => {
    console.log("Listening in the port 8000 ... ")
}) ;