const { log } = require('console');
const fs = require('fs');
const path = require('path');

function createDebtBalanceHtmlContent(data) {

    const templatePath = path.join(__dirname, 'sending-credit-email-template.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

    // Generate rows for the table
    const tableRows = data
        .map(
            (item, index) =>
            {const formattedDate = new Date(item.date).toLocaleDateString('he-IL');   
            return    `
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${index + 1}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.amount}₪</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.description}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${formattedDate}</td>
            </tr>
        `
})
        .join("");

    // Replace placeholders with actual data
    htmlTemplate = htmlTemplate
        .replace('{{sum}}', data[0].total_unpaid)
        .replace('{{name}}', data[0].first_name)
        .replace('{{tableRows}}', tableRows);
    return htmlTemplate;
}


module.exports = {
    createDebtBalanceHtmlContent,
} 