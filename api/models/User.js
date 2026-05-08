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
  },
 
  year: {
    type: String,
  },
 
  course: {
    type: String,
  },
//role - user default, admin assigned
role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
}
}, { timestamps: true });

module.exports = mongoose.model('User',userSchema);