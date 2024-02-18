import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
  username: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  mobile: {
    type: Number,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  cpassword: {
    type: String,
    require: true
  },
  role: {
    type: String,
    default: 'user'
  }
})

const User = mongoose.model('User', userSchema)
export default User