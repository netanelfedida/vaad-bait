const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { getSumOfAllIncomesByMonth, getSumOfAllExpensesByMonth } = require('./payments-services');
const { connection } = require('../services/mySql-services');
const { getTotalIncomeAndExpense } = require('./building-service');

async function generateReport(buildingID, month, year) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    
    const templatePath = path.resolve(__dirname, 'PDF-generated.html');
    let templateHtml = fs.readFileSync(templatePath, 'utf8');



    //Change the content
    const sumOfIncomes = await getSumOfAllIncomesByMonth(connection, buildingID, month, year);
    const sumOfExpense = await getSumOfAllExpensesByMonth(connection, buildingID, month, year);
    const sumaryOfBuilding = await getTotalIncomeAndExpense(connection, buildingID);
    const totalInTheBox = parseFloat(sumaryOfBuilding[0].total_income) - parseFloat(sumaryOfBuilding[0].total_expense);
    
    let incomeHtml = '';
    sumOfIncomes.forEach(income => {
        incomeHtml += `<p>${income.category}: ${income.total} ש"ח</p>`;
    });

    let expenseHtml = '';
    sumOfExpense.forEach(expense => {
        expenseHtml += `<p>${expense.description}: ${expense.amount} ₪</p>`;
    });
  
    const totalIncome = sumOfIncomes.reduce((acc, curr) => acc + parseFloat(curr.total), 0);
    const totalExpense = sumOfExpense.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    const totalSum = totalIncome - totalExpense;
    

    //Replace the content in the html file
    const dateStr = `${month}-${year}`;
    templateHtml = templateHtml
        .replace('{{date}}', dateStr)
        .replace('{{income data}}', incomeHtml)
        .replace('{{expense data}}', expenseHtml)
        .replace('{{Sum data}}', `${totalSum} ₪`)
        .replace('{{Total in the box}}', `${totalInTheBox} ₪`);


    // Set the HTML content in Puppeteer
    await page.setContent(templateHtml, { waitUntil: 'load' });


    // Generate the PDF
    const pdfName = 'report.pdf';
    const pdfPath = path.resolve(__dirname, pdfName);

    await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });

    console.log('PDF generated successfully:', pdfPath);

    await browser.close();
    // Return the name and path of the generated PDF
    return { fileName: pdfName, filePath: pdfPath };
}

module.exports = {generateReport};
