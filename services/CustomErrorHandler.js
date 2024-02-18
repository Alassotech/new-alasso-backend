class CustomErrorHandler extends Error {
  constructor (status, msg) {
    super()
    this.status = status
    this.message = msg
  }

  static alreadyExists (message) {
    return new CustomErrorHandler(409, message)
  }
  static notExists (message) {
    return new CustomErrorHandler(409, message)
  }
  static wrongPassword (message) {
    return new CustomErrorHandler(409, message)
  }
  static unAuthorised (message) {
    return new CustomErrorHandler(405, message)
  }
}



export default CustomErrorHandler