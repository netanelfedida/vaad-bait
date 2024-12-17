const { 
    createTransictionsQuery, 
    updateTransictionsQuery, 
    getAllFixedPaymentsYearsQuery, 
    updateFixedPaymentsFromNowQuery, 
    updateSpecialPaymentsFromNowQuery, 
    updateCreditAndDebitPaymentsFromNowQuery, 
    updatePaymentsDetailsQuery, 
    updateSpecialPaymentsDetailsQuery, 
    updateCreditsPaymentsDetailsQuery, 
    getMonthlyPaymentQuery, 
    getAllPendingPaymentsQuery, 
    getAllPaymentsQuery, 
    getDetailsListPaymentsQuery, 
    updateMonthlyPaymentOfBuildingQuery, 
    addMonthlyPaymentsForNextYearQuery, 
    isNextYearPaymentsDefinedQuery, 
    updateRequireFixedPaymentsFromDateQuery, 
    getAllFixedPaymentsPaidFromDateQuery, 
    insertCreditAndDebitPaymentsQuery, 
    deleteAllDebitUnpaidByMonthQuery, 
    addNewExpenseQuery, 
    addNewSpecialPaymentQuery,
    getSumOfAllIncomesByMonthQuery,
    getUnpaidPaymentsQuery,
    getSumOfAllExpensesByMonthQuery,
    getEmailAddressByApartmentIDQuery,
    getAllSpecialesPaymentsByIDQuery, 
    getHistoryPaymentsByIDQuery, 
    acceptOrRejectPaymentQuery } = require("../qeries/payments-queries");
const { getNeighbors } = require("./building-service");
const { sendMessageEmail } = require("./email-services");
const { createDebtBalanceHtmlContent } = require("./html-services");

const monthNames = [
    "ינואר", 
    "פבואר", 
    "מרץ", 
    "אפריל", 
    "מאי", 
    "יוני",
    "יולי",
    "אוגוסט", 
    "ספטמבר", 
    "אוקטובר", 
    "נובמבר", 
    "דצמבר"
  ];



function getResponseWithMonthName(results){
    return results.map(payment => {
        return {
            ...payment,
            month: monthNames[payment.for_month-1]
        }
    })

}

function createTransictions(connection, {apartmentID, sumOfTransiction, paymentMethode, permissions}){
    const status = permissions === 'admin'? 'בוצע':'ממתין לאישור';
    return new Promise((resolve, reject) => {
        const query = createTransictionsQuery;

        connection.query(query, [apartmentID, sumOfTransiction,status, paymentMethode], (error, results) => {
            if (error) {
                console.log(error);

                return reject(error);
            }
            resolve(results.insertId);
        });
    });
}

function updateTransictions(connection, status, {reference_number}){
    return new Promise((resolve, reject) => {
        const query = updateTransictionsQuery;

        connection.query(query, [status, reference_number], (error, results) => {
            if (error) {
                console.log(error);

                return reject(error);
            }
            
            resolve(results.insertId);
        });
    });
}

async function updateAllPaymentsFromNow(connection, newApartmentID, oldApartmentID){
    const month = new Date().getMonth() +1;
    const year = new Date().getFullYear();
    try {
        await updateFixedPaymentsFromNow(connection, newApartmentID, oldApartmentID, month, year);
        await updateSpecialPaymentsFromNow(connection, newApartmentID, oldApartmentID, month, year);
        await updateCreditAndDebitPaymentsFromNow(connection, newApartmentID, oldApartmentID, month, year);
    } catch (error) {
        console.log("Error: ", error);        
        return error;        
    }
}

function getAllFixedPaymentsYears(connection, apartmentID){
    return new Promise((resolve, reject) => {
        const query = getAllFixedPaymentsYearsQuery;

        connection.query(query, [apartmentID], (error, results) => {
            if (error) {
                return reject(error);
            }
            
            resolve(results);
        })
    })
}

function updateFixedPaymentsFromNow(connection, newApartmentID, oldApartmentID, month, year){
    return new Promise((resolve, reject) => {
        const query =  updateFixedPaymentsFromNowQuery;

        connection.query(query, [newApartmentID, oldApartmentID, year, month, year], (error, results) => {
            if (error) {
                return reject(error);
            }
            
            resolve(results);
        })
    })
}

function updateSpecialPaymentsFromNow(connection, newApartmentID, oldApartmentID, month, year){
    return new Promise((resolve, reject) => {
        const query = updateSpecialPaymentsFromNowQuery;

        connection.query(query, [newApartmentID, oldApartmentID, year, month, year], (error, results) => {
            if (error) {
                return reject(error);
            }
            
            resolve(results);
        })
    })
}

