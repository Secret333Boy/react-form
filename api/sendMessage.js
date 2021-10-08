const nodemailer = require('nodemailer');
const emailVaidation = new RegExp(
  // eslint-disable-next-line no-control-regex
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
);
module.exports = async (req, res) => {
  const fName = req.query.fName;
  const sName = req.query.sName;
  const email = req.query.email;
  const message = req.query.message;

  if (!email || !fName) {
    res.status(400);
    res.send('Bad request');
    return;
  }

  if (!email.match(emailVaidation)) {
    res.status(400);
    res.send('Email validation fail');
    return;
  }

  try {
    const transporter = await nodemailer.createTransport({
      service: 'GMAIL',
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASS,
      },
    });
    const mail = {
      from: `"Mailer" <${process.env.GMAIL}>`,
      to: email,
      subject: `Hello, ${fName} ${sName}✔`,
      text: message,
      html: `<b>${message}</b>`,
    };

    const info = await transporter.sendMail(mail);

    console.log('Message sent: %s', info.messageId);
    transporter.close();

    res.status(200);
    res.json({ messageId: info.messageId });
  } catch (error) {
    res.status(500);
    res.send('Internal server error');
    console.error(error);
    return;
  }
};
