const mysql = require('mysql2')

const pool = mysql.createPool({
host: 'localhost',
user: 'root',
database: 'chat_backend'
})




pool.getConnection((err)=>{

    if(err){
        console.log(err)} 
    else
    {console.log("db is Connected")}}
)


module.exports = pool
