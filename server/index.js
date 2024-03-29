require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5050;
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const sanitizeHtml = require('sanitize-html');

const emailValidation = new RegExp(
  // eslint-disable-next-line no-control-regex
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
);

const rateLimit = 3;
const rateTimeReset = 10; //in seconds
const rateList = new Map();

const clientID = process.env.clientID;
const clientSecret = process.env.clientSecret;
const redirectURI = process.env.redirectURI;
const refreshToken = process.env.refreshToken;

const oAuth2Client = new google.auth.OAuth2(
  clientID,
  clientSecret,
  redirectURI
);
// eslint-disable-next-line camelcase
oAuth2Client.setCredentials({ refresh_token: refreshToken });
let accessToken = null;
let transporter = null;
const renewTransporter = async () => {
  try {
    accessToken = await oAuth2Client.getAccessToken();
    transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL,
        clientId: clientID,
        clientSecret,
        refreshToken,
        accessToken,
      },
    });
  } catch (e) {
    console.error(e);
  }
};
setInterval(renewTransporter, 4000 * 1000);

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('/apiIsAlive', async (req, res) => {
  res.status(200).json({ hello: 'Hello' });
});
app.post('/sendMessage', async (req, res) => {
  try {
    const originIP = req.headers['X-Forwarded-For'] || req.ip;
    const data = rateList.get(originIP) || { value: 0, time: null };
    if (data.time && Date.now() > data.time) {
      data.time = null;
      data.value = 0;
    }
    if (data.value === rateLimit || (data.time && Date.now() < data.time)) {
      data.time = new Date(Date.now() + rateTimeReset * 1000);
      res.status(429).send();
      return;
    }
    data.value++;
    rateList.set(originIP, data);

    const { firstName, secondName, email, message } = req.body;
    const cleanFirstName = sanitizeHtml(firstName);
    const cleanSecondName = sanitizeHtml(secondName);
    const cleanEmail = sanitizeHtml(email);
    const cleanMessage = sanitizeHtml(message, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    });

    if (!cleanEmail || !cleanFirstName) {
      res.status(400);
      res.statusMessage = 'Bad request';
      res.send();
      return;
    }

    if (!cleanEmail.match(emailValidation)) {
      res.status(400);
      res.statusMessage = 'Email validation fail';
      res.send();
      return;
    }

    await renewTransporter();
    const mail = {
      from: `"Mailer" <${process.env.GMAIL}>`,
      to: cleanEmail,
      subject: `Hello, ${cleanFirstName} ${cleanSecondName}✔`,
      html: cleanMessage,
    };
    const info = await transporter.sendMail(mail);
    console.log(`Message sent: ${info.messageId}`);

    res.status(200);
    res.json({ messageId: info.messageId });
  } catch (error) {
    res.status(500);
    res.json(error);
    console.error(error);
  }
});

app.get('*', (req, res) => {
  res.status(404).send();
});

app.listen(port, () => {
  console.log(`Server has been started on port ${port}`);
});
