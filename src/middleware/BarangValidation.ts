import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import jwt from 'jsonwebtoken'

const adminAutorization = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(401).json({ message: "Token tidak ditemukan" })
        }
        const token = authHeader.split(" ")[1]
        const signature = process.env.SECRET || ""

        const decoded = jwt.verify(token, signature) as any

        if (decoded.role !== "ADMIN"){
            return res.status(401).json({
                message: "Anda tidak memiliki akses"
            })
        }
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ 
            message: "Token tidak valid"
         })
    }
}

const createBarang = Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
    location: Joi.string().required(),
    quantity: Joi.number().min(0).required()
})

const createValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    const validate = createBarang.validate(req.body)
    if (validate.error) {
        return res.status(400).json({
            message: validate
            .error
            .details
            .map(item => item.message)
            .join()
        })
    }
    return next()
}

const updateBarang = Joi.object({
    name: Joi.string().optional(),
    category: Joi.string().optional(),
    location: Joi.string().optional(),
    quantity: Joi.number().min(0).optional()
})

const updateValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    const validate = updateBarang.validate(req.body)
    if (validate.error) {
        return res.status(400).json({
            message: validate
            .error
            .details
            .map(item => item.message).join()
        })
    }
    return next()
}

const deleteBarang = Joi.object({
    name: Joi.string().optional(),
    category: Joi.string().optional(),
    location: Joi.string().optional(),
    quantity: Joi.number().optional()
})

const deleteValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    const validate = deleteBarang.validate(req.body)
    if (validate.error) {
        return res.status(400).json({
            message: validate
            .error
            .details
            .map(item => item.message).join()
        })
    }
    return next()
}

export { createValidation, updateValidation, deleteValidation, adminAutorization }