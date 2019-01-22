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

app.post('/monitor - custom - yes',(req,res) => {
    var user = req.body.result &&
                req.body.result.parameters &&
                req.body.result.parameters.username
                ? req.body.result.parameters.username
                : "Seems like some problem. Speak again.";
    var pass = req.body.result &&
                req.body.result.parameters &&
                req.body.result.parameters.password
                ? req.body.result.parameters.password
                : "Seems like some problem. Speak again.";
    return res.json({
            speech: user,
            displayText: user,
            source: "webhook-echo-sample"
    });
});

app.listen(process.env.PORT ||'3000',() => {
    console.log('Server up!');
});
