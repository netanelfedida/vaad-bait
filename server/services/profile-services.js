
function getUserDetails(connection, userID){
    return new Promise((resolve, reject) => {
        const query = `
        SELECT u.*, a.permissions
        FROM users u
        JOIN apartments a ON u.user_id = a.user_id
        WHERE u.user_id = ?;
            `
            ;
        connection.query(query, [userID], (error, results) => {
            if (error) {
                console.log(error);
                return reject(error);
            }
            resolve(results);
        });
    });

}

function updateUserDetails(
    connection, 
    { userID, 
      firstName,
      lastName, 
      email, 
      phoneNumber, 
      password,
      emailCheck
    }){
    return new Promise((resolve, reject) => {
        const query =  `UPDATE users
        SET 
            first_name = ?,
            last_name =?,
            password = ?,
            phone_number = ?,
            email = ?, 
            emailMessage = ?
        WHERE user_id = ?`;
        const params = [ 
            firstName,
            lastName, 
            password, 
            phoneNumber, 
            email, 
            emailCheck, 
            userID
        ];
        connection.query(query, params, (error, results) => {
            if (error) {
                console.log(error);
                return reject(error);
            }
            
            resolve(results);
        });
    });
}

function getUserDataByEmail(connection, email){
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM users
            WHERE email = ?
        `;
        connection.query(query, [email], (error, results) => {
            if(error){
                console.log("Error: ", error);
                reject(error);
            }
            console.log(email, results);
            
            resolve(results);
        })
    })
}

function addUserToDatabase(connection, {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    emailMessage
    }){
        
        return new Promise((resolve, reject) => {
            
            const query = ` INSERT INTO users (first_name, last_name, password, phone_number, email, emailMessage)
            VALUES(?, ?, ?, ?, ?, ?)`;
                    connection.query(query, [firstName,
                    lastName,
                    password,
                    phoneNumber,
                    email.toLowerCase(),
                    emailMessage],  (error, results) => {
                    if(error){
                        console.log(error);
                        return reject(error);
                        
                    }
            console.log("-------------------------------------");

                    console.log("Resolts from addUserToDatabase function-------> ", results);

                    return resolve(results.insertId);          
                })
            })
}

module.exports = {
    getUserDetails,
    updateUserDetails,
    getUserDataByEmail,
    addUserToDatabase
}