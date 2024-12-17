

function getInboxMessages(connection,buildingID, apartmentID, type, status) {
    let query = "";
    let params = [apartmentID, buildingID];
    if (type === "דואר נכנס") {
        query = `
                    SELECT 
                    m.message_id, 
                    m.title, 
                    m.message, 
                    m.date, 
                    i.send_by AS send_by_apartment_id, 
                    i.status, 
					COALESCE(u.last_name, 'וועד') AS send_by_last_name,
					sender_a.apartment_number AS send_by_apartment_number
                FROM 
                    inbox i
                JOIN 
                    messages m ON i.message_id = m.message_id
               left JOIN 
                    apartments sender_a ON i.send_by = sender_a.apartment_id
               left JOIN 
                    users u ON sender_a.user_id = u.user_id
                WHERE 
                    i.apartment_id = ? AND i.building_id = ?
        `;
        if (status !== null) {
            query += ` AND i.status = ? `;
            params.push(status);
        }
        query += ` ORDER BY m.date DESC`;
    } else if (type === "דואר יוצא") {
        query = `
            SELECT             
                m.message_id, 
                m.title, 
                m.message, 
                m.date, 
                o.apartment_id AS send_by_apartment_id,
                COALESCE(u.last_name, 'וועד') AS send_to_last_name,
                sender_a.apartment_number as send_to_apartment_number
            FROM outbox o
            LEFT JOIN Apartments a ON o.apartment_id = a.apartment_id
            LEFT JOIN Messages m ON o.message_id = m.message_id
            LEFT JOIN Apartments sender_a ON o.send_to = sender_a.apartment_id
            LEFT JOIN Users u ON sender_a.user_id = u.user_id
            WHERE o.apartment_id = ? AND o.building_id = ?
            ORDER BY m.date DESC
        `;
    } else {
        return reject(new Error("Invalid message type provided."));
    }
    return new Promise((resolve, reject) => {
        connection.query(query, params, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}


// function getInboxMessages(connection, apartmentID, type, status = null) {
//     let query = "";
//     let filters = [apartmentID];;
//     if(type === "דואר נכנס"){
//         query = `
//                 SELECT 
//                 m.message_id, 
//                 m.title, 
//                 m.message, 
//                 m.date, 
//                 i.send_by AS send_by_apartment_id, 
//                 i.status, 
//                 u.last_name AS send_by_last_name,
//                 sender_a.apartment_number as send_by_apartment_number
//                 FROM Inbox i
//                 LEFT JOIN Apartments a ON i.apartment_id = a.apartment_id
//                 LEFT JOIN Messages m ON i.message_id = m.message_id
//                 LEFT JOIN Apartments sender_a ON i.send_by = sender_a.apartment_id
//                 LEFT JOIN Users u ON sender_a.user_id = u.user_id
//                 WHERE a.user_id = ?
//             `;
//         if (status !== null) {
//             query += ` AND i.status = ? `;
//             filters.push(status);
//         }
//         query+= `ORDER BY m.date DESC`

//     }
//     else if(type === "דואר יוצא"){
//         query = `
//                 SELECT             
//                     m.message_id, 
//                     m.title, 
//                     m.message, 
//                     m.date, 
//                     o.apartment_id AS send_by_apartment_id,
//                     u.last_name AS send_to_last_name,
//                     sender_a.apartment_number as send_to_apartment_number
//                 FROM outbox o
//                 LEFT JOIN Apartments a ON o.apartment_id = a.apartment_id
//                 LEFT JOIN Messages m ON o.message_id = m.message_id
//                 LEFT JOIN Apartments sender_a ON o.send_to = sender_a.apartment_id
//                 LEFT JOIN Users u ON sender_a.user_id = u.user_id
//                 WHERE a.user_id = ?
//                 ORDER BY m.date DESC
//         `
//     }
//     return new Promise((resolve, reject) => {
//         connection.query(query, filters, (error, results) => {
//             if (error) {
//                 return reject(error);
//             }
//             resolve(results);
//         });
//     });
// }

function updateStatusOfMessage(connection, messageID){
    const query = `
                UPDATE inbox SET status = "נקרא" WHERE message_id = ?
                    `;
    return new Promise((resolve, reject) => {
        connection.query(query, [messageID], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

function deleteMessage(connection, messageID, filter) {
    return new Promise((resolve, reject) => {
        const deleteFromTableQuery = `
                                    DELETE FROM ??
                                    WHERE message_id = ?
                                    `;
        connection.query(deleteFromTableQuery, [filter, messageID], (error, results) => {
            if (error) {
                return reject(error);
            }

        const deleteFromMessagesQuery = `
                                    DELETE FROM messages
                                    WHERE message_id = ?
                                      AND NOT EXISTS (SELECT 1 FROM outbox WHERE message_id = ?)
                                      AND NOT EXISTS (SELECT 1 FROM inbox WHERE message_id = ?)
                                    `;
        connection.query(deleteFromMessagesQuery,[messageID, messageID, messageID],(error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            }
            );
        });
    });
}

function createMessage(connection, title, message){
    const query = `
                insert into messages(title, message, date)
                value(?,?,now());
                `;
    return new Promise((resolve, reject) => {
        connection.query(query, [title, message], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

function updateOutboxTable(connection, destination, apartment_id, buildingID, messageID){
    const query = `
                insert into outbox(message_id, apartment_id, send_to, building_id)
                value(?,?,?,?);
                `;
    return new Promise((resolve, reject) => {
        connection.query(query, [messageID, apartment_id, destination, buildingID], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

function updateInboxTable(connection, destination, apartment_id, buildingID, messageID){
    const query = `
                insert into inbox(message_id, apartment_id, send_by, status, building_id)
                value(?,?,?,"לא נקרא", ?);
                `;
    return new Promise((resolve, reject) => {
        connection.query(query, [messageID, destination, apartment_id, buildingID], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}



module.exports = {
    getInboxMessages,
    updateStatusOfMessage,
    deleteMessage,
    createMessage, 
    updateOutboxTable, 
    updateInboxTable
}