import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({errorFormat:"minimal"})

// peminjaman barang
const createBorrow = async (req: Request, res: Response): Promise<any> =>{
    try {
        const user_id = req.body.user_id
        const barang_id = req.body.barang_id
        const borrow_date = req.body.borrow_date
        const return_date = req.body.return_date

        const formatBorrowDate = new Date(borrow_date)
        const formatReturnDate = return_date ? new Date(return_date) : ""

        const newBorrow = await prisma.borrow.create({
            data: {
                user_id,
                barang_id,
                borrow_date: formatBorrowDate,
                return_date: formatReturnDate
            }
        })

        return res.status(200).json({
            status: "success",
            message: "Peminjaman berhasil ditambahkan",
            data: newBorrow
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error })
    }
}

// pengembalian barang
const createReturn = async (req: Request, res: Response): Promise<any> => {
    try {
        const borrow_id = req.body.borrow_id
        const return_date = req.body.return_date

        const formatReturnDate = new Date(return_date);

        const borrow = await prisma.borrow.findUnique({
            where: { id: borrow_id },
        });

        if (!borrow) {
            return res.status(404).json({ message: "Borrow record not found" });
        }

        const newReturn = await prisma.return.create({
            data: {
              borrow_id,
              user_id: borrow.user_id,   
              barang_id: borrow.barang_id, 
              return_date: formatReturnDate,
            },
          });
      
          return res.status(200).json({
            status: "success",
            message: "Pengembalian berhasil dicatat",
            data: {
              borrow_id: newReturn.borrow_id,
              user_id: newReturn.user_id,
              barang_id: newReturn.barang_id,
              actual_return_date: newReturn.return_date,
            },
          });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error })
    }
}

const readReturn = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id

        const returnData = await prisma.return.findUnique({
            where: { id: Number(id) }
        });
        return res.status(200).json({
            status: "success",
            data: returnData
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error })
    }
}

const analisisPeminjaman = async (req: Request, res: Response): Promise<any> => {
    try {
        const start_date = req.body.start_date
        const end_date = req.body.end_date
        const group_by = req.body.group_by

        // Validasi input
        if (!start_date || !end_date || !group_by) {
            return res.status(400).json({ 
                status: "error",
                message: "start_date, end_date, dan group_by harus disertakan" 
            })
        }

        const usageAnalysis = await prisma.borrow.groupBy({
            by: ["barang_id"],
            where: {
                borrow_date: {
                    gte: new Date(start_date),
                    lte: new Date(end_date),  
                },
            },
            _count: {
                id: true, // Menghitung total peminjaman (borrowed)
            },
            _sum: {
                barang_id: true, // Menghitung total barang yang dikembalikan (asumsi kamu punya field yang sesuai)
            },
        });

        // Transformasi hasil query ke format yang diminta
        const usage_analysis = usageAnalysis.map((item) => {
            const total_borrowed = item._count.id || 0
            const total_returned = item._sum.barang_id || 0
            return {
                group: item["barang_id"],
                total_borrowed,
                total_returned,
                items_in_use: total_borrowed - total_returned,
            };
        });

        return res.status(200).json({
            status: "success",
            data: {
                analysis_period: {
                    start_date,
                    end_date,
                },
                usage_analysis,
            },
        });
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Terjadi kesalahan pada server",
            error,
        });
    }
};

export { createBorrow, createReturn, readReturn, analisisPeminjaman }