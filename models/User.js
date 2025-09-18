const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Mã hoá mật khẩu trước khi lưu
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Kiểm tra mật khẩu
userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);