"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post("/webhook", function(req, res) {
  var user =
    req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.username
      ? req.body.queryResult.parameters.username
      : "Seems like some problem. Speak again.";
  var pass =
    req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.password
      ? req.body.queryResult.parameters.password
      : "Seems like some problem. Speak again.";
  var speech = user+pass;
  return res.json({
    fulfillmentText: "Sample response",
    speech: speech,
    displayText: speech,
    source: "tracking-sample"
  });
});