function updateCreditAndDebitPaymentsFromNow(connection, newApartmentID, oldApartmentID, month, year){
    return new Promise((resolve, reject) => {
        const query = updateCreditAndDebitPaymentsFromNowQuery;

        connection.query(query, [newApartmentID, oldApartmentID, year, month, year], (error, results) => {
            if (error) {
                return reject(error);
            }
            
            resolve(results);
        })
    })
}

// Make a fixed payment
function updatePaymentsDetails(connection, { allPayments, permissions }, transactionID) {
    const status = permissions === 'admin' ? 'בוצע' : 'ממתין לאישור';
    const updatePromises = [];

    for (const [year, paymentIds] of Object.entries(allPayments)) {
        for (const paymentId of paymentIds) {
            const promise = new Promise((resolve, reject) => {
                const query = updatePaymentsDetailsQuery;

                connection.query(query, [transactionID, transactionID, status, paymentId], (error, results) => {
                    if (error) {
                        console.log(error);
                        return reject(error);
                    }
                    resolve(results);
                });
            });
            updatePromises.push(promise);
        }
    }
    return Promise.all(updatePromises);
}


//Make special payments
function updateSpecialPaymentsDetails(connection, {specialPayments, permissions}, transactionID){
    const status = permissions === 'admin'? 'בוצע':'ממתין לאישור';
    const updatePromises = [];

    specialPayments.map( (id) => {
       const promise = new Promise((resolve, reject) => {
            const query = updateSpecialPaymentsDetailsQuery;
            
            connection.query(query, [transactionID, status, id], (error, results) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                resolve(results);
            });
        });
        updatePromises.push(promise);
    })
    return Promise.all(updatePromises);
}

//Make Credit payments
function updateCreditsPaymentsDetails(connection, {creditPayments, permissions}, transactionID){
    const status = permissions === 'admin'? 'בוצע':'ממתין לאישור';
    const updatePromises = [];

    creditPayments.map( (id) => {
        const promise = new Promise((resolve, reject) => {
            const query = updateCreditsPaymentsDetailsQuery;
            connection.query(query, [transactionID,status, id], (error, results) => {
                if (error) {
                console.log(error);
                return reject(error);
                }
                resolve(results);
            });
        });
        updatePromises.push(promise);
    })
    return Promise.all(updatePromises);
}

