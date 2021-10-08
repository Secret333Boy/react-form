const nodemailer = require('nodemailer');
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
