import express from "express";
import { saveHistory, getHistory, deleteHistory } from "../controllers/historycontroller.js";

const historyRouter = express.Router();

historyRouter.post("/save", saveHistory);
historyRouter.get("/", getHistory);
historyRouter.delete("/:id", deleteHistory);

export default historyRouter;