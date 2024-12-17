const express = require('express');
const router = express.Router();
const {
    getResponseWithMonthName,
    updateTransictions,
    updatePaymentsDetails,
    updateSpecialPaymentsDetails,
    getAllSpecialesPaymentsByID,
    getHistoryPaymentsByID,
    getAllPayments,
    getDetailsListPayments,
    getAllPendingPayments,
    acceptOrRejectPayment,
    getMonthlyPayment,
    updateMonthlyPaymentOfBuilding,
    addMonthlyPaymentsForNextYear,
    updateMonthlyPaymentForTenants,
    updateCreditsPaymentsDetails,
    createTransictions,
    isNextYearPaymentsDefined,
    addNewExpense,
    addNewSpecialPayment,
    getUnpaidPayments,
    sendRemindPaymentEmail,
    getAllFixedPaymentsYears
} = require('../services/payments-services');
const { updateInboxTable, updateOutboxTable, createMessage } = require('../services/messages-services');
const { connection } = require('../services/mySql-services');
const { getNeighbors } = require('../services/building-service');

//Get all fixed payments
router.get('/all-fixed-payments', (req, res) =>{ 
    const { apartmentID, year } = req.query;
        connection.query(`
                    SELECT 
                        fx.payment_id,
                        fx.actually_paid,
                        fx.payment_required,
                        fx.for_month,
                        fx.for_year,
                        fx.status AS fixed_status,
                        GROUP_CONCAT(cd.type) AS credit_types -- מאחד את כל סוגי הקרדיטים למחרוזת אחת
                    FROM 
                        fixed_payments fx
                    LEFT JOIN 
                        credits_and_debits_monthly cd
                    ON 
                        fx.apartment_id = cd.apartment_id
                        AND fx.for_month = cd.for_month
                        AND fx.for_year = cd.for_year
                    WHERE 
                        fx.for_year = ?
                        AND fx.apartment_id = ?
                    GROUP BY 
                        fx.payment_id, fx.for_month, fx.for_year
                    ORDER BY 
                        fx.for_month;


            ` , [year, apartmentID ], (err, results) => {            
                if (err) {                    
                    return res.status(500).send('Database error');
            }
            const response = getResponseWithMonthName(results);            
            return res.json(response);
        });
}
)

//Get summaries from all fixed payments
router.get('/summary-fixed-payments', (req, res) => {
    const apartmentID = req.query.apartmentID;
    const query = `SELECT 
                          SUM(CASE WHEN status = 'בוצע' THEN actually_paid ELSE 0 END) AS sumPaid,
                          SUM(CASE WHEN status = 'ממתין לאישור' THEN actually_paid ELSE 0 END) AS sumPending,
                          SUM(CASE WHEN status = 'לא שולם' THEN payment_required ELSE 0 END) AS sumUnPaid
                       FROM fixed_payments 
                       WHERE apartment_id = ?;
                       `;
        connection.query(query, [apartmentID], (err, results) => {            
            if (err) {
                return res.status(500).send('Database error');
            }
            return res.json(results)
        })

    }
);

router.get('/get-fixed-payments-years', async(req, res) => {
    const { apartmentID } = req.query;
    try{
        const getYears = await getAllFixedPaymentsYears(connection, apartmentID);
        return res.json(getYears);
    } catch(error){
        res.json({error: "Error to get years from server"})
    }
})

//Send remind unpaid email
router.get('/send-remind-unpaid', async(req, res) => {
    const { apartmentID } = req.query;
    try {
        await sendRemindPaymentEmail(connection, apartmentID);
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'});
    }
})

