const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['member', 'admin'], default: 'member' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  bio: { type: String, default: '' },
  profilePic: { type: String, default: '' },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

// Pre-save hook: hash password before storing (REMOVED 'next')
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return; // skip if password unchanged
  this.password = await bcrypt.hash(this.password, 12);
});

// Instance method: compare entered password with stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);