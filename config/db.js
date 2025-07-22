const mongoose = require('mongoose');
require('dotenv').config()

const { MONGO_URL, MONGO_LOCAL_URL } = process.env;
const database = () => {
    mongoose.connect(`${MONGO_URL}`).then(() => {
        console.log('DataBase Connection Success!')
    })
        .catch((error) =>
            console.log('Db Connection Error: ' + error.message)
        )
}
module.exports = database