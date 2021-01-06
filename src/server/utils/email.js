const nodemailer = require('nodemailer');

module.exports = sendEmail = async options =>{

    const transporter = nodemailer.createTransport({
        host:'smtp.mailtrap.io',
        post:2525,
        auth:{
            user:"aea3f28ee49106",
            pass:'d38a4c90d152b3'
        }
    })

    const mailOptions = {
        from: 'Ofir -Test',
        to: options.email,
        subject:options.subject,
        html:options.message
    }

    await transporter.sendMail(mailOptions)
}










