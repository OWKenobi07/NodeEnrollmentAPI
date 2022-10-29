
// Manage environmental variable that should not be visible to anyone
require("dotenv").config();

let sqlUser = process.env.SQL_USER
let sqlPassword = process.env.SQL_PASSWORD
//----------------------------------------

// To allow cross origin input and output --> npm i cors^2.8.5
const cors = require('cors');
const crossOrigin = cors({origin:"*"})
//----------------------------------------


// To allow msSQL connectivity --> npm i mssql^8.1.0
const sqlConfigMain = {
    server: 'LUPUS-REX\\SQL2017',
    port: 4336,
    user: sqlUser,
    password: sqlPassword,
    database: 'ENS',
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: true, // for azure
      trustServerCertificate: true, // change to true for local dev / self-signed certs
    }
  }
//----------------------------------------


//To connect store session-----------------
const msSQLSession = require('connect-mssql-v2')

const options = {
  table: "mySessions"
}

const sqlStore = new msSQLSession(sqlConfigMain, options)
//----------------------------------------
 

module.exports = {
    sqlConfigMain,
    crossOrigin,
    sqlStore,
}