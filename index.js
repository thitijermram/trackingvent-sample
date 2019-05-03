const functions = require("firebase-functions");
const request = require("request-promise");

exports.LineAdapter = functions.https.onRequest((req, res) => {
  if (req.method === "POST") {
    if (req.body.events[0].message.type !== "text") {
      reply(req);
    } else {
      postToDialogflow(req);
    }
  }
  return res.status(200).send(req.method);
});

const reply = req => {
  return request({
    method: "POST",
    uri: `${LINE_MESSAGING_API}/reply`,
    headers: LINE_HEADER,
    body: JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: [
        {
          type: "text",
          text: JSON.stringify(req.body)
        }
      ]
    })
  });
};

const postToDialogflow = req => {
  req.headers.host = "bots.dialogflow.com";
  return request({
    method: "POST",
    uri: "https://bots.dialogflow.com/line/85659568-b9dd-48b8-ab2e-1b47ca5706ab/webhook",
    headers: req.headers,
    body: JSON.stringify(req.body)
  });
};
