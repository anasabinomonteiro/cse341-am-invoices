// This code defines a Mongoose schema for a User model, including methods for password hashing and verification.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: String,
    googleId: String,
    name: String
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.correctPassword = async function (candidate, hash) {
    return bcrypt.compare(candidate, hash);
};

module.exports = mongoose.model('User', userSchema);
