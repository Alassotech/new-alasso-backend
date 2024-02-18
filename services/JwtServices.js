import jwt from 'jsonwebtoken'
import { JWTSECRETTOKEN } from '../config'

class JwtService{

    static sign(payload, expiry = '20d', secret = JWTSECRETTOKEN){
        return jwt.sign(payload, secret, {expiresIn:expiry})
    }
    static verify(token, secret = JWTSECRETTOKEN){
        return jwt.verify(token, secret)
    }

}

export default JwtService