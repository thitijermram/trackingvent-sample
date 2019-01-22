'use strict';

const express = require('express');
const bodyPaser = require('body-parser');
const mysql = require('mysql');
const app = express();

app.use(
    bodyPaser.urlencoded({
        extended: true
    })
);

app.use(bodyPaser.json());

app.get('/',(req,res)=>{
    res.send('Hello World');
});

app.post("/monitor-custom-yes",function(req, res){
    var user =
    req.body.result &&
    req.body.result.parameters &&
    req.body.result.parameters.username
      ? req.body.result.parameters.username
      : "Seems like some problem. Speak again.";
    var pass = req.body.result &&
                req.body.result.parameters &&
                req.body.result.parameters.password
                ? req.body.result.parameters.password
                : "Seems like some problem. Speak again.";
    var answer = 'EZ';
    const db = mysql.createConnection({
            host: 'localhost',
            user: 'id7769008_thiti7600',
            pass: 'dew28433',
            db  : 'id7769008_trackingventilator'
    });
    let sql = `SELECT * FROM customer WHERE Cus_ID = ${user} and Cus_Pass ${pass}`;
    let query = db.query(sql, (err,result) => {
        if(err) console.log('Cannot Query');
        console.log(result);
        answer = result;
    });
    return res.json({
       speech: answer,
       displayText: answer,
       source: "webhook-echo-sample"
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
