const express = require('express');
const router = express.Router();
const { connection } = require('../services/mySql-services');
const { getAdrresByBuildingID,
        getNeighborsDetails,
        getBuildingFinancials,
        getAllBuildings,
        getTotalIncomeAndExpense,
        checkAnotherAdmin,
        changeAdminPermission } = require('../services/building-service');
const { sendMessageEmail } = require('../services/email-services');

router.get('/addres', async (req, res) => {
    const {buildingID} = req.query;
    try {
        const results = await getAdrresByBuildingID(connection, buildingID);
        return res.json(results);
    }
    catch(err){
        return res.status(500).json({ error: 'Internal Server Error' });
    } 
})

router.get('/get-buildings' ,async (req, res) => {
    const {userID} = req.query;
    try {
        const results = await getAllBuildings(connection, userID);
        return res.json(results);
    }
    catch(err){
        return res.status(500).json({ error: 'Internal Server Error' });
    } 
})

router.get('/tenants', async (req, res) => {
    const {buildingID} = req.query;
    try {
        const results = await getNeighborsDetails(connection, buildingID);
        return res.json(results);
    }
    catch(err){
        return res.status(500).json({ error: 'Internal Server Error' });
    } 
})

router.get('/building-financials' ,async (req, res) => {
    const {buildingID, filter} = req.query;
    
    try {
        const results = await getBuildingFinancials(connection, buildingID, filter);
        return res.json(results);
    }
    catch(err){
        console.log("err--->>",err);
        return res.status(500).json({ error: 'Internal Server Error' });
    } 
})

router.get('/total-financials' ,async (req, res) => {
    const {buildingID} = req.query;    
    try {
        const results = await getTotalIncomeAndExpense(connection, buildingID);
        return res.json(results);
    }
    catch(err){
        return res.status(500).json({ error: 'Internal Server Error' });
    } 
})

router.put('/change-permission', async (req, res) => {
    const { buildingID, apartmentID, isAdmin, email, firstName } = req.body;       
    if( !buildingID || !apartmentID ){
        return res.status(400).json({ error: "אחד מהנתונים שגויים!!" });
    }
    try {
        if(isAdmin){
            const thereIsAnotherAdmin = await checkAnotherAdmin(connection, buildingID, apartmentID);
            if(thereIsAnotherAdmin.length === 0){
                return res.status(400).json({ error: "אתה צריך למנות וועד לפני שאתה עוזב" });
            }
        }
        await changeAdminPermission(connection, apartmentID, isAdmin);
        const title = 'עידכון הרשאות - וועד בית';
        let message = `<h2> עידכון הרשאות מנהל!!<h2><br/>`
        if(isAdmin){
            message += `<h4>${firstName} ברצוננו להודיע לך שבוטלו עבורך הרשאות מנהל, מהיום תוכל להיכנס למערכת בתור דייר רגיל!!<h4>`
        }
        else{
            message += `<h4>${firstName} ברצוננו להודיע לך שעודכנו עבורך הרשאות מנהל, מהיום תוכל לנהל את הבניין!!<h4>`;
        }
        await sendMessageEmail("fnati02@gmail.com", title, message)
        return res.json({message: "וועד בית הוגדר בהצלחה!!"});
    } catch (error) {
        console.log("Error", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})


module.exports = router;