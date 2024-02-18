import ReqCourse from '../models/reqCourse'
import Admin from '../models/adminSchema'
import CourseSchema from '../models/courseSchema'
import HelpSchema from '../models/helpSchema'
import NPTEL from '../models/nptelSchema'
import Dress from '../models/dressCode'
import File from '../models/fileSchema'
import CustomErrorHandler from '../services/CustomErrorHandler'
const userController = {
  async get (req, res, next) {
    try {
      res.send('Hii from Server')
    } catch (error) {
      next(error)
    }
  },

  async addDress (req, res, next) {
    try {
      const { name, uid, number, selectedItems, pantsColor, upiId, size } =
        req.body

      const dress = new Dress({
        name,
        uid,
        number,
        selectedItems,
        pantsColor,
        upiId,
        size
      })

      dress.save((err, savedDress) => {
        if (err) {
          res.status(500).json({ error: 'Internal server error' })
        } else {
          res.status(201).json({ message: 'Booked SuccessFull' })
        }
      })
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  async reqCourse (req, res, next) {
    const newCourse = new ReqCourse({
      courseName: req.body.courseName,
      platform: req.body.platform,
      completed: false
    })

    try {
      await newCourse.save(err => {
        if (err) {
          res.sendStatus(500)
        } else {
          res.sendStatus(200)
        }
      })
    } catch (error) {
      return next(error)
    }
  },

  async getDeveloper (req, res, next) {
    Admin.find((err, data) => {
      if (err) {
        res.status(500).send(err.message)
      } else {
        res.status(200).send(data)
      }
    })
  },
  async getAllFiles (req, res, next) {
    try {
      const { sub, sem } = req.params
      const regexPattern = new RegExp(sub, 'i')
      const files = await File.find(
        {
          subject: { $regex: regexPattern },
          semester: sem
        },
        '_id title unit file_category link file_path'
      )
        .sort({ createdAt: -1 })
        .exec()

      res.status(200).send(files)
    } catch (error) {
      console.log(error)
      res
        .status(400)
        .send('Error while getting list of files. Try again later.')
    }
  },

  async getCourse (req, res, next) {
    try {
      CourseSchema.find((err, data) => {
        if (err) {
          res.status(500).send(err.message)
        } else {
          res.status(200).send(data)
        }
      })
    } catch (error) {
      return next(error)
    }
  },
  async getDounts () {
    HelpSchema.find((err, data) => {
      if (err) {
        res.status(500).send(err.message)
      } else {
        res.status(200).send(data)
      }
    })
  },
  async getNptelCourse (req, res, next) {
    const nptelNames = await NPTEL.find({}, 'courseName link')
    res.json(nptelNames)
  },
  async getNptelAssignments (req, res, next) {
    try {
      const nptelNames = await NPTEL.aggregate([
        {
          $match: { courseName: req.params.courseName }
        },
        {
          $unwind: '$assignments'
        },
        {
          $addFields: {
            'assignments.week_num': { $toInt: '$assignments.week_num' } 
          }
        },
        {
          $sort: { 'assignments.week_num': -1 }
        },
        {
          $group: {
            _id: '$_id',
            assignments: { $push: '$assignments' }
          }
        },
        {
          $project: {
            assignments: 1
          }
        }
      ])

      res.json(nptelNames)
    } catch (error) {
      next(CustomErrorHandler.notExists('Error Finding Data'))
    }
  }
}

export default userController