function getAllSpecialesPaymentsByID(connection, apartmentID, status){
    return new Promise((resolve, reject) => {
        const params = status !== "הכל" ?[apartmentID, status, apartmentID, status]:[apartmentID, apartmentID];
        const query = getAllSpecialesPaymentsByIDQuery(status);

        connection.query(query, params, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

//Get History payments by ID
function getHistoryPaymentsByID(connection, apartment_id, status){
    const filterFixedPaymentsByStatus = status === "הכל"?`fx.status IN ('בוצע', 'ממתין לאישור')`:`fx.status = ?`; 
    const filterSpecialPaymentsByStatus = status === "הכל"?`sp.status IN ('בוצע', 'ממתין לאישור')`:`sp.status = ?`; 
    const filterCreditsAndDebitsByStatus = status === "הכל"?`cd.status IN ('בוצע', 'ממתין לאישור')`:`cd.status = ?`; 
    
    return new Promise((resolve, reject) => {
        const query = getHistoryPaymentsByIDQuery(
            filterFixedPaymentsByStatus, 
            filterSpecialPaymentsByStatus, 
            filterCreditsAndDebitsByStatus);

        const queryParams = status === "הכל"?[apartment_id, apartment_id, apartment_id]: [apartment_id, status, apartment_id, status, apartment_id, status];
        connection.query(query, queryParams, (error, results) => {
            
            if (error) {                
                return reject(error);
            }
            resolve(results);
        });
    });
}

function getMonthlyPayment(connection, buildingID){
    return new Promise((resolve, reject) => {
        const query = getMonthlyPaymentQuery;

        connection.query(query, [buildingID], (error, results) => {
            if (error) {
                console.log(error);
                return reject(error);
            }            
            resolve(results);
        });
    });
}

function getAllPendingPayments(connection, buildingID) {
    return new Promise((resolve, reject) => {
        const query = getAllPendingPaymentsQuery;

        connection.query(query, [buildingID, buildingID, buildingID], (error, results) => {
            if (error) {
                console.log(error);
                return reject(error);
            }
            resolve(results);
        });
    });
}

function getAllPayments(connection, userID){
    return new Promise((resolve, reject) => {
        const query = getAllPaymentsQuery;

        connection.query(query, [userID], (error, results) => {
            if (error) {
                console.log(error);
                return reject(error);
            }
            resolve(results);
        });
    });
}

function getDetailsListPayments(connection, transactionID){
    return new Promise((resolve, reject) => {
        const query = getDetailsListPaymentsQuery;

        connection.query(query, [transactionID], (error, results) => {
            if (error) {
                console.log(error);
                return reject(error);
            }
            resolve(results);
        });
    });
}

function acceptOrRejectPayment(connection, status, {type, id}){
    const table = type === 'השלמה'? 'credits_and_debits_monthly' :type;
    const column = type === 'השלמה'? 'id':'payment_id';
    const query = acceptOrRejectPaymentQuery(table, column);
    
    return new Promise((resolve, reject) => {
        connection.query(query, [status, id], (error, results) => {
            if (error) {
                console.log("error", error);
                return reject(error);
            }
            console.log("Type: ", type);
            
            resolve(results);
        });
    });
}

function updateMonthlyPaymentOfBuilding(connection, buildingID, monthlyPayments){
    return new Promise((resolve, reject) => {
        const query = updateMonthlyPaymentOfBuildingQuery;

        connection.query(query, [monthlyPayments, buildingID], (error, results) => {
            if (error) {
                console.log("error", error);
                return reject(error);
            }
            resolve(results);
        });
    });
}

async function updateMonthlyPaymentForTenants(connection, buildingID, monthlyPayments, selectedMonth){
    const [ month, year ] = selectedMonth.split('/');
    try {
        await updateRequireFixedPaymentsFromDate(connection, buildingID, month, year, monthlyPayments);
        const creditAndDebit = await getAllFixedPaymentsPaidFromDate(connection, buildingID, month, year);
        const creditAndDebitParams = [];

        if(creditAndDebit.length > 0){
            for( const payment of creditAndDebit){
                const { apartment_id, fixed_payment_amount, for_month, for_year, total_debits, total_credits} = payment;
                const sumOfPaid = (parseFloat(fixed_payment_amount) + parseFloat(total_debits) - parseFloat(total_credits));
                await deleteAllDebitUnpaidByMonth(connection, for_year, for_month, apartment_id);
                if(sumOfPaid < parseFloat(monthlyPayments)){
                    creditAndDebitParams.push([
                        buildingID,
                        apartment_id,
                        null,
                        'השלמה',
                        `השלמה על חודש ${for_month}/${for_year}`,
                        'לא שולם',
                        monthlyPayments - sumOfPaid,
                        for_month,
                        for_year,
                        connection.raw('NOW()')
                    ])
                }
                else if(sumOfPaid > parseFloat(monthlyPayments)){
                    creditAndDebitParams.push([
                        buildingID,
                        apartment_id,
                        null,
                        'זיכוי',
                        `זיכוי על חודש ${for_month}/${for_year}`,
                        'בוצע',
                        sumOfPaid - parseFloat(monthlyPayments),
                        for_month,
                        for_year,
                        connection.raw('NOW()')
                    ])
                }
            }
            if(creditAndDebitParams.length > 0){
                await insertCreditAndDebitPayments(connection, creditAndDebitParams);
            }
        }
    } catch (error) {
        res.json(error);
    }
}

async function addMonthlyPaymentsForNextYear(connection, buildingID, monthlyPayments){
    const tenantsDetails = await getNeighbors(connection, buildingID);
    if(tenantsDetails.length == 0){
        return "There is no tenants in this building";
    }
    const updatePromises = [];
    const nextYear = new Date().getFullYear() +1;
    for (const tenant of tenantsDetails) {
        const { apartment_id } = tenant;
        const values = [];
        for (let month = 1; month <= 12; month++) {
            values.push([
                null,                  
                apartment_id,          
                buildingID,            
                null,                 
                0,                     
                new Date(),            
                `תשלום וועד ${month}/${nextYear}`,
                month,               
                nextYear,           
                'לא שולם',            
                monthlyPayments                   
            ]);
        }
    
        const query = addMonthlyPaymentsForNextYearQuery;

        const promise = new Promise((resolve, reject) => {
            connection.query(query, [values], (error, results) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                resolve(results);
            });
        });
        updatePromises.push(promise);
    }
    return Promise.all(updatePromises);
}

function isNextYearPaymentsDefined(connection, buildingID){
    return new Promise((resolve, reject) => {
        const nextYear = new Date().getFullYear() + 1;
        const query = isNextYearPaymentsDefinedQuery;

        connection.query(query, [buildingID, nextYear], (error, results) => {
            if (error) {
                console.log("error", error);
                return reject(error);
            }        
            resolve(results[0].count);
        });
    });

}
  
function updateRequireFixedPaymentsFromDate(connection, buildingID, month, year, monthlyPayments){
    return new Promise((resolve, reject) => {
        const query = updateRequireFixedPaymentsFromDateQuery;

        connection.query(query, [monthlyPayments, buildingID, year, month], (error, results) => {
            if(error){
                console.log("Error", error);
                return reject(error);                
            }
            resolve(results);
        });
    });
}

function getAllFixedPaymentsPaidFromDate(connection, buildingID, month, year){
    return new Promise((resolve, reject) => {
        const query = getAllFixedPaymentsPaidFromDateQuery;

        connection.query(query, [year, year, month, buildingID], (error, results) => {
            if(error){
                console.log("error", error);
                return reject(error);                
            }
            resolve(results);
        });
    });
}

function insertCreditAndDebitPayments(connection, creditAndDebitParams){
    console.log("Credit Params: ", creditAndDebitParams);
    
    return new Promise((resolve, reject) => {
        const query = insertCreditAndDebitPaymentsQuery;

        connection.query(query, [creditAndDebitParams], (error, results) => {
            if(error){
                console.log("error: ", error);
                return reject(error);
            }
            resolve(results);
        })
    })
}

function deleteAllDebitUnpaidByMonth(connection, year, month, apartmentID){
    return new Promise((resolve, reject) => {
        const query = deleteAllDebitUnpaidByMonthQuery;

            connection.query(query, [year, month, apartmentID], (error, results) => {
                if(error){
                    console.log("Error: ", error);
                    return reject(error);
                }
                resolve(results);
            })
    })
}

function addNewExpense(connection, buildingID, description, amount, paymentMethode){
    return new Promise((resolve, reject) => {
        const query = addNewExpenseQuery;
        connection.query(query, [amount, description, paymentMethode, buildingID], (error, results) => {
            if(error){
                console.log("Error: ", error);
                    return reject(error);
            }
            resolve(results);
        })
    })
}

function addNewSpecialPayment(connection, buildingID, description, amount, allApartments){
    return new Promise((resolve, reject) => {
        const specialPayment = [];
        for(const apartment of allApartments){
            const { apartment_id } = apartment;
            
            specialPayment.push([
                null,
                apartment_id,
                buildingID,
                description,
                connection.raw('NOW()'),
                amount,
                'לא שולם'
            ]);  
        } 
        const query = addNewSpecialPaymentQuery;
        connection.query(query, [specialPayment], (error, results) => {
            if(error){
                console.log("Error: ", error);
                reject(error);
            }
            resolve(results);
        })
    })
}

function getSumOfAllIncomesByMonth(connection, buildingID, month, year){
    return new Promise((resolve, reject) => {
        const params = [month, year, buildingID, month, year, buildingID, month, year, buildingID];
        const query = getSumOfAllIncomesByMonthQuery;

        connection.query(query, params, (error, results) => {
            if(error){
                console.log("Error: ", error);
                return reject(error);
            }
            resolve(results);
        })
    })
}

function getUnpaidPayments(connection, apartmentID){
    return new Promise((resolve, reject) => {
        const query = getUnpaidPaymentsQuery;

        connection.query(query, [apartmentID, apartmentID, apartmentID, apartmentID, apartmentID, apartmentID], (error, results) => {
            if(error){
                console.log("Error: ", error);
                return reject(error);
            }
            resolve(results);
        } )
    })
}

function getSumOfAllExpensesByMonth(connection, buildingID, month, year){
    return new Promise((resolve, reject) => {
        const params = [month, year, buildingID, month, year, buildingID];
        const query = getSumOfAllExpensesByMonthQuery;

        connection.query(query, params, (error, results) => {
            if(error){
                console.log("Error: ", error);
                return reject(error);
            }
            resolve(results);
        })
    })
}

function getEmailAddressByApartmentID(connection, apartmentID){
    return new Promise((resolve, reject) => {
        const query = getEmailAddressByApartmentIDQuery;
        connection.query(query, [apartmentID], (error, results) => {
            if(error){
                console.log("Error: ", error);
                return reject(error);
            }
            resolve(results);
        })
    } )
}

async function sendRemindPaymentEmail(connection, apartmentID){
    try {
        const destination = await getEmailAddressByApartmentID(connection, apartmentID);
        const data = await getUnpaidPayments(connection, apartmentID);
        const message = await createDebtBalanceHtmlContent(data);
        //Need to put destination instead of the mail
        await sendMessageEmail(["fnati02@gmail.com"], "תזכורת חיובים טרם שולמו", message)
    } catch (error) {
        console.log(error);
        return error;
    }
}


module.exports = {
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
    getSumOfAllIncomesByMonth,
    getSumOfAllExpensesByMonth,
    getUnpaidPayments,
    sendRemindPaymentEmail,
    updateAllPaymentsFromNow,
    getAllFixedPaymentsYears
}
