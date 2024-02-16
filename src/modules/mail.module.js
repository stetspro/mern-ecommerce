import nodemailer from 'nodemailer'
import { logger } from '../utils/logger.js';
import config from '../config/config.js'

export default class Mail {

    constructor() {
        this.transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: config.mailUser,
                pass: config.mailPass
            }
        })
    }

    send = async(user, subject, html) => {
        const opt = {
            from: config.mailUser,
            to: user.email,
            subject,
            html
        }

        const result = await this.transport.sendMail(opt);

        logger.debug("[MAIL MODULE] Mail sent: ", result);
        return result;
    }

    sendNewUserMail(user) {
        const html = 
        `
            <h1>Bienvenido a Ghibli Store!</h1>
            <p>
                Email: ${user.email}
                Nombre completo: ${user.first_name} ${user.last_name}
            </p>
        `;

        const subject = 'Bienvenido a Ghibli Store';

        this.send(user, subject, html);
    }

}