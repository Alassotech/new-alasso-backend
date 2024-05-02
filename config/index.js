import dotenv from 'dotenv'

dotenv.config()

export const {
  APP_PORT,
  MONGODB_URI,
  DEBUG_MODE,
  SALT,
  JWTSECRETTOKEN,
  folderId,
  drivePath,
  OPENAI_API_KEY,
  SECRETKEYFORFOUNDER
} = process.env
