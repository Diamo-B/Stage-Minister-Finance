const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const createTransporter = async () => {
    const oauth2Client = new OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN,
    });

    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
            if (err) {
                console.error('*ERR: ', err);
                reject('Failed to create access token :( ');
            }
            resolve(token);
        });
    });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL,
            accessToken: accessToken,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
        },
    });

    return transporter;
};

const sendMailScript = async (recipient, code) => {
    try {
        const MailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'Recrutement MEF',
                link: 'http://localhost:5173',
            },
        });

        const response = {
            body: {
                greeting: `${recipient.titre === "M" ? "Cher" : "chère"} ${recipient.titre}.`,
                name: `${recipient.prenom} ${recipient.nom}`,
                intro: "Bienvenue sur la plateforme e-Recrutement du Ministère de l'Économie et des Finances ! Nous vous souhaitons bonne chance pour vos prochains concours.",
                action: {
                    instructions: 'Veuillez trouver votre code de vérification ci-dessous :',
                    button: {
                        color: '#7986cb', //22BC66
                        text: `<span style="font-size: 26px; font-weight: bold; font-family:'Times New Roman', Times, serif;">${code}</span>`
                    },
                },
                outro: "Besoin d'aide ou avez-vous des questions ? Il vous suffit de répondre à cet e-mail, nous serions ravis de vous aider.",
                signature: 'Cordialement',
            },
        };

        const mail = MailGenerator.generate(response);
        const mailOptions = {
            from: process.env.EMAIL,
            to: `${recipient.email}`,
            subject: 'Plateforme de recrutement MEF',
            html: mail,
        };

        const emailTransporter = await createTransporter();
        return new Promise((resolve, reject) => {
            emailTransporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(info);
                }
            });
        });
    } catch (err) {
        throw new Error('Failed to send email: ' + err.message);
    }
};

module.exports = sendMailScript;
