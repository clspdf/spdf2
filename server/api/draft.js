const mongoose = require('mongoose');

const mongo_string = 'mongodb://spdf_dev:cl.spdf@144.202.126.128:27017/spdf?authSource=test';

const data_db = mongoose.createConnection(mongo_string, {useNewUrlParser:true, useUnifiedTopology: true});

const schema = new mongoose.Schema({name: 'string', size: 'string'});
const tank = data_db.model('Tank', schema);

const small = new tank({name: 'small tank', size: 'small'});

small.save((err) => {
    console.log(err);
});





