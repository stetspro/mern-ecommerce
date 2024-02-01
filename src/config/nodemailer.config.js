import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporterGmail = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.GOOGLE_ACC,
        pass: process.env.GOOGLE_PW
    }
});

async function sendNewUserMail(newUser) {
    try {
        const html = 
        `
            <h1>Bienvenido a Ghibli Store!</h1>
            <p>
                Email: ${newUser.email}
                Nombre completo: ${newUser.first_name} ${newUser.last_name}
            </p>
        `

        const mailOptions = {
            from: 'Ghibli Store',
            to: process.env.GOOGLE_ACC,
            subject: 'Bienvenido a Ghibli Store',
            html
        }

        const info = await transporterGmail.sendMail(mailOptions)
        //console.log(info)
    }
    catch (error) {
        //console.log(error)
    }

    return;
}

async function sendNewOrder(message) {
    try {
        const html = message;

        const mailOptions = {
            from: 'Ghibli Store',
            to: process.env.GMAIL_ADDRESS,
            subject: 'Nueva orden en la tienda',
            html
        }

        const info = await transporterGmail.sendMail(mailOptions)
        //console.log(info)
    }
    catch (error) {
        //console.log(error)
    }
}

export default { sendNewUserMail, sendNewOrder };