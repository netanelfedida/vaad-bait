const express = require('express');
const router = express.Router();
const { connection } = require('../services/mySql-services');
const { getUserDetails, updateUserDetails, getUserDataByEmail, addUserToDatabase } = require('../services/profile-services')
const { leaveOldTenantFromBuilding, getOldTenantDetails, addNewApartment, isTenantWasBefore, reactiveTenant } = require('../services/building-service');
const { updateAllPaymentsFromNow } = require('../services/payments-services');
const { sendMessageEmail } = require('../services/email-services');
router.get('/', async (req,res) => {
    const {userID} = req.query;
    try {
        const results = await getUserDetails(connection, userID);
        console.log(results);
        
        return res.json(results);
    }catch(err){
        res.json(err);
    }
})

router.get('/check-user-exist', async(req, res) => {
    const { email } = req.query;
    try {
        const data = await getUserDataByEmail(connection, email);
        return res.json(data);
    } catch (error) {
        res.json(error);
    }
})

router.post('/add-new-user', async(req, res) => {
    const {oldUser, firstName, lastName, email, phoneNumber, password, emailMessage, building_id} = req.body;
    console.log("Add User request: ", oldUser, firstName, lastName, email, phoneNumber, password, emailMessage, building_id);
    
    try {
        await leaveOldTenantFromBuilding(connection, oldUser, building_id);
        console.log("After leave func----> ");
        const oldData = await getOldTenantDetails(connection, oldUser, building_id);
        console.log("After getOldTenantDetails func----> ");
        const newUser = await addUserToDatabase(connection, {firstName, lastName, email, password, phoneNumber, emailMessage});
        console.log("After addUserToDatabase func----> ");  
        const title = "הצטרפות למערכת וועד בית!!";
        const message = `<h2>${firstName} ${lastName}!<h2><br/>
                    <h3>אנו שמחים על הצטרפותך למערכת וועד בית<h3><br/>
                     שם משתמש: ${email}, <br/> סיסמא: ${password}.<br/>
                     !!למען אבטחת חשבונך, אנו ממליצים לך להתחבר ולשנות את סיסמתך<br/>
                     <a href="http://localhost:3000">להתחברות</a> `
        await sendMessageEmail("fnati02@gmail.com", title, message);     
        console.log("oldData after addUserToDatabase func----> ", oldData);        
        const newApartmentID =  await addNewApartment(connection, oldData[0], newUser);
        console.log("After addNewApartment func----> ");
        await updateAllPaymentsFromNow(connection, newApartmentID, oldData[0].apartment_id);
        return res.json({Success: "הדייר נוסף בהצלחה!!"})
    } catch (error) {
        console.log(error);
        
    }

})

router.post('/change-user', async(req, res) => {
    const {tenant, newUser, building_id} = req.body;
    try {
        await leaveOldTenantFromBuilding(connection, tenant.apartment_id, building_id); 
        const oldData = await getOldTenantDetails(connection, tenant.apartment_id, building_id);
        const getPreviousApartmentNumber = await isTenantWasBefore(connection, newUser, building_id);
        let newApartmentID;
        console.log("getPreviousApartmentNumber---------------> ", getPreviousApartmentNumber);
        
        if(getPreviousApartmentNumber.length > 0){
            newApartmentID = getPreviousApartmentNumber[0].apartment_id;
            await reactiveTenant(connection, newApartmentID, tenant.apartment_number);
        }
        else{
            newApartmentID =  await addNewApartment(connection, oldData[0], newUser);
        }
        await updateAllPaymentsFromNow(connection, newApartmentID, oldData[0].apartment_id);
        return res.json({Success: "הדייר נוסף בהצלחה!!"})
    } catch (error) {
        console.log(error);
        
    }
})

router.put('/update-profile',async (req,res) => {
    try {
        const results = await updateUserDetails(connection, req.body);
        return res.json(results);
    }catch(err){
        res.json(err);
    }
})



module.exports = router;