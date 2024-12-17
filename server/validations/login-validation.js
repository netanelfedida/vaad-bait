

const  checkValidUsers = (connection, {email, password}) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT u.user_id, u.first_name, u.last_name
            FROM Users u
            WHERE email = ? AND password = ?
        `;
        connection.query(query, [email.toLowerCase(), password], (error, results) => {
            if (error) {                
                return reject(error);
            }
              
            resolve(results.length > 0 ? results[0] : null);
        });
    });
}

module.exports = {checkValidUsers};