import express from "express";
import { Router } from "express";
import UserRouter from "./router/UserRouter";
import BarangRouter from "./router/BarangRouter";

const app = express();

app.use(express.json());

app.use("/user", UserRouter);

app.use("/barang", BarangRouter);

const PORT = 5050;
app.listen(PORT, () => {
  console.log(`server run on port ${PORT}`);
});