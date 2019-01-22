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

app.post('/monitor-custom-yes',(req,res) => {
    var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.echoText
      ? req.body.result.parameters.echoText
      : "Seems like some problem. Speak again.";
    return res.json({
    speech: speech,
    displayText: speech,
    source: "webhook-echo-sample"
    });

});

app.post("/echo", function(req, res) {
  var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.echoText
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
