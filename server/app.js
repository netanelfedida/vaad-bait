const express = require('express');
const app = express();
const cors = require("cors");
const loginController = require('./controller/login-controller');
const paymentsController = require('./controller/payments-controller');
const buildingDetailsController = require('./controller/building-controller');
const messagesController = require('./controller/messages-controller');
const profileController = require('./controller/profile-controller');
const emailController = require('./controller/email-controller');
const { connection } = require('./services/mySql-services');
const { sendReportMonthly } = require('./services/cron-service');


// Configure CORS
app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

//handle any request && parse the body
app.use(express.json());

sendReportMonthly();

//All user queries
app.use('/login', loginController);
app.use('/payments', paymentsController);
app.use('/building-details', buildingDetailsController)
app.use('/messages', messagesController);
app.use('/profile', profileController);
app.use('/email', emailController);

//Admin queries
app.use('/admin/payments', paymentsController);
app.use('/admin/building-details', buildingDetailsController)
app.use('/admin/profile', profileController)


app.listen(8080, () => {
    console.log("Express run and listening....");
})