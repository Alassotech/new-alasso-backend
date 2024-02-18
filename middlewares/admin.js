import { SECRETKEYFORFOUNDER } from '../config'
import CustomErrorHandler from '../services/CustomErrorHandler'
import JwtService from '../services/JwtServices'

const onlyAdmin = async (req, res, next) => {
  let authHeader = req.headers.authorization
  if (!authHeader) {
    return next(CustomErrorHandler.unAuthorised('Please Login'))
  }
  let token = authHeader.split(' ')[1]
  try {
    const { _id, username, email, role } = JwtService.verify(token)

    const user = {
      _id,
      username,
      email,
      role
    }
    if(user.role === SECRETKEYFORFOUNDER)
    {
      req.user = user
      next()
    }
    else{
      next(CustomErrorHandler.unAuthorised('Not an Admin'));
    }
    
  } catch (error) {
    return next(error)
  }
}

export default onlyAdmin
