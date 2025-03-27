// cron-jobs.js
const cron = require('node-cron');
const { connection } = require('./mySql-services');
const { sendReportByMail } = require('./email-services');
const { generateReport } = require('./PDF-services');
const { getAllBuildingsID, getAllEmailAdressByBuildingid } = require('./building-service');

async function sendReportMonthly() {
    //Format (minuts, hours, day(1-31), month, day(0-7))
    cron.schedule('03 01 5 * *', async () => {
        const month = new Date().getMonth()+1;
        const year = new Date().getFullYear();
        try {
            const buildingsID = await getAllBuildingsID(connection);
            for( const building of buildingsID) {
                const emailAdress = await getAllEmailAdressByBuildingid(connection, building.building_id);
                const destination = emailAdress.map(address => address.email);
                const {filePath, fileName} = await generateReport(building.building_id, month, year);
                await sendReportByMail("fnati02@gmail.com", filePath, 'דו"ח הוצאות והכנסות', "מצורף קובץ PDF, בברכה הוועד!!", fileName);
            };
        } catch (error) {
            console.error('שגיאה בשליחת הדוח:', error);
        }
    });
}

module.exports = { sendReportMonthly };
