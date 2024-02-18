import mongoose from 'mongoose'

const Society_Post = mongoose.Schema(
  {
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true
    },
    description: {
      type: String,
      require: true
    },
    title: {
      type: String,
      require: true
    },
    poster: {
      type: String,
      require: true
    },
    links: [
      { registrationLink: String },
      { whatsApp: String },
      { linkedIn: String },
      { Any_other: String }
    ]
  },
  {
    timestamps: true
  }
)

const User = mongoose.model('SocietyData', Society_Post)
export default User
