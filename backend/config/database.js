const mongoose = require("mongoose")

const connectDatabase = ()=>{
    return mongoose.connect(process.env.DB_URI).then((con) =>{
        console.log(`Mongodb connected with HOST:${con.connection.host}`)
    })
}

module.exports = connectDatabase