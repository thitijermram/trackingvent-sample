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

app.post('/monitor - custom - yes',(req,res) => {
    var user = req.body.result.parameters.username;
    var pass = req.body.result.parameters.password;

    const db = mysql.createConnection({
            host: 'localhost',
            user: 'id7769008_thiti7600',
            pass: 'dew28433',
            db  : 'id7769008_trackingventilator'
    });

    let sql = `SELECT * FROM customer WHERE Cus_ID = ${user} and Cus_Pass ${pass}`;

    let speech = 'hellofromtheotherside';
    
    db.query(sql, (err,result) => {
        if(err) console.log('Cannot Query');
        speech = result;
    });

    return res.json({
            speech: user,
            displayText: user,
            source: "webhook-sample"
    });
});

app.listen(process.env.PORT ||'3000',() => {
    console.log('Server up!');
});