//Get all unpaid payments by apartmentID
router.get('/unpaid-payment', async (req, res) => {
    const { apartmentID } = req.query;
    try {
        const unpaidPayments = await getUnpaidPayments(connection, apartmentID);
        return res.json(unpaidPayments);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

//Get all speciale-payments
router.get('/speciales-payments', async(req, res) => {
    const {apartmentID, status} = req.query;
    
    try {
        const results = await getAllSpecialesPaymentsByID(connection, apartmentID, status);
        
        return res.json(results);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

//Get history payments by apatmentID
router.get('/history-payments', async(req, res) => {
    const { apartmentID, status }= req.query;
    try{
        const results = await getHistoryPaymentsByID(connection, apartmentID, status);        
        return res.json(results);
    }
    catch(err){
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

//Get all pending payments for Admin
router.get('/pending-list',async(req, res) => {
    const { buildingID }= req.query;    
    try{
        const results = await getAllPendingPayments(connection, buildingID); 
        return res.json(results);
    }
    catch(err){
        return res.status(500).json({ error: 'Internalsdafwesaf Server Error' });
    }
})

//Get Monthly payment
router.get('/monthly-payment', async(req, res) => {
    const { buildingID } = req.query;
    try {
        const results = await getMonthlyPayment(connection, buildingID);
         
        return res.json(results);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

//Check if the payment of next year id defined
router.get("/check-next-year-payments", async(req, res) => {
    const { buildingID } = req.query;
    try {
        const results = await isNextYearPaymentsDefined(connection, buildingID);
        return res.json(results);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error From: check-next-year-payments' });
    }
})

//Process of fixed payments 
router.post('/fixed-payments-process', async(req, res) => {
    const transactionDetails = req.body;
    try{
           const transactionID = await createTransictions(connection, transactionDetails);
           await updatePaymentsDetails(connection, transactionDetails, transactionID);
           let message = 'התשלום נקלט בהצלחה!!!';
           if(transactionDetails.permissions === 'user'){
                message += '\nממתין לאישור!!';
           }
        return res.json({Success: message});
        
    }catch(err){
        res.json(err);
    }
})

//Process of specials payments
router.post('/special-payments-process', async(req, res) => {
        const transactionDetails = req.body;
        console.log("transactionDetails ----------> ", transactionDetails);
        
        try{
            const transactionID = await createTransictions(connection, transactionDetails);
            console.log("transactionDetails==== ", transactionID);
            
            if(transactionDetails.specialPayments.length > 0){
                await updateSpecialPaymentsDetails(connection, transactionDetails, transactionID);
                console.log("transactionDetails---->>>>><<<< ");
            }
            if(transactionDetails.creditPayments.length > 0){
            console.log("transactionDetails----<<<<<<<><><><><>>>>>>>");

                await updateCreditsPaymentsDetails(connection, transactionDetails, transactionID);
            }

         return res.json({Success: 'התשלום נקלט בהצלחה\n ממתין לאישור!!'});
         
     }catch(err){
        console.log(err);
        
         res.json(err);
     }
        
})

//Accept Or Reject payment & send message
router.post('/update-payment', async(req, res) => {
    const {status, action, buildingID} = req.body;
    let title = `עדכון תשלום על ${action.description}`;
    let message = `דייר יקר!! \n תשלום מספר ${action.reference_number} על סך ${action.amount}₪,`;
    if(status === "בוצע"){
        message += ` התקבל בהצלחה!!`;
    }
    else{
        message += ` נדחה, יש ליצור קשר עם הוועד`;
    }
    message += ` \n בברכה וועד!!`;
    try{
        await updateTransictions(connection, status, action);
        await acceptOrRejectPayment(connection, status, action);
        
        //Create and send an update message
        const messageID = await createMessage(connection, title, message);
        await updateInboxTable(connection, action.apartment_id, 0, buildingID, messageID.insertId);
        await updateOutboxTable(connection, action.apartment_id, 0, buildingID, messageID.insertId);
     return res.json({Success: 'התשלום אושר בהצלחה, הודעה נמסרה לדייר!!'});
     
 }catch(err){    
     res.json(err);
 }
    
})

//Add new expense
router.post('/new-expense', async (req, res) => {
    const { amount, description, buildingID, paymentMethode } = req.body;

    if(amount <= 0 || !description || !buildingID){
        return res.status(400).json({ error: "אחד מהנתונים שגויים!!" });
    }

    try {
        await addNewExpense(connection, buildingID, description, amount, paymentMethode);
        return res.json({Success: "ההוצאה נוספה בהצלחה!!"} );
    } catch (error) {
        res.json(error);
    }
})

//Add new special payment
router.post('/new-payment', async (req, res) => {
    const { amount, description, buildingID } = req.body;

    if(amount <= 0 || !description || !buildingID){
        return res.status(400).json({ error: "אחד מהנתונים שגויים!!" });
    }

    try {
        const allApartments = await getNeighbors(connection, buildingID);
        await addNewSpecialPayment(connection, buildingID, description, amount, allApartments);
        return res.json({Success: "החיוב נוסף בהצלחה!!"});
    } catch (error) {
        res.json(error);
    }
})

//Change the monthly payments
router.put('/update-monthly-payment', async(req, res) => {
    const { buildingID, monthlyPayment, selectedMonth } = req.body;  
    if( !buildingID || !monthlyPayment || !selectedMonth){
        return res.status(400).json({ error: "אחד מהנתונים (מספר בניין, תשלום חודשי, תאריך) שגויים!!" });
    }
    try {
        await updateMonthlyPaymentOfBuilding(connection, buildingID, monthlyPayment);
        //Case if the monthly payment is not alredy defind
        if(selectedMonth === "תחילת שנה הבאה"){
            await addMonthlyPaymentsForNextYear(connection, buildingID, monthlyPayment);
        }
        //Case the monthly payment is alredy defind
        else{
            await updateMonthlyPaymentForTenants(connection, buildingID, monthlyPayment, selectedMonth);
        }
        return res.json({Success: `התשלום החודשי על סך: ${monthlyPayment} עודכן בהצלחה!!`});
    } catch (err) {
        res.json(err);
    }
})














router.get('/payments-list', async (req, res) => {
    const {userID} = req.query;
    //console.log(userID);
    
    try {
        const results = await getAllPayments(connection, Number(userID));
        
        return res.json(results);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.get('/payments-list/:transaction_id', async (req, res) => {
    const transactionID = req.params.transaction_id;
    try {
        const results = await getDetailsListPayments(connection, Number(transactionID));
        //console.log(results);
        
        return res.json(results);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    });






module.exports = router;