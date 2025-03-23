const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;



// account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }