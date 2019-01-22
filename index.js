'use strict';

const express = require('express');
const bodyPaser = require('body-parser');
const mysql = require('mysql');

const db = mysql.createConnection({
    host     :  'localhost',
    user     :  'id7769008_thiti7600',
    password :  'dew28433',
    database :  'id7769008_trackingventilator'
});

db.connect((err) => {
    if(err){
        console.log(err);
    }
    console.log('MySql Connected...');
});

const app = express();

app.use(
    bodyPaser.urlencoded({
        extended: true
    })
);

app.use(bodyPaser.json());

app.post('/monitor-custom-yes',(req,res) => {
    var user = req.body.result.parameters.username;
    var pass = req.body.result.parameters.password;
    var speech = 'hellofromtheotherside';
    //let sql = `SELECT * FROM customer WHERE Cus_ID = ${user} and Cus_Pass ${pass}`;
    //let query = db.query(sql, (err,result) => {
    //    if(err) speech = 'Cannot Found';
    //    speech = 'Found!';
    //});

    return res.json({
            "type": "text",
            "text": speech
    });
});

app.post("/echo", function(req, res) {
  var speech =
    req.body.result &&
    req.body.result.parameters &&
    req.body.result.parameters.echoText
      ? req.body.result.parameters.echoText
      : "Seems like some problem. Speak again.";
  return res.json({
    speech: speech,
    displayText: speech,
    source: "webhook-echo-sample"
  });
});

app.listen(process.env.PORT ||'3000',() => {
    console.log('Server up!');
});
