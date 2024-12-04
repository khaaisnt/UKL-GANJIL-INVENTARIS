import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'

const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        // read token from header
        const header = req.headers.authorization
        const [type, token] = header ? header.split(" ") : []
        // verify token
        const signature = process.env.SECRET || ''
        const isVerified = jwt.verify(token, signature)
        if(!isVerified) {
            return res.status(401)
            .json({
                message: `Token tidak valid`
            })
        }
        next()
    } catch (error) {
        return res.status(401)
        .json({
            message: "Internal server error"
        })
    }
}

export {verifyToken}