import express, { json } from "express";
import cors from "cors";
import corsSetting from "./middleware/corsSetting.js";
import { aircraftRoutes, userRoutes, exerciseRoutes, amadeusRoutes, perDiemRoutes } from "./routes/index.js";

const server = express();

//Middleware
server.use(json());
server.use(cors(corsSetting));
//Routes Path
server.use("/api/", aircraftRoutes);
server.use("/api/", userRoutes);
server.use("/api/", exerciseRoutes);
server.use("/api/", amadeusRoutes);
server.use("/api/", perDiemRoutes);

export default server;
