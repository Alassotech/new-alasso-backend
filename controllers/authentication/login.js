import Joi from 'joi'
import User from '../../models/userSchema'
import bcrypt from 'bcrypt'
import JwtService from '../../services/JwtServices'
import CustomErrorHandler from '../../services/CustomErrorHandler'
import { SECRETKEYFORFOUNDER } from '../../config'

const loginController = {
  async login (req, res, next) {
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(
          new RegExp('^[a-zA-Z0-9!@#$%^&*()_+{}\\[\\]:;<>,.?~\\/\\-=|]{3,30}$')
        )
        .required()
    })

    const { email, password } = req.body
    const { error } = loginSchema.validate(req.body)
    if (error) {
      return next(error)
    }
    try {
      //Find User
      const user = await User.findOne({
        email
      })

      if (!user) {
        return next(
          CustomErrorHandler.notExists("User Doesn't Exists, Please Sign Up")
        )
      }
      // Comapre Password
      const match = await bcrypt.compare(password, user.password)

      if (!match) {
        return next(CustomErrorHandler.wrongPassword('Wrong Password'))
      }

      //   Token

      if (user.role === SECRETKEYFORFOUNDER) {
        const access_token = JwtService.sign({
          _id: user._id,
          username: user.username,
          email: user.email,
          mobile: user.mobile,
          role: user.role
        })

        res.cookie('usercookie', access_token, {
          expires: new Date(Date.now() + 9000000),
          httpOnly: true
        })

        res.status(201).json({ access_token })
      } else {
        //   Token
        const access_token = JwtService.sign({
          _id: user._id,
          username: user.username,
          mobile: user.mobile,
          email: user.email,
          role: user.role
        })

        res.cookie('usercookie', access_token, {
          expires: new Date(Date.now() + 9000000),
          httpOnly: true
        })

        res.status(201).json({ access_token })
      }
    } catch (err) {
      
      return next(err)
    }
  },

  async validateUser (req, res, next) {
    try {
      const response = JwtService.verify(req.token)
      res.send(response)
    } catch (error) {
      return next(error)
    }
  },

  async getByID (req, res, next) {
    try {
      const id = req.params.id
      const user = await User.findById(id).select('-password -role -__v')
      res.json({ user })
    } catch (error) {
      return next(error)
    }
  }
}
export default loginController
