"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  let lint_result = process.argv[4] == 0 ? "Resultado correcto" : "Resultado incorrecto"
  let test_result = process.argv[5] == 0 ? "Resultado correcto" : "Resultado incorrecto"
  let update_result = process.argv[6] == 0 ? "Resultado correcto" : "Resultado incorrecto"
  let deploy_result = process.argv[7] == 0 ? "Resultado correcto" : "Resultado incorrecto"
  
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "cjuaniestacio@gmail.com", // generated ethereal user
      pass: process.argv[2], // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'cjuaniestacio@gmail.com', // sender address
    to: process.argv[3], // list of receivers
    subject: "Resultado de la pipeline ejecutada", // Subject line
    text: "Se ha realizado un push en la rama main que ha provocado la ejecución de la pipeline con los siguientes resultados: \n - Linter_stage: " + lint_result + "\n" + "- Test_stage: " + test_result + "\n" + "- Update_readme_stage: " + update_result + "\n" + "- Deploy_to_Vercel_stage: " + deploy_result + "\n", // plain text body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);