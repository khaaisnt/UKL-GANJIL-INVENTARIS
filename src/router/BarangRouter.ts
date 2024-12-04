import { Router } from "express";
import { createBarang, readBarang, updateBarang, deleteBarang } from "../controller/BarangController";
import { analisisPeminjaman, createBorrow, createReturn, readReturn } from "../controller/PeminjamanController";
import { createValidation, updateValidation, deleteValidation, adminAutorization } from "../middleware/BarangValidation";
import { verifyToken } from "../middleware/authorization";
import { borrowValidation, returnValidation } from "../middleware/PeminjamanValidation";

const router = Router();

// barang
router.post("/", [adminAutorization,createValidation], createBarang);

router.get("/:id", [adminAutorization], readBarang);

router.put("/:id", [adminAutorization, updateValidation], updateBarang);

router.delete("/:id", [adminAutorization, deleteValidation], deleteBarang);

// peminjaman
router.post("/borrow", [borrowValidation], createBorrow);

router.post("/return", [returnValidation], createReturn);

router.get("/return/:id", readReturn);

router.post("/usage-report", analisisPeminjaman)

export default router