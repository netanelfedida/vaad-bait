const express = require('express');
const { connection } = require('../services/mySql-services');
const router = express.Router();
const { getInboxMessages,
        updateStatusOfMessage,
        deleteMessage, 
        createMessage, 
        updateOutboxTable, 
        updateInboxTable } = require('../services/messages-services');
const { getNeighbors } = require('../services/building-service');

router.get('/', async(req, res) => {
    let {buildingID, apartmentID, filter, type} = req.query;
    
    if(filter === "הכל"){
        filter = null;
    }
    try {
        const results = await getInboxMessages(connection, buildingID, apartmentID, type, filter);
        console.log(results);
        
        return res.json(results);        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.get('/get-neighbors', async (req, res) => {
    const { buildingID } = req.query;
    try {
        const results = await getNeighbors(connection, buildingID);        
        return res.json(results);        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})


router.put('/open', async (req, res) => {
    const { messageID } = req.query;
    try {
        const results = await updateStatusOfMessage(connection, messageID);
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Message not found" });
        }
        return res.status(200).json({ message: "Message status updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to update message status" });
    }
})

router.post('/send', async (req, res) => {
    const { title, message, destination, apartment_id, building_id } = req.body;
    console.log("title, message, destination", title, message, destination);
    
    try {
        const messageID = await createMessage(connection, title, message);
        
        await updateInboxTable(connection, destination, apartment_id, building_id, messageID.insertId);
        await updateOutboxTable(connection, destination, apartment_id,building_id, messageID.insertId);

        return res.status(200).json({ message: "ההודעה נוצרה בהצלחה" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to create a new message" });
    }
})

router.delete('/delete', async(req, res) => {
    let { messageID, type } = req.query;
    if(type === "דואר יוצא"){
        type = "outbox";
    }
    else{
        type = "inbox"};
    
    try {
        const results = await deleteMessage(connection, messageID, type);
        if (results.affectedRows === 0) {
            console.log(results);
            
            return res.status(404).json({ error: "Message not found" });
        }
        return res.status(200).json({ message: "Message status updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to update message status" });
    }
})

module.exports = router;