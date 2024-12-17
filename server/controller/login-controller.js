const express = require('express');
const router = express.Router();
const {checkValidUsers} = require('../validations/login-validation');
const { connection } = require('../services/mySql-services');

router.get('/', async (req, res) => {
    try {
        const response = await checkValidUsers(connection, req.query);
        if(!response){
            return res.status(404).json({ error: 'משתמש לא קיים/אחד מהנתונים שגויים!!' });             
        }
        return res.json(response);
    } catch (error) {
        console.error('Query error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;