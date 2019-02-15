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

app.get("/monitor-custom-yes",function(req, res){
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
    const db = mysql.createConnection({
        host     : 'sql12.freemysqlhosting.net',
        user     : 'sql12279126',
        password : 'IJ7Ckhkjng',
        database : 'sql12279126'
    });
    
    db.connect((err) => {
        if(err) console.log(err);
        console.log('MySQL!!');
        answer = 'MySQL';
    });
    
    let sql = `SELECT * FROM customer WHERE Cus_ID = ${user} and Cus_Password ${pass}`;
    let query = db.query(sql, (err,result) => {
        if(err) console.log('Cannot Query');
        console.log(result);
        answer = result;
    });
    return res.json({
       speech: user,
       displayText: user,
       source: "webhook-echo-sample"
    });
});

app.listen(process.env.PORT ||'3000',() => {
    console.log('Server up!');
});
