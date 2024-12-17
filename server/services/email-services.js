var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vaadbaitcompany@gmail.com',
    pass: 'lwlp olph mlug juuz'
  }
});

function sendMessageEmail(destination, subject, htmlMessage){
  
  var mailOptions = {
      from: 'vaadbaitcompany@gmail.com',
      to: destination,
      subject: subject,
      html: htmlMessage
    };
    console.log(mailOptions.to);
    
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });   
}

async function sendReportByMail(destination, pdfPath, subject, message, fileName) {
  try {
      const mailOptions = {
          from: 'vaadbaitcompany@gmail.com',
          to: destination,
          subject: subject,
          text: message,
          attachments: [
              {
                  filename: fileName,
                  path: pdfPath,
              },
          ],
      };

      await transporter.sendMail(mailOptions);
      console.log(`מייל נשלח בהצלחה ל-${destination}`);
  } catch (error) {
      console.error('שגיאה בשליחת המייל:', error);
  }
}


module.exports = {
  sendMessageEmail,
  sendReportByMail
}
