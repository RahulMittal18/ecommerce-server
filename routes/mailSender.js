
const nodemailer = require('nodemailer')
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const dotenv = require("dotenv");
dotenv.config()



exports.sendMail = async (email, body,subject) => {
    // console.log(process.env.GMAIL_REFRESH_TOKEN);
    const myOAuth2Client = new OAuth2(
        process.env.GMAIL_CLIENT_ID,
        process.env.GMAIL_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    )
    myOAuth2Client.setCredentials({
        refresh_token: process.env.GMAIL_REFRESH_TOKEN
    });
    const myAccessToken = myOAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL,
            clientId: process.env.GMAIL_CLIENT_ID,
            clientSecret: process.env.GMAIL_CLIENT_SECRET,
            refreshToken: process.env.GMAIL_REFRESH_TOKEN,
            accessToken: myAccessToken 
        }
    });

    let from = `Store <${process.env.EMAIL}>`
    var mailOptions = {
        from: from,
        to: email,
        subject: subject,
        html: body
    };
    // console.log("hi");
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return false
        } else {
            console.log('Email sent: ' + info.response);
            return true
        }
    });
}