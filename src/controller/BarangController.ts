import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({errorFormat:"minimal"})

const createBarang = async (req: Request, res: Response): Promise<any> => {
    try {
        const name = req.body.name
        const category = req.body.category
        const location = req.body.location
        const quantity = req.body.quantity

        const newBarang = await prisma.barang.create({
            data: {
                name,
                category,
                location,
                quantity
            }
        })

        return res.status(200).json({
            status: "success",
            message: "Barang berhasil ditambahkan",
            data: newBarang
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error })
    }
}

const readBarang = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id

        const barang = await prisma.barang.findUnique({
            where: { id: Number(id) }
        });
        return res.status(200).json({
            status: "success",
            data: barang
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error })
    }
}

const updateBarang = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id

        const findBarang = await prisma.barang.findFirst({
            where: {id: parseInt(id)}
        })
        if (!findBarang){
            return res.status(400).json({ message: "Barang tidak ditemukan"})
        }

        const name = req.body.name
        const category = req.body.category
        const location = req.body.location
        const quantity = req.body.quantity

        const updateBarang = await prisma.barang.update({
            where: {id: parseInt(id)},
            data: {
                name,
                category,
                location,
                quantity
            }
        })

        return res.status(200).json({
            status: "success",
            message: "Barang berhasil diubah",
            data: updateBarang
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
}

const deleteBarang = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id

        const findBarang = await prisma.barang.findFirst({
            where: {id: parseInt(id)}
        })
        if (!findBarang){
            return res.status(400).json({ message: "Barang tidak ditemukan"})
        }

        const deleteBarang = await prisma.barang.delete({
            where: {id: parseInt(id)}
        })

        return res.status(200).json({
            status: "success",
            message: "Barang berhasil dihapus",
            data: deleteBarang
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
}

export { createBarang, readBarang, updateBarang, deleteBarang }