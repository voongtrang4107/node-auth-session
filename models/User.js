import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true }
});

userSchema.methods.setPassword = async function(plain) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(plain, salt);
};

userSchema.methods.checkPassword = async function(plain) {
    return bcrypt.compare(plain, this.passwordHash);
};

export default mongoose.model("User", userSchema);