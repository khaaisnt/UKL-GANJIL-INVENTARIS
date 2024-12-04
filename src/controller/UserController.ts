import { Request, Response } from "express";
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient({errorFormat:"minimal"})

const createUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const username: string = req.body.username
        const password: string = req.body.password
        const role: UserRole = req.body.role

        const findUsername = await prisma.user.findFirst({where: {username}})
        if (findUsername){
            return res.status(400).json({ message: "User has exist"})
        }
        const hashPassword = await bcrypt.hash(password, 12)

        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashPassword,
                role
            }
        })

        return res.status(200).json({
            message: "New user has been created",
            data: newUser
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error })
    }
}

const readUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const search = req.query.search
        const allUser = await prisma.user.findMany({
            where: {
                OR: [
                    {username: {contains: search?.toString() || ""}},                                     
               ]
            }
        })
        return res.status(200).json({
            message: "List of users",
            data: allUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error })
    }
}

const updateUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id

        const findUser = await prisma.user.findFirst({
            where: {id: Number(id)}
        })

        if(!findUser) {
            return res.status(200).json ({
                message: `User is not found`
            })
        }

        const {username, password} = req.body

        const saveUser = await prisma.user.update({
            where: {id: Number(id)},
            data: {
                username: username ?? findUser.username,
                password: password ?? findUser.password
            }
        })

        return res.status(200).json({
            message: `User has been updated`,
            data: saveUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error })
    }
}

const deleteUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id

        const findUser = await prisma.user.findFirst({
            where: {
                id: Number(id)
            }
        })

        if(!findUser) {
            return res.status(200).json({message: `User is not found`})
        }

        const saveUser = await prisma.user.delete({
            where: {id: Number(id)}
        })

        return res.status(200).json ({
            message: `User has been removed`,
            data: saveUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error })
    }
}

// function for login (authentication)
const authentication = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        const {username, password} = req.body

        const findUser = await prisma.user.findFirst({
            where: {username}
        })

        if(!findUser) {
            return res.status(200)
            .json({
                message: `Username or password is not registered`
            })
        }

        // Check password
        const isMatchPassword = await bcrypt.compare(password, findUser.password)

        if(!isMatchPassword) {
            return res.status(200)
            .json({
                message: `Invalid password`
            })
        }

        // prepare to generate token using JWT
        const payload = {
            username: findUser.username,
            role: findUser.role
        }
        const signature = process.env.SECRET || ``

        const token = jwt.sign(payload, signature)

        return res.status(200)
        .json({
            logged: true,
            token,
            id: findUser.id,
            username: findUser.username,
            message: `Login berhasil`
        })

    } catch (error) {
        return res.status(500)
        .json({error})
    }
}

export { createUser, readUser, updateUser, deleteUser, authentication }