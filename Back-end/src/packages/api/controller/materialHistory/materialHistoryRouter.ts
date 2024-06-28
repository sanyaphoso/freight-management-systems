import Router from "express-promise-router";
import { validateToken } from "../../util/jwt";
import { createMaterialHistory, deleteMaterialHistory, getAllMaterialHistory, getMaterialHistory, updateMaterialHistory } from "./materialHistory";

const materialHistoryRouter = Router();
materialHistoryRouter.get("/", validateToken, getAllMaterialHistory);
materialHistoryRouter.get("/:id", validateToken, getMaterialHistory);
materialHistoryRouter.post("/", validateToken, createMaterialHistory);
materialHistoryRouter.put("/:id", validateToken, updateMaterialHistory);
materialHistoryRouter.delete("/:id", validateToken, deleteMaterialHistory);

export default materialHistoryRouter;
