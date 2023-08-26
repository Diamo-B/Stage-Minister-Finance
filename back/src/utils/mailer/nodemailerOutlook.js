const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const createTransporter = async () => {
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: process.env.OUTLOOK_MAIL,
            pass: process.env.OUTLOOK_PASS
        },
    });

    return transporter;
};

const sendMailScript = async (mailGenBody) => {
    try {
        const MailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'Recrutement MEF',
                link: 'http://localhost:5173',
            },
        });
        
        const mail = MailGenerator.generate(mailGenBody.response);
        const mailOptions = {
            from: process.env.OUTLOOK_MAIL,
            to: mailGenBody.recipientMail,
            subject: mailGenBody.subject,
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
