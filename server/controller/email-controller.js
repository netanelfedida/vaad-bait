const express = require('express');
const router = express.Router();
const {sendMessageEmail, sendReportByMail} = require('../services/email-services');


//Send a message by email
router.post('/send-email', async (req, res) => {
    const {destination, subject, htmlMessage} = req.body;
    try {
         await sendMessageEmail(destination, subject, htmlMessage);
         return res.json({Success: 'המייל נשלח בהצלחה!'});    
    }catch(err){    
            res.json(err);
    }
})

//Send report by mail
router.post('/send-report', async (req, res) => {
    const {destination, pdfPath, subject, message, fileName} = req.body;
    try {
         await sendReportByMail(destination, pdfPath, subject, message, fileName);
         return res.json({Success: 'המייל נשלח בהצלחה!'});    
    }catch(err){    
            res.json(err);
    }
})

module.exports = router;
