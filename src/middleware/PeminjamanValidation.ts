import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const createBorrow = Joi.object({
   user_id: Joi.number().required(),
    barang_id: Joi.number().required(),
    borrow_date: Joi.date().required(),
    return_date: Joi.date().required()
})

const borrowValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    const validate = createBorrow.validate(req.body)
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

const createReturn = Joi.object({
    borrow_id: Joi.number().required(),
    return_date: Joi.date().required()
})

const returnValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    const validate = createReturn.validate(req.body)
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

export { borrowValidation, returnValidation }