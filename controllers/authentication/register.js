import Joi from 'joi'
import bcrypt from 'bcrypt'
import JwtService from '../../services/JwtServices'
import User from '../../models/userSchema'

import CustomErrorHandler from '../../services/CustomErrorHandler'

const registerController = {
  async tempReg (req, res, next) {
    const registerSchema = Joi.object({
      username: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      mobile: Joi.number().required(),
      password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+{}\\[\\]:;<>,.?~\\/\\-=|]{3,30}$'))
      .required(),
        cpassword: Joi.ref('password'),
    })

    const { error } = registerSchema.validate(req.body)
    if (error) {
      return next(error)
    }
    if (req.body.password !== req.body.cpassword) {
      return next(CustomErrorHandler.unauthorized('Passwords do not match'))
    }

    try {
      const exists = await User.exists({ email: req.body.email })
      if (exists) {
        return next(
          CustomErrorHandler.alreadyExists('This E-Mail already exists')
        )
      }
    } catch (error) {
      console.log(error);
      return next(error)
    }

    // Hash Password
    const { username, email, mobile } = req.body
    let user
    try {
      const hashedPass =  await bcrypt.hash(req.body.password, 10)
      console.log(hashedPass);
      user = new User({
        username,
        email,
        mobile,
        password: hashedPass
      })
    } catch (error) {
      console.log(error);
      next(error)
    }

    let access_token;

    try {
      const result = await user.save()

      access_token = JwtService.sign({
        _id: result._id,
        username: result.username
      })
    } catch (err) {
      console.log(error);

      return next(err)
    }

    res.json({ access_token })
  },

  async verify (req, res, next) {
    const { token } = req.params

    try {
      const user = await User.findOne({
        verificationToken: token,
        verificationExpires: { $gt: Date.now() }
      })

      if (!user) {
        return next(
          CustomErrorHandler.unauthorized('Invalid verification token')
        )
      }

      user.emailVerified = true
      user.verificationToken = undefined
      user.verificationExpires = undefined
      await user.save()

      res.json({ message: 'Email address verified' })
    } catch (err) {
      return next(err)
    }
  }
}

export default registerController
