import mongoose from 'mongoose';

const user = new mongoose.Schema({
  googleId: {
    required: false,
    type: String,
  },
  twitterId: {
    required: false,
    type: String,
  },
  githubId: {
    required: false,
    type: String,
  },
  username: {
    required: true,
    type: String,
  },
});

export default mongoose.model('User', user);

// const userSchema = new Schema(
//   {
//     email: {
//       type: String,
//       unique: true,
//     },
//     name: String,
//     password: String,
//     roles: [String],
//     confirmation_code: String,
//     confirmed: { type: Boolean, default: false },
//     google: {
//       id: String,
//       token: String,
//       email: String,
//       name: String,
//     },
//   },
//   { timestamps: true }
// );

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });
