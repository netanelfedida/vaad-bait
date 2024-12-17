const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'natimami1234',
    database: 'vaad_bait'
  });
  
  
  connection.connect(error => {
    if (error) {
      console.error('Error connecting to the database:', error);
      return;
    }
    console.log('Connected to the MySQL database.');
  });


  module.exports = { connection };