import { Router } from "express";
import { createUser, readUser, updateUser, deleteUser, authentication } from "../controller/UserController";
import { createValidation, updateValidation, deleteValidation, authValidation } from "../middleware/UserValidation";
import { verifyToken } from "../middleware/authorization";

const router = Router();

router.post("/", [verifyToken, createValidation],createUser);

router.get("/", [verifyToken],readUser);

router.put("/:id", [verifyToken, updateValidation],updateUser);

router.delete("/:id", [verifyToken, deleteValidation],deleteUser);

router.post("/auth", [authValidation], authentication);

export default router