const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const sanitizeHtml = require('sanitize-html');

const emailValidation = new RegExp(
  // eslint-disable-next-line no-control-regex
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
);

const rateLimit = 3;
const rateTimeReset = 10; //in seconds
const rateList = {};

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

module.exports = async (req, res) => {
  try {
    await renewTransporter();
    const origin = req.headers['X-Forwarded-For'];
    if (!rateList[origin]?.value) rateList[origin] = { value: 0, timer: null };

    if (rateList[origin].timer) {
      clearTimeout(rateList[origin].timer);
    }
    rateList[origin].timer = setTimeout(() => {
      delete rateList[origin];
    }, rateTimeReset * 1000);
    rateList[origin].value++;
    if (rateList[origin].value > rateLimit) {
      res.status(429);
      res.json('Too many requests');
      return;
    }

    const { firstName, secondName, email } = JSON.parse(req.body);
    const message = sanitizeHtml(JSON.parse(req.body).message, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    });

    if (!email || !firstName) {
      res.status(400);
      res.json('Bad request');
      return;
    }

    if (!email.match(emailValidation)) {
      res.status(400);
      res.json('Email validation fail');
      return;
    }
    const mail = {
      from: `"Mailer" <${process.env.GMAIL}>`,
      to: email,
      subject: `Hello, ${firstName} ${secondName}✔`,
      html: message,
    };

    const info = await transporter.sendMail(mail);
    console.log(`Message sent: ${info.messageId}`);

    res.status(200);
    res.json({ messageId: info.messageId });
  } catch (error) {
    res.status(500);
    res.json('Internal server error');
    console.error(error);
    return;
  }
};
