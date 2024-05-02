import express from 'express'
import {
  userController,
  loginController,
  registerController,
} from '../controllers'
import protect from '../middlewares/auth'

const router = express.Router()

router.get('/', userController.get)
router.post('/user/login', loginController.login)
router.post('/validate', protect ,loginController.validateUser)
router.post('/user/register', registerController.tempReg)



router.get('/get-developers', userController.getDeveloper)
router.post('/submit-course', protect ,userController.reqCourse)
router.post('/buy/dress', protect ,userController.addDress)

router.get('/getAllFiles/:sub/:sem', userController.getAllFiles)
router.get('/getcourse', userController.getCourse)
router.get('/get-doubts', userController.getDounts)
router.get('/nptel-courses', userController.getNptelCourse)
router.get('/nptel-courses/:courseName', userController.getNptelAssignments)

export default router

