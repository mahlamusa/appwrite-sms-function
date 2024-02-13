import { Client, Databases } from "node-appwrite";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const senderPhone = process.env.TWILIO_PHONE_NUMBER;

const twilio = require("twilio")(accountSid, authToken);

const payload = JSON.parse(process.env.APPWRITE_FUNCTION_DATA);

export default async ({ req, res, log, error }) => {
  const { receiver, message } = req.body;

  if (!receiver) {
    res.status(400).send("Bad Request. Receiver number not provided.");
    return;
  }

  if (!message) {
    res.status(400).send("Bad Request. A message was not provided.");
    return;
  }

  if (req.method != "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  twilio.messages
    .create({
      body: message,
      from: senderPhone,
      to: receiver,
    })
    .then((response) => {
      // Return the response after sending it
      return res.json({
        ok: true,
        message: "SMS sent successfully.",
        data: response.body,
      });
    })
    .catch((error) => {
      return res.status(400).json({
        ok: false,
        message: "Failed to send SMS.",
        error: error,
      });
    });
};

