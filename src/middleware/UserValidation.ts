import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const createUser = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().valid("ADMIN", "USER").required()
})

const createValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    const validate = createUser.validate(req.body)
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

const updateUser = Joi.object({
    username: Joi.string().optional(),
    password: Joi.string().optional()
})

const updateValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    const validate = updateUser.validate(req.body)
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

const deleteUser = Joi.object({
    username: Joi.string().optional(),
    password: Joi.string().optional()
})

const deleteValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    const validate = deleteUser.validate(req.body)
    if (validate.error) {
        return res.status(400).json({
            message: validate
            .error
            .details
            .map( item=> item.message ).join()
        })
    }
    return next()
}

const authSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
})

const authValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    const validate = authSchema.validate(req.body)
    if (validate.error) {
        return res.status(400).json({
            message: validate
            .error
            .details
            .map( item=> item.message ).join()
        })
    }
    return next()
}

export { createValidation, updateValidation, deleteValidation, authValidation }