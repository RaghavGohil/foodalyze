import nodemailer from "nodemailer";

export const sendMail = async (req, res) => {
  const { name, email, subject, message } = req.body;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_CLIENT_REFRESH_TOKEN,
      accessToken: null,
      expires: null,
    },
  });

  let mailOptions = {
    from: email,
    to: "foodalyzescan@gmail.com",
    subject: subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.redirect("/connect");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error sending email", err);
  }
};
