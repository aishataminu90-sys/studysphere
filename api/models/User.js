const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({

//name of the user 
name:{
    type: String,
    required: true
},
//email of the user 
email: {
    type: String,
    required: true,
    unique: true,
},
//password
password: {
    type: String,
    required: true,
    
},
//their university
university: {
    type: String,
    year: String,
    course: String
}
}, { timestamps: true });

module.exports = mongoose.model('User',userSchema);