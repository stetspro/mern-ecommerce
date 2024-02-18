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

        logger.debug("[MAIL MODULE] Mail sent");
        return result;
    }

    async sendNewUserMail(user) {
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

    async sendResetPasswordMail(user, link) {
        const html = 
        `
            <div style="display: flex; flex-direction: row; gap: 10px">
                <h1>Reset your Ghibli Store password</h1>
                <p>
                    We heard that you lost your GitHub password. Sorry about that!

                    But don’t worry! You can use the following link to reset your password:
                </p>
                <a href=${link}>${link}</a>
                <p>
                    If you don’t use this link within 1 hours, it will expire.

                    Thanks,
                    The Ghibli Store Team
                </p>
            </div>
        `;

        const subject = '[Ghibli Store] Please reset your password';

        await this.send(user, subject, html);
    }

}