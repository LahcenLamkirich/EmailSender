const express = require('express');
const app = express() ;
const nodemailer = require('nodemailer');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
require('dotenv').config()
const ejs = require('ejs');

// Body Parser Middleware : 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// the views : 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
// public css 
app.use('/public', express.static('public'));

// The routes : 

var urlencoded = bodyParser.urlencoded({extended:false});

app.get("/", (req,res) => {
    res.render('index', {text: "This is lahcen Lamkirich"})
});


app.post('/sendEmail', urlencoded, (req,res) => {

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

    let mailList = [] 

    const allFileContents = fs.readFileSync(req.body.emailList, 'utf-8');

    allFileContents.split(/\r?\n/).forEach(line =>  {
      console.log(`Line from file: ${line}`);
      mailList.push(line)
    });


    let options = {
        from: req.body.emailSender,
        // to: mailList[0],
        subject: req.body.subject,
        text: req.body.bodyMsg,
        attachments: [
            {   
                filename: req.body.resume,
                content: fs.createReadStream(req.body.resume)
            },
        ]
    };

    mailList.forEach(email => {
        options.to = email ;
        transporter.sendMail(options, (err, data) => {
                if(err){
                    console.error(err)
                    res.send("Error" + err)
                } else {
                    console.log("Message %s sent : %s ", data.messageId, data.response)
                    res.setHeader("content", "nothing")
                    res.render('sentEmail') 
                }
        });
    })



}) // end of Post : 

app.listen(8000, () => {
    console.log("Listening in the port 8000 ... ")
}) ;