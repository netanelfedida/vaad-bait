
function getAdrresByBuildingID(connection, buildingID){

    return new Promise((resolve, reject) => {
        const query = `
                    SELECT address 
                    FROM buildings
                    WHERE building_id = ?
                    `;
        connection.query(query, [buildingID], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}


function getNeighbors(connection, buildingID){
    return new Promise((resolve, reject) => {
        const query = `
                    SELECT a.apartment_id, a.apartment_number, u.last_name
                    FROM Users u
                    JOIN apartments a ON u.user_id = a.user_id
                    WHERE a.building_id = ?
                    AND a.current_tenant = 1
                    ORDER BY a.apartment_number ASC
                    `;

        connection.query(query, [buildingID], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

function getNeighborsDetails(connection, buildingID) {
    return new Promise((resolve, reject) => {
        const query = `
                    SELECT a.apartment_id, a.apartment_number, u.user_id,u.first_name, u.last_name, u.phone_number, u.email, a.permissions
                    FROM Users u
                    JOIN apartments a ON u.user_id = a.user_id
                    WHERE a.building_id = ?
                    AND a.current_tenant = 1
                    ORDER BY a.apartment_number ASC
                    `;

        connection.query(query, [buildingID], (error, results) => {
            if (error) {
                console.log(error);
                
                return reject(error);
            }
            resolve(results);
        });
    });
}

function getAllBuildings(connection, userID){
    return new Promise((resolve, reject) => {
        const query = `
                    SELECT a.building_id, a.apartment_id, a.permissions, b.address
                    FROM Apartments a
                    JOIN Buildings b ON a.building_id = b.building_id
                    WHERE a.user_id = ? AND a.current_tenant = 1;

                    `;

        connection.query(query, [userID], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

function getTotalIncomeAndExpense(connection, buildingID){
    return new Promise((resolve, reject) => {
        const query = `
                    SELECT 
                    (SELECT SUM(total_income) 
                     FROM (
                         SELECT fp.actually_paid AS total_income
                         FROM fixed_payments fp
                         WHERE fp.status = 'בוצע'
                         AND fp.building_id = ?
                         UNION ALL
                         SELECT sp.amount AS total_income
                         FROM special_payments sp
                         WHERE sp.status = 'בוצע'
                         AND sp.building_id = ?
                         UNION ALL 
                         SELECT cd.amount AS total_income
                         FROM credits_and_debits_monthly cd
                         WHERE cd.status = 'בוצע'
                         AND cd.type = "השלמה"
                         AND cd.building_id = ?
                     ) AS combined_income) AS total_income,
                    (SELECT SUM(total_expense) 
                     FROM (
						SELECT e.amount AS total_expense
                        FROM expenses e
						WHERE e.building_id = ?
						UNION ALL
                        SELECT cd.amount AS total_expense
                        FROM credits_and_debits_monthly cd
						WHERE cd.building_id = ?
							AND cd.status = "בוצע"
                            AND cd.type = "זיכוי"
					)AS combined_expense) AS total_expense;
                    `;

        connection.query(query, [buildingID, buildingID, buildingID, buildingID, buildingID], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

function getBuildingFinancials(connection, buildingID, filter){
    const query = getQueryByFilter(filter);
    const params = getParamsByFilter(buildingID, filter)
    return new Promise((resolve, reject) => {
        connection.query(query, params, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

function getQueryByFilter(filter){
    let query = '';

    switch (filter) {
      case 'תנועות אחרונות':
        query = `
        SELECT 'הוצאה' AS type, 
               NULL AS apartment_id, 
               NULL AS last_name, 
               NULL AS apartment_number,
               e.description, 
               e.amount, 
               e.expense_date AS transaction_date, 
               e.payment_method,
               NULL AS reference_number
        FROM expenses e
        JOIN buildings b ON e.building_id = b.building_id
        WHERE b.building_id = ?
        UNION ALL
        SELECT 'הכנסה' AS type, 
               fp.apartment_id,
               u.last_name, 
               a.apartment_number,
               fp.description, 
               fp.actually_paid, 
               fp.date AS transaction_date, 
               t.payments_method AS payment_method,
               t.transaction_id AS reference_number
        FROM fixed_payments fp
        JOIN buildings b ON fp.building_id = b.building_id
        JOIN apartments a ON fp.apartment_id = a.apartment_id
        JOIN users u ON a.user_id = u.user_id
        JOIN transactions t ON fp.transaction_id = t.transaction_id
        WHERE fp.status = 'בוצע'
          AND b.building_id = ?
        UNION ALL
        SELECT 'הכנסה' AS type, 
               sp.apartment_id,
               u.last_name, 
               a.apartment_number,
               sp.description, 
               sp.amount, 
               sp.date AS transaction_date, 
               t.payments_method,
               t.transaction_id AS reference_number
        FROM special_payments sp
        JOIN buildings b ON sp.building_id = b.building_id
        JOIN apartments a ON sp.apartment_id = a.apartment_id
        JOIN users u ON a.user_id = u.user_id
        JOIN transactions t ON sp.transaction_id = t.transaction_id
        WHERE sp.status = 'בוצע'
          AND b.building_id = ?

        UNION ALL
        SELECT 
        CASE 
            WHEN cd.type = "זיכוי" THEN "זיכוי"
            ELSE "הכנסה"
        END AS type, 
            cd.apartment_id,
            u.last_name, 
            a.apartment_number,
            cd.description, 
            cd.amount, 
            cd.date AS transaction_date, 
            t.payments_method,
            cd.transaction_id AS reference_number
        FROM credits_and_debits_monthly cd
        JOIN buildings b ON cd.building_id = b.building_id
        JOIN apartments a ON cd.apartment_id = a.apartment_id
        JOIN users u ON a.user_id = u.user_id
        LEFT JOIN transactions t ON cd.transaction_id = t.transaction_id
        WHERE 
            cd.status = 'בוצע'
            AND b.building_id = ?
        ORDER BY transaction_date DESC;

        `;
        break;

      case 'הכנסות':
        query = `
            SELECT 'הכנסה' AS type, 
                 fp.apartment_id,
                 u.last_name, 
                 a.apartment_number,
                 fp.description, 
                 fp.actually_paid as amount, 
                 fp.date AS transaction_date, 
                 t.payments_method AS payment_method,
                 t.transaction_id AS reference_number
          FROM fixed_payments fp
          JOIN buildings b ON fp.building_id = b.building_id
          JOIN apartments a ON fp.apartment_id = a.apartment_id
          JOIN users u ON a.user_id = u.user_id
          JOIN transactions t ON fp.transaction_id = t.transaction_id
          WHERE fp.status = 'בוצע'
            AND b.building_id = ?
          UNION ALL
          SELECT 'הכנסה' AS type, 
                 sp.apartment_id,
                 u.last_name, 
                 a.apartment_number,
                 sp.description, 
                 sp.amount, 
                 sp.date AS transaction_date, 
                 t.payments_method,
                 t.transaction_id AS reference_number
          FROM special_payments sp
          JOIN buildings b ON sp.building_id = b.building_id
          JOIN apartments a ON sp.apartment_id = a.apartment_id
          JOIN users u ON a.user_id = u.user_id
          JOIN transactions t ON sp.transaction_id = t.transaction_id
          WHERE sp.status = 'בוצע'
            AND b.building_id = ?
            union all
		   SELECT 'הכנסה' AS type, 
                 cd.apartment_id,
                 u.last_name, 
                 a.apartment_number,
                 cd.description, 
                 cd.amount, 
                 cd.date AS transaction_date, 
                 t.payments_method,
                 cd.transaction_id AS reference_number
          FROM credits_and_debits_monthly cd
          JOIN buildings b ON cd.building_id = b.building_id
          JOIN apartments a ON cd.apartment_id = a.apartment_id
          JOIN users u ON a.user_id = u.user_id
          JOIN transactions t ON cd.transaction_id = t.transaction_id
          WHERE cd.status = 'בוצע'
          and type = "השלמה"
            AND b.building_id = ?
            
          ORDER BY transaction_date DESC;
        `;
        break;
      case 'הוצאות':
        query = `
            SELECT 'הוצאה' AS type, 
                 NULL AS apartment_id, 
                 NULL AS last_name, 
                 NULL AS apartment_number,
                 e.description, 
                 e.amount, 
                 e.expense_date AS transaction_date, 
                 e.payment_method
          FROM expenses e
          JOIN buildings b ON e.building_id = b.building_id
          WHERE b.building_id = ?
          
          union all
           SELECT 'זיכוי' AS type, 
                 cd.apartment_id, 
                 u.last_name, 
                 a.apartment_number,
                 cd.description, 
                 cd.amount, 
                 cd.date AS transaction_date, 
                 "מזומן" AS payment_method          
          FROM credits_and_debits_monthly cd
          JOIN buildings b ON cd.building_id = b.building_id
          JOIN apartments a ON cd.apartment_id = a.apartment_id
          JOIN users u ON a.user_id = u.user_id
          WHERE cd.status = 'בוצע'
          and type = "זיכוי"
            AND b.building_id = ?
          
          ORDER BY transaction_date DESC;
        `;
        break;
    }
    return query;
}

function getParamsByFilter(buildingID, filter){
    let params = [ buildingID, buildingID ];
    if(filter === "הכנסות"){
        params.push(buildingID)
    }
    if(filter === "תנועות אחרונות"){
        params.push(buildingID, buildingID)
    }
    return params;
}

function getAllBuildingsID(connection){
    return new Promise((resolve, reject) => {
        const query = `
            SELECT building_id FROM buildings;
        `
        connection.query(query, (error, results) => {
            if(error){
                console.log("Error: ", error);
                return reject(error);
            }
            resolve(results);
        })
    })
}

function getAllEmailAdressByBuildingid(connection, buildingID){
    return new Promise((resolve, reject)=> {
        const query = `
            SELECT u.email
            FROM users u
            JOIN apartments a ON u.user_id = a.user_id
            WHERE a.building_id = ? 
            AND a.current_tenant = 1
        `
        connection.query(query, [buildingID], (error, results) => {
            if(error){
                console.log("Error: ", error);
                return reject(error);
            }
            resolve(results);
        })
    })
}

function reactiveTenant(connection, apartmentID, newApartmentNumber){
    return new Promise((resolve, reject) => {
        const query = `
                UPDATE apartments
                SET current_tenant = 1,
                    apartment_number = ?
                WHERE apartment_id = ?
        `;
        connection.query(query, [newApartmentNumber, apartmentID], (error, results) => {
            if(error){
                console.log("Error: ", error);
                return reject(error);
            }
            resolve(results);
        })
    })
}

function checkAnotherAdmin(connection, buildingID, apartmentID){
    return new Promise((resolve, reject) => {
        const query = `
            SELECT permissions
            FROM apartments
            WHERE apartment_id != ?
            AND building_id = ?
            AND permissions = "admin"
        `;
        connection.query(query, [apartmentID, buildingID], (error, results) => {
            if(error){
                console.log("Error: ", error);
                reject(error);
            }
            resolve(results);
        })
    })
}

function changeAdminPermission(connection, apartmentID, isAdmin){
    const permissions = isAdmin? 'user': 'admin';
    return new Promise((resolve, reject) => {
        const query = `
        UPDATE apartments
        SET permissions = "${permissions}"
        WHERE apartment_id = ?
        `;
        connection.query(query, [apartmentID] , (error, results) => {
            if(error){
                console.log("Error: ", error);
                reject(error);
            }
            resolve(results);
        })
    })
}

function leaveOldTenantFromBuilding(connection, oldUser, buildingID){
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE apartments
            SET current_tenant = 0,
                exit_date = now()
            WHERE apartment_id = ?
            AND building_id = ?;
        `
        connection.query(query, [oldUser, buildingID], (error, results) => {
            if(error){
                console.log("Error: ", error);
                reject(error);
            }
            console.log("-------------------------------------");

            console.log("Resolve from leave function: ", results);
            resolve(results);
        })
    })
}

function getOldTenantDetails(connection, oldUser, buildingID){
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM apartments
            WHERE apartment_id = ?
            AND building_id = ?;
        `
        connection.query(query, [oldUser, buildingID], (error, results) => {
            if(error){
                console.log("Error: ", error);
                reject(error);
            }
            console.log("-------------------------------------");

            console.log("Resolve from getOldTenantDetails function : ", results);
            
            resolve(results);
        })
    })
}

function isTenantWasBefore(connection, newUserID, buildingID){
    return new Promise((resolve, reject) => {
        const query = `
                SELECT apartment_id
                FROM apartments
                WHERE user_id = ?
                AND current_tenant = 0
                AND building_id = ?
        `;
        connection.query(query, [newUserID, buildingID], (error, results) => {
            if(error){
                console.log("Error: ", error);
                return reject(error);
            }
            console.log("IIIIIIIIIIIIII ", newUserID, buildingID, results);
            
            resolve(results);
        })
    })
}

function addNewApartment(connection, {building_id, apartment_number}, newUser){
    console.log("{building_id, apartment_number}------> ", building_id, apartment_number);
    
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO apartments(user_id, building_id, apartment_number, current_tenant, entry_date, exit_date, permissions)
            VALUE(?,?,?,1, now(), null, 'user');
        `;
        connection.query(query, [newUser, building_id, apartment_number], (error, results) => {
            if(error){
                console.log("Error: ", error);
                return reject(error);
            }
            console.log("-------------------------------------");
            console.log("Result from addNewApartment func----> ");

            resolve(results.insertId);
        })
    })
}

module.exports = {
    getAdrresByBuildingID,
    getBuildingFinancials,
    getNeighbors,
    getNeighborsDetails,
    getTotalIncomeAndExpense,
    getAllBuildings,
    getAllBuildingsID,
    getAllEmailAdressByBuildingid,
    checkAnotherAdmin,
    changeAdminPermission,
    leaveOldTenantFromBuilding,
    addNewApartment,
    getOldTenantDetails,
    isTenantWasBefore,
    reactiveTenant
}